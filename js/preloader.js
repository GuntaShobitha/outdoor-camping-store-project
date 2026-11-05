/**
 * STACKLY OUTDOOR & CAMPING - Preloader & Heading Text Animations
 * High-performance, zero-dependency engine for expedition preloader
 * and kinetic editorial heading animations across every page.
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. PRELOADER CONTROLLER
  // ============================================================================

  const PreloaderManager = {
    element: null,
    progressBar: null,
    statusEl: null,
    percentEl: null,
    currentPercent: 0,
    targetPercent: 0,
    intervalId: null,
    isComplete: false,
    hasSafetyTriggered: false,

    statusStages: [
      { max: 25, text: 'Calibrating Altimeter...' },
      { max: 55, text: 'Packing Backcountry Gear...' },
      { max: 85, text: 'Mapping Wilderness Route...' },
      { max: 99, text: 'Acquiring Mountain Coordinates...' },
      { max: 100, text: 'Expedition Ready.' }
    ],

    init() {
      this.ensureMarkup();
      this.cacheElements();
      if (!this.element) return;

      this.startProgressSimulation();
      this.bindWindowLoad();
    },

    ensureMarkup() {
      let preloader = document.getElementById('stacklyPreloader');
      if (!preloader) {
        const markup = `
          <div id="stacklyPreloader" class="stackly-preloader" aria-hidden="true">
            <div class="preloader-inner">
              <div class="preloader-emblem">
                <svg class="preloader-mountain-svg" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,12 88,72 12,72" stroke="rgba(196,154,82,0.3)" stroke-width="2" fill="none" stroke-linejoin="round"/>
                  <path class="peak-path" d="M50 14 L22 68 H78 L50 14Z" stroke="#C49A52" stroke-width="2.5" stroke-linejoin="round" fill="rgba(16,42,36,0.6)"/>
                  <path class="peak-crease" d="M50 14 L46 36 L54 52 L50 68" stroke="#C49A52" stroke-width="1.8" stroke-linecap="round"/>
                  <path class="peak-snow" d="M42 30 L50 34 L58 30 L50 14 Z" fill="rgba(233,224,206,0.45)"/>
                  <circle cx="75" cy="24" r="5" fill="#C49A52" class="preloader-sun"/>
                  <circle cx="75" cy="24" r="9" stroke="rgba(196,154,82,0.4)" stroke-width="1" class="preloader-sun-ring"/>
                </svg>
                <div class="preloader-compass-glow"></div>
              </div>
              <div class="preloader-brand-text">STACKLY</div>
              <div class="preloader-sub-text">OUTDOOR &bull; EXPEDITION</div>
              <div class="preloader-progress-wrap">
                <div class="preloader-progress-track">
                  <div class="preloader-progress-bar" id="preloaderProgressBar"></div>
                </div>
                <div class="preloader-meta">
                  <span class="preloader-status-msg" id="preloaderStatusMsg">Mapping Trail...</span>
                  <span class="preloader-percent" id="preloaderPercent">0%</span>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', markup);
      }
    },

    cacheElements() {
      this.element = document.getElementById('stacklyPreloader');
      if (!this.element) return;
      this.progressBar = document.getElementById('preloaderProgressBar');
      this.statusEl = document.getElementById('preloaderStatusMsg');
      this.percentEl = document.getElementById('preloaderPercent');
    },

    updateUI(percent) {
      this.currentPercent = Math.min(100, Math.max(0, percent));
      if (this.progressBar) {
        this.progressBar.style.width = `${this.currentPercent}%`;
      }
      if (this.percentEl) {
        this.percentEl.textContent = `${Math.round(this.currentPercent)}%`;
      }
      if (this.statusEl) {
        const stage = this.statusStages.find(s => this.currentPercent <= s.max);
        if (stage && this.statusEl.textContent !== stage.text) {
          this.statusEl.textContent = stage.text;
        }
      }
    },

    startProgressSimulation() {
      // Rapid ramp to 35%, then smooth pacing towards 85%
      this.targetPercent = 35;
      this.updateUI(15);

      this.intervalId = setInterval(() => {
        if (this.isComplete) return;

        if (this.currentPercent < this.targetPercent) {
          const step = (this.targetPercent - this.currentPercent) * 0.2 + 1;
          this.updateUI(this.currentPercent + step);
        } else if (this.targetPercent < 88) {
          this.targetPercent += Math.floor(Math.random() * 12) + 5;
          if (this.targetPercent > 88) this.targetPercent = 88;
        }
      }, 70);
    },

    finish() {
      if (this.isComplete) return;
      this.isComplete = true;

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.updateUI(100);

      // Brief dwell on 100% Expedition Ready
      setTimeout(() => {
        if (!this.element) return;
        this.element.classList.add('fade-out');

        // Broadcast event for page elements & heading animator
        window.dispatchEvent(new CustomEvent('stackly:preloader-done'));

        setTimeout(() => {
          if (this.element) {
            this.element.classList.add('is-hidden');
            this.element.setAttribute('aria-hidden', 'true');
          }
        }, 650);
      }, 160);
    },

    bindWindowLoad() {
      // If page is already loaded (e.g. cached / fast execution)
      if (document.readyState === 'complete') {
        setTimeout(() => this.finish(), 120);
        return;
      }

      const onPageLoaded = () => {
        window.removeEventListener('load', onPageLoaded);
        this.finish();
      };

      window.addEventListener('load', onPageLoaded);

      // Safety timeout: Maximum 1.4s so preloader never leaves user waiting
      setTimeout(() => {
        if (!this.isComplete) {
          this.hasSafetyTriggered = true;
          this.finish();
        }
      }, 1400);
    }
  };

  // ============================================================================
  // 2. HEADING TEXT ANIMATION ENGINE
  // ============================================================================

  const HeadingAnimationEngine = {
    observer: null,
    initialized: false,

    init() {
      if (this.initialized) return;
      this.initialized = true;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        document.querySelectorAll('h1, h2, h3, .section-title-serif').forEach(h => {
          h.classList.add('heading-in-view');
        });
        return;
      }

      this.setupObserver();
      this.processHeadings();
      this.observeHeadings();

      // Hook into preloader completion or trigger immediately for above-the-fold
      window.addEventListener('stackly:preloader-done', () => {
        this.triggerInitialHeadings();
      });

      // Fallback: If preloader finishes before this listener or in case of direct execution
      setTimeout(() => {
        this.triggerInitialHeadings();
      }, 600);

      // Listen for dynamic DOM additions
      this.observeMutations();
    },

    setupObserver() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('h1, h2, h3').forEach(h => h.classList.add('heading-in-view'));
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('heading-in-view');
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      });
    },

    processHeadings() {
      const headingSelectors = [
        'h1',
        'h2',
        'h3',
        '.section-title-serif',
        '.hero-title',
        '.auth-visual-title',
        '.auth-form-title',
        '.dash-page-title',
        '.error-title',
        '.shop-callout-title',
        '.story-headline'
      ];

      const elements = document.querySelectorAll(headingSelectors.join(', '));

      elements.forEach(heading => {
        // Skip already processed
        if (heading.dataset.headingProcessed) return;
        heading.dataset.headingProcessed = 'true';

        // Add base animation class
        heading.classList.add('heading-animated');

        // Detect if it's an above-the-fold / hero heading
        const rect = heading.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight * 0.8) {
          heading.classList.add('hero-heading-immediate');
        }

        // Add gold accent line for primary section titles if appropriate
        if (
          heading.classList.contains('section-title-serif') ||
          heading.classList.contains('shop-callout-title') ||
          heading.classList.contains('story-headline')
        ) {
          this.appendAccentLine(heading);
        }

        // Check if heading is safe for word-by-word kinetic splitting
        if (this.canSplitWords(heading)) {
          this.splitIntoWords(heading);
        }
      });
    },

    canSplitWords(el) {
      // Don't split if explicitly disabled or has interactive inputs/buttons
      if (el.dataset.noSplit === 'true') return false;

      // Don't split dynamic JS text containers (e.g. greeting or count)
      const dynamicIds = ['dashUserGreeting', 'dashPageTitle', 'cartItemCount', 'dashCartCount'];
      if (dynamicIds.includes(el.id)) return false;

      // Don't split headings containing form controls or complex elements
      if (el.querySelector('button, input, select, textarea, form, svg, img')) return false;

      // Check for headings with simple text or single links / spans
      const isMajorHeading = el.tagName === 'H1' ||
                             el.tagName === 'H2' ||
                             el.classList.contains('section-title-serif') ||
                             el.classList.contains('hero-title') ||
                             el.classList.contains('auth-visual-title');

      return isMajorHeading;
    },

    splitIntoWords(el) {
      let wordCounter = 0;

      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) return document.createTextNode(text);

          const frag = document.createDocumentFragment();
          // Split on spaces preserving word breaks
          const tokens = text.split(/(\s+)/);

          tokens.forEach(token => {
            if (/^\s+$/.test(token)) {
              // Whitespace
              const space = document.createElement('span');
              space.className = 'heading-space';
              space.innerHTML = '&nbsp;';
              frag.appendChild(space);
            } else if (token.length > 0) {
              const mask = document.createElement('span');
              mask.className = 'heading-word-mask';

              const wordSpan = document.createElement('span');
              wordSpan.className = 'heading-word';
              wordSpan.style.setProperty('--word-idx', wordCounter++);
              wordSpan.textContent = token;

              mask.appendChild(wordSpan);
              frag.appendChild(mask);
            }
          });

          return frag;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') {
            return node.cloneNode(true);
          }

          // If node is a span or link, process its internal text
          const clone = node.cloneNode(false);
          if (node.classList.contains('gold-highlight') || node.tagName === 'SPAN') {
            clone.classList.add('gold-highlight');
          }

          Array.from(node.childNodes).forEach(child => {
            clone.appendChild(processNode(child));
          });

          return clone;
        }
        return node.cloneNode(true);
      };

      const originalNodes = Array.from(el.childNodes);
      const fragment = document.createDocumentFragment();

      originalNodes.forEach(child => {
        // Keep existing accent lines intact
        if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('heading-accent-line')) {
          fragment.appendChild(child);
        } else {
          fragment.appendChild(processNode(child));
        }
      });

      el.innerHTML = '';
      el.appendChild(fragment);
    },

    appendAccentLine(heading) {
      if (heading.querySelector('.heading-accent-line')) return;
      if (heading.nextElementSibling && heading.nextElementSibling.classList.contains('heading-accent-line')) return;

      const line = document.createElement('span');
      line.className = 'heading-accent-line';

      // Check alignment
      const computedStyle = window.getComputedStyle(heading);
      if (computedStyle.textAlign === 'left' || heading.classList.contains('text-left')) {
        line.classList.add('line-left');
      }

      heading.appendChild(line);
    },

    observeHeadings() {
      if (!this.observer) return;
      document.querySelectorAll('.heading-animated:not(.heading-in-view)').forEach(h => {
        this.observer.observe(h);
      });
    },

    triggerInitialHeadings() {
      // Check all headings currently within the visible viewport
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('.heading-animated:not(.heading-in-view)').forEach(h => {
        const rect = h.getBoundingClientRect();
        if (rect.top < windowHeight * 0.9 && rect.bottom >= 0) {
          h.classList.add('heading-in-view');
          if (this.observer) {
            this.observer.unobserve(h);
          }
        }
      });
    },

    observeMutations() {
      if (!('MutationObserver' in window)) return;

      const mutationObserver = new MutationObserver((mutations) => {
        let hasNewHeadings = false;
        mutations.forEach(m => {
          if (m.addedNodes.length > 0) {
            m.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches('h1, h2, h3') || node.querySelector('h1, h2, h3')) {
                  hasNewHeadings = true;
                }
              }
            });
          }
        });

        if (hasNewHeadings) {
          this.processHeadings();
          this.observeHeadings();
        }
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };

  // ============================================================================
  // 3. INITIALIZATION BOOTSTRAP
  // ============================================================================

  // Initialize preloader immediately so progress bar starts without delay
  try {
    PreloaderManager.init();
  } catch (err) {
    console.warn('[Stackly Preloader] Early init error:', err);
  }

  // Initialize heading animation engine as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      HeadingAnimationEngine.init();
    });
  } else {
    HeadingAnimationEngine.init();
  }

  // Expose to global window for extensibility
  window.StacklyPreloader = PreloaderManager;
  window.StacklyHeadings = HeadingAnimationEngine;

})();

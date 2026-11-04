/**
 * STACKLY OUTDOOR & CAMPING - Master Nature Effects & Animation Engine
 * 1. Realistic Falling Leaves Simulation (Canvas 60fps, wind drift, 3D rotations)
 * 2. Multi-Layer Forest Parallax & Atmospheric Lighting
 * 3. Scroll-Bound Trail Runner & Interactive Telemetry
 * 4. Bi-directional Scroll Reveal & Animated Number Counters
 */

class FallingLeavesEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.leaves = [];
    this.maxLeaves = window.innerWidth < 768 ? 16 : 28;
    this.animId = null;
    this.isRunning = false;
    this.wind = 0.5;
    this.windTarget = 0.8;
    this.palette = [
      "#647C50", // Moss Green
      "#A7B89A", // Sage Green
      "#C49A52", // Golden Accent
      "#795C43", // Earth Brown
      "#E9E0CE"  // Warm Sand
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize(), { passive: true });

    // Populate initial leaves
    for (let i = 0; i < this.maxLeaves; i++) {
      this.leaves.push(this.createLeaf(true));
    }

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(this.canvas);
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = this.canvas.height = parent ? parent.clientHeight : window.innerHeight;
  }

  createLeaf(randomY = false) {
    const type = Math.floor(Math.random() * 3); // 0: birch, 1: needle, 2: oak
    const size = Math.random() * 12 + 10;
    return {
      type,
      x: Math.random() * (this.width || window.innerWidth),
      y: randomY ? Math.random() * (this.height || window.innerHeight) : -20 - Math.random() * 50,
      size,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      rotX: Math.random() * Math.PI,
      rotXSpeed: Math.random() * 0.03 + 0.01,
      opacity: Math.random() * 0.5 + 0.45,
      color: this.palette[Math.floor(Math.random() * this.palette.length)],
      swayFreq: Math.random() * 0.02 + 0.01,
      swayAmp: Math.random() * 1.8 + 0.8,
      swayOffset: Math.random() * Math.PI * 2
    };
  }

  drawBirchLeaf(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.7, -size * 0.5, size * 0.8, size * 0.3, 0, size);
    ctx.bezierCurveTo(-size * 0.8, size * 0.3, -size * 0.7, -size * 0.5, 0, -size);
    ctx.fill();
    // Central vein
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(0, size * 0.8);
    ctx.strokeStyle = "rgba(16, 42, 36, 0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawPineNeedle(ctx, size) {
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.2, size * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawOakLeaf(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.6, size * 0.4, -size * 0.2);
    ctx.quadraticCurveTo(size * 0.8, 0, size * 0.4, size * 0.4);
    ctx.quadraticCurveTo(size * 0.5, size * 0.8, 0, size);
    ctx.quadraticCurveTo(-size * 0.5, size * 0.8, -size * 0.4, size * 0.4);
    ctx.quadraticCurveTo(-size * 0.8, 0, -size * 0.4, -size * 0.2);
    ctx.quadraticCurveTo(-size * 0.6, -size * 0.6, 0, -size);
    ctx.fill();
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Natural wind variation
    this.wind += (this.windTarget - this.wind) * 0.02;
    if (Math.random() < 0.015) {
      this.windTarget = (Math.random() - 0.2) * 1.6;
    }

    const time = Date.now() * 0.002;

    for (let i = 0; i < this.leaves.length; i++) {
      const l = this.leaves[i];

      // Update positions
      l.y += l.speedY;
      l.x += l.speedX + Math.sin(time * l.swayFreq * 10 + l.swayOffset) * l.swayAmp + this.wind;
      l.rotation += l.rotSpeed;
      l.rotX += l.rotXSpeed;

      // Wrap or respawn
      if (l.y > this.height + 25 || l.x < -40 || l.x > this.width + 40) {
        this.leaves[i] = this.createLeaf(false);
        continue;
      }

      // Render with 3D transform simulation
      this.ctx.save();
      this.ctx.translate(l.x, l.y);
      this.ctx.rotate(l.rotation);
      const scaleY = Math.cos(l.rotX);
      this.ctx.scale(1, Math.abs(scaleY) < 0.1 ? 0.1 : scaleY);

      this.ctx.fillStyle = l.color;
      this.ctx.globalAlpha = l.opacity * (0.8 + Math.abs(scaleY) * 0.2);

      if (l.type === 0) {
        this.drawBirchLeaf(this.ctx, l.size);
      } else if (l.type === 1) {
        this.drawPineNeedle(this.ctx, l.size);
      } else {
        this.drawOakLeaf(this.ctx, l.size);
      }

      this.ctx.restore();
    }

    if (this.isRunning) {
      this.animId = requestAnimationFrame(() => this.update());
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.update();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

class TrailRunnerEngine {
  constructor() {
    this.section = document.getElementById("trailExplorationSection");
    this.path = document.getElementById("trailMainPath");
    this.progressPath = document.getElementById("trailProgressLine");
    this.runner = document.getElementById("trailRunnerAvatar");
    this.stage = document.getElementById("trailTrackStage");
    this.distDisplay = document.getElementById("trailDistVal");
    this.elevDisplay = document.getElementById("trailElevVal");
    this.paceDisplay = document.getElementById("trailPaceVal");
    this.waypoints = document.querySelectorAll(".trail-waypoint");

    this.lastScrollY = window.scrollY;
    this.isFacingForward = true;
    this.dustThrottle = 0;

    if (!this.section || !this.path || !this.runner) return;
    this.init();
  }

  init() {
    this.pathLength = this.path.getTotalLength();
    if (this.progressPath) {
      this.progressPath.style.strokeDasharray = this.pathLength;
      this.progressPath.style.strokeDashoffset = this.pathLength;
    }

    // Scroll sync
    window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
    window.addEventListener("resize", () => {
      this.pathLength = this.path.getTotalLength();
      this.updateRunner(this.currentProgress || 0);
    }, { passive: true });

    // Initial position
    this.updateRunner(0);
    this.handleScroll();

    // Clickable waypoints
    this.waypoints.forEach(wp => {
      wp.addEventListener("click", () => {
        const pct = parseFloat(wp.getAttribute("data-pct") || 0);
        this.currentProgress = pct;
        this.updateRunner(pct);
      });
    });
  }

  handleScroll() {
    if (!this.section) return;
    const rect = this.section.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Detect direction
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY >= this.lastScrollY;
    this.lastScrollY = currentScrollY;

    if (rect.top <= windowH && rect.bottom >= 0) {
      const totalDist = windowH + rect.height;
      const currentPos = windowH - rect.top;
      let progress = currentPos / totalDist;
      progress = Math.max(0, Math.min(1, progress));

      this.currentProgress = progress;

      // Flip runner facing direction
      if (isScrollingDown !== this.isFacingForward) {
        this.isFacingForward = isScrollingDown;
        const scaleX = isScrollingDown ? 1 : -1;
        this.runner.style.transform = `scaleX(${scaleX})`;
      }

      this.updateRunner(progress);

      // Emit occasional dust puffs behind runner
      if (Date.now() - this.dustThrottle > 140) {
        this.emitDust();
        this.dustThrottle = Date.now();
      }
    }
  }

  updateRunner(progress) {
    if (!this.path) return;
    const length = this.pathLength || this.path.getTotalLength();
    const point = this.path.getPointAtLength(progress * length);

    // Position runner
    this.runner.style.left = `${point.x}px`;
    this.runner.style.top = `${point.y}px`;

    // Update progress stroke
    if (this.progressPath) {
      const offset = length * (1 - progress);
      this.progressPath.style.strokeDashoffset = offset;
    }

    // Update telemetry metrics
    const distanceMiles = (progress * 14.8).toFixed(1);
    const elevationFt = Math.round(5280 + progress * 7170); // 5,280' to 12,450'
    const paceMin = (6.2 + Math.sin(progress * 4) * 0.5).toFixed(2).replace(".", ":");

    if (this.distDisplay) this.distDisplay.textContent = `${distanceMiles} MI`;
    if (this.elevDisplay) this.elevDisplay.textContent = `${elevationFt.toLocaleString()} FT`;
    if (this.paceDisplay) this.paceDisplay.textContent = `${paceMin} /MI`;

    // Highlight reached waypoints
    this.waypoints.forEach(wp => {
      const pct = parseFloat(wp.getAttribute("data-pct") || 0);
      if (progress >= pct - 0.04) {
        wp.classList.add("reached");
      } else {
        wp.classList.remove("reached");
      }
    });
  }

  emitDust() {
    if (!this.stage || !this.runner) return;
    const dust = document.createElement("div");
    dust.className = "dust-particle";
    const left = parseFloat(this.runner.style.left || 0);
    const top = parseFloat(this.runner.style.top || 0);
    dust.style.left = `${left + (this.isFacingForward ? -10 : 10)}px`;
    dust.style.top = `${top + 10}px`;
    this.stage.appendChild(dust);
    setTimeout(() => dust.remove(), 600);
  }
}

class AnimatedCountersEngine {
  constructor() {
    this.counters = document.querySelectorAll("[data-counter-target]");
    if (!this.counters.length) return;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    this.counters.forEach(c => observer.observe(c));
  }

  animate(el) {
    const target = parseInt(el.getAttribute("data-counter-target"), 10) || 0;
    const prefix = el.getAttribute("data-counter-prefix") || "";
    const suffix = el.getAttribute("data-counter-suffix") || "";
    const duration = 2000;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  }
}

class BiDirectionalScrollRevealEngine {
  constructor() {
    this.revealElements = document.querySelectorAll(".reveal-up, .reveal-fade, .reveal-stagger");
    if (!this.revealElements.length) return;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        } else {
          // Reverse animation when scrolled completely out of view (Bi-directional)
          if (entry.boundingClientRect.top > window.innerHeight) {
            entry.target.classList.remove("revealed");
          }
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    this.revealElements.forEach(el => observer.observe(el));
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  // 1. Falling leaves
  window.stacklyLeaves = new FallingLeavesEngine("heroLeavesCanvas");
  window.stacklyAboutLeaves = new FallingLeavesEngine("aboutLeavesCanvas");
  window.stacklyStoryLeaves = new FallingLeavesEngine("storyLeavesCanvas");

  // 2. Trail runner
  window.stacklyTrailRunner = new TrailRunnerEngine();

  // 3. Animated counters
  window.stacklyCounters = new AnimatedCountersEngine();

  // 4. Bi-directional reveals
  window.stacklyScrollReveal = new BiDirectionalScrollRevealEngine();
});

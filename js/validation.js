/**
 * STACKLY OUTDOOR - Form Validation & Client Verification
 */

class FormValidator {
  constructor() {
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    this.phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    this.initForms();
  }

  initForms() {
    // 1. Magazine Subscription Form (Section in reference & modal)
    this.setupMagazineSubscription();

    // 2. Newsletter Footer Form
    this.setupNewsletterForm();

    // 3. Contact Form (if on contact page or modal)
    this.setupContactForm();
  }

  setupMagazineSubscription() {
    const magForms = document.querySelectorAll(".magazine-sub-form");
    magForms.forEach(form => {
      const emailInput = form.querySelector('input[type="email"]');
      const errorMsg = form.querySelector('.sub-error-msg') || this.createErrorElement(form);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = emailInput ? emailInput.value.trim() : "";

        if (!email) {
          this.showError(emailInput, errorMsg, "Please enter your email address to subscribe.");
          return;
        }

        if (!this.emailRegex.test(email)) {
          this.showError(emailInput, errorMsg, "Please provide a valid email address (e.g. name@domain.com).");
          return;
        }

        this.clearError(emailInput, errorMsg);
        
        // Show success
        if (window.stacklyCart && typeof window.stacklyCart.showToast === "function") {
          window.stacklyCart.showToast(`✨ You're subscribed to Stackly Magazine! Check ${email} for your digital welcome issue.`, "success");
        } else {
          alert(`Subscribed! Check ${email} for your welcome edition.`);
        }

        emailInput.value = "";
        
        // If inside modal, close after delay
        const modal = form.closest(".modal-container");
        if (modal) {
          setTimeout(() => {
            modal.classList.remove("active");
            document.body.classList.remove("no-scroll");
          }, 1200);
        }
      });

      if (emailInput) {
        emailInput.addEventListener("input", () => {
          if (this.emailRegex.test(emailInput.value.trim())) {
            this.clearError(emailInput, errorMsg);
          }
        });
      }
    });
  }

  setupNewsletterForm() {
    const newsForms = document.querySelectorAll(".newsletter-form");
    newsForms.forEach(form => {
      const emailInput = form.querySelector('input[type="email"]');
      const errorMsg = form.querySelector('.news-error-msg') || this.createErrorElement(form);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = emailInput ? emailInput.value.trim() : "";

        if (!email) {
          this.showError(emailInput, errorMsg, "Email address is required.");
          return;
        }

        if (!this.emailRegex.test(email)) {
          this.showError(emailInput, errorMsg, "Please enter a valid email address.");
          return;
        }

        this.clearError(emailInput, errorMsg);
        
        if (window.stacklyCart && typeof window.stacklyCart.showToast === "function") {
          window.stacklyCart.showToast("🌲 Welcome to the Stackly Trail Club! Your 10% coupon code is: ADVENTURE10", "success");
        }

        emailInput.value = "";
      });
    });
  }

  setupContactForm() {
    const contactForm = document.getElementById("stacklyContactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById("contactName");
      const emailInput = document.getElementById("contactEmail");
      const topicInput = document.getElementById("contactTopic");
      const msgInput = document.getElementById("contactMessage");

      // Validate Name
      if (!nameInput || nameInput.value.trim().length < 2) {
        this.setFieldStatus(nameInput, "errContactName", "Please enter your full name (at least 2 characters).", false);
        isValid = false;
      } else {
        this.setFieldStatus(nameInput, "errContactName", "", true);
      }

      // Validate Email
      if (!emailInput || !this.emailRegex.test(emailInput.value.trim())) {
        this.setFieldStatus(emailInput, "errContactEmail", "Please provide a valid email address.", false);
        isValid = false;
      } else {
        this.setFieldStatus(emailInput, "errContactEmail", "", true);
      }

      // Validate Topic
      if (topicInput && (!topicInput.value || topicInput.value === "")) {
        this.setFieldStatus(topicInput, "errContactTopic", "Please choose an inquiry topic.", false);
        isValid = false;
      } else if (topicInput) {
        this.setFieldStatus(topicInput, "errContactTopic", "", true);
      }

      // Validate Message
      if (!msgInput || msgInput.value.trim().length < 10) {
        this.setFieldStatus(msgInput, "errContactMsg", "Please provide detailed message notes (at least 10 characters).", false);
        isValid = false;
      } else {
        this.setFieldStatus(msgInput, "errContactMsg", "", true);
      }

      if (isValid) {
        const ticketId = "EXP-" + Math.floor(10000 + Math.random() * 90000);
        contactForm.innerHTML = `
          <div class="contact-success-state">
            <div class="success-icon-badge">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3>Backcountry Support Ticket Dispatched!</h3>
            <p>Ticket Reference: <strong>#${ticketId}</strong></p>
            <p>Thanks for reaching out, <strong>${nameInput.value.trim()}</strong>. One of our wilderness guides or customer support specialists will reply to <strong>${emailInput.value.trim()}</strong> within 4 business hours.</p>
            <button class="btn btn-primary" onclick="location.reload()">Send Another Message</button>
          </div>
        `;
        if (window.stacklyCart) {
          window.stacklyCart.showToast("Inquiry received! Check your inbox for ticket confirmation.", "success");
        }
      }
    });
  }

  setFieldStatus(inputEl, errorId, errorText, isValid) {
    if (!inputEl) return;
    const errorEl = document.getElementById(errorId);
    if (isValid) {
      inputEl.classList.remove("field-invalid");
      inputEl.classList.add("field-valid");
      if (errorEl) errorEl.textContent = "";
    } else {
      inputEl.classList.add("field-invalid");
      inputEl.classList.remove("field-valid");
      if (errorEl) errorEl.textContent = errorText;
    }
  }

  createErrorElement(form) {
    const span = document.createElement("span");
    span.className = "inline-error-msg";
    form.appendChild(span);
    return span;
  }

  showError(input, errorEl, message) {
    if (input) input.classList.add("field-invalid");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  }

  clearError(input, errorEl) {
    if (input) input.classList.remove("field-invalid");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.stacklyValidator = new FormValidator();
});

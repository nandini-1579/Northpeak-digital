// =========================================================
// NorthPeak Digital — script.js
// Mobile nav toggle, contact form validation, footer year
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initNavToggle();
  initContactForm();
});

/* ---------------------------------------------------------
   Footer year
--------------------------------------------------------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after a link is tapped (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu if window is resized up to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------------------------------------------------------
   Contact form validation
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');

  const fields = {
    name: {
      input: document.getElementById('name'),
      errorEl: document.getElementById('nameError'),
      validate: (value) => {
        if (!value.trim()) return 'Please enter your name.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      },
    },
    email: {
      input: document.getElementById('email'),
      errorEl: document.getElementById('emailError'),
      validate: (value) => {
        if (!value.trim()) return 'Please enter your email.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      },
    },
    budget: {
      input: document.getElementById('budget'),
      errorEl: document.getElementById('budgetError'),
      validate: (value) => {
        if (!value) return 'Please select a budget range.';
        return '';
      },
    },
    message: {
      input: document.getElementById('message'),
      errorEl: document.getElementById('messageError'),
      validate: (value) => {
        if (!value.trim()) return 'Please tell us a bit about the project.';
        if (value.trim().length < 10) return 'Please add a few more details (at least 10 characters).';
        return '';
      },
    },
  };

  // Validate a single field and reflect the result in the UI
  function validateField(key) {
    const field = fields[key];
    const errorMessage = field.validate(field.input.value);
    const row = field.input.closest('.form-row');

    if (errorMessage) {
      field.errorEl.textContent = errorMessage;
      row.classList.add('has-error');
      field.input.setAttribute('aria-invalid', 'true');
    } else {
      field.errorEl.textContent = '';
      row.classList.remove('has-error');
      field.input.removeAttribute('aria-invalid');
    }

    return !errorMessage;
  }

  // Validate on blur so errors appear as the user moves through the form
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));
    fields[key].input.addEventListener('input', () => {
      // Clear the error as soon as the field becomes valid again
      const row = fields[key].input.closest('.form-row');
      if (row.classList.contains('has-error')) validateField(key);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      status.textContent = 'Please fix the highlighted fields and try again.';
      status.className = 'form-status error';
      // Move focus to the first invalid field for keyboard/screen-reader users
      const firstInvalidKey = Object.keys(fields).find((key) =>
        fields[key].input.closest('.form-row').classList.contains('has-error')
      );
      if (firstInvalidKey) fields[firstInvalidKey].input.focus();
      return;
    }

    // No backend in this build — simulate a successful submission
    status.textContent = "Thanks — we've got your message and will reply within one business day.";
    status.className = 'form-status success';
    form.reset();
  });
}
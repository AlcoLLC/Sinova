document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const notificationClose = document.getElementById("notification-close");

  function showNotification(message, type = "success") {
    if (!notification || !notificationMessage) return;
    
    notification.classList.remove("success", "error", "warning", "hidden");
    notification.classList.add(type);
    notificationMessage.textContent = message;

    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  function hideNotification() {
    if (!notification) return;
    notification.classList.remove("show");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 300);
  }

  if (notificationClose) {
    notificationClose.addEventListener("click", hideNotification);
  }

  window.showNotification = showNotification;

  console.log("Checking reCAPTCHA...");
  
  function checkRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
      console.log("reCAPTCHA loaded successfully");
      
      const recaptchaContainer = document.querySelector('.g-recaptcha');
      if (recaptchaContainer) {
        console.log("reCAPTCHA container found");
        console.log("Site key:", recaptchaContainer.dataset.sitekey);
      } else {
        console.error("reCAPTCHA container not found");
      }
    } else {
      console.log("reCAPTCHA not loaded yet, retrying...");
      setTimeout(checkRecaptcha, 1000);
    }
  }
  
  checkRecaptcha();

  window.onRecaptchaSuccess = function () {
    console.log("reCAPTCHA verified successfully");
  };

  window.onRecaptchaExpired = function () {
    console.log("reCAPTCHA expired");
    showNotification("reCAPTCHA has expired. Please verify again.", "warning");
  };

  window.onRecaptchaError = function () {
    console.log("reCAPTCHA error");
    showNotification("reCAPTCHA error occurred. Please try again.", "error");
  };

  if (form) {
    form.addEventListener("submit", function (e) {
      console.log("Form submission started");
      
      const recaptchaResponse = document.querySelector('[name="g-recaptcha-response"]');
      console.log("reCAPTCHA response element:", recaptchaResponse);
      console.log("reCAPTCHA response value:", recaptchaResponse ? recaptchaResponse.value : "not found");

      if (!recaptchaResponse || !recaptchaResponse.value) {
        e.preventDefault();
        showNotification("Please complete the reCAPTCHA verification.", "warning");
        console.log("Form submission blocked - no reCAPTCHA response");
        return false;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
        }, 10000);
      }
    });
  }

  const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
  if (recaptchaScript) {
    console.log("reCAPTCHA script tag found");
  } else {
    console.error("reCAPTCHA script tag not found");
  }
});
// contact.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const notificationClose = document.getElementById("notification-close");

  function showNotification(message, type = "success") {
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
    notification.classList.remove("show");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 300);
  }

  notificationClose.addEventListener("click", hideNotification);

  // reCAPTCHA callbacks
  window.onRecaptchaSuccess = function () {
    console.log("reCAPTCHA verified successfully");
  };

  window.onRecaptchaExpired = function () {
    showNotification("reCAPTCHA has expired. Please verify again.", "warning");
  };

  window.onRecaptchaError = function () {
    showNotification("reCAPTCHA error occurred. Please try again.", "error");
  };

  // Form submission
  form.addEventListener("submit", function (e) {
    const recaptchaResponse = document.querySelector(
      '[name="g-recaptcha-response"]'
    );

    if (!recaptchaResponse || !recaptchaResponse.value) {
      e.preventDefault();
      showNotification(
        "Please complete the reCAPTCHA verification.",
        "warning"
      );
      return false;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 10000);
  });
});

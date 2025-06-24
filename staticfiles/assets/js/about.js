document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("playButton");
  const videoContainer = document.getElementById("videoContainer");
  const youtubeVideo = document.getElementById("youtubeVideo");

  if (playButton && videoContainer) {
    playButton.addEventListener("click", function () {
      playButton.style.display = "none";
      videoContainer.style.display = "block";
      if (youtubeVideo) {
        const videoSrc = youtubeVideo.src;
        youtubeVideo.src = videoSrc + "&autoplay=1";
      }
    });
  }
});

// Enhanced tab navigation with URL parameters
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".clickable-tabs .tab");
  const sections = document.querySelectorAll(
    '[id="our-history"], [id="vission-mission"], [id="policies"]'
  );

  // Function to update URL without page reload
  function updateURL(tabId) {
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.pushState({ tab: tabId }, "", url);
  }

  // Function to scroll to section and update active tab
  function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      const activeTab = document.querySelector(`[data-tab="${targetId}"]`);
      if (activeTab) {
        activeTab.classList.add("active");
      }

      // Update URL
      updateURL(targetId);
    }
  }

  // Tab click handlers
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetId = this.getAttribute("data-tab");
      scrollToSection(targetId);
    });
  });

  // Check URL parameter on page load
  function checkURLParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");

    if (tabParam) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        scrollToSection(tabParam);
      }, 100);
    }
  }

  // Handle browser back/forward buttons
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.tab) {
      const targetElement = document.getElementById(event.state.tab);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update active tab without updating URL (already in history)
        tabs.forEach((t) => t.classList.remove("active"));
        const activeTab = document.querySelector(
          `[data-tab="${event.state.tab}"]`
        );
        if (activeTab) {
          activeTab.classList.add("active");
        }
      }
    }
  });

  // Intersection Observer to update URL when scrolling
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px", // Trigger when section is 20% from top
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        // Update active tab
        tabs.forEach((t) => t.classList.remove("active"));
        const activeTab = document.querySelector(`[data-tab="${sectionId}"]`);
        if (activeTab) {
          activeTab.classList.add("active");
        }

        // Update URL only if not already set
        const urlParams = new URLSearchParams(window.location.search);
        const currentTab = urlParams.get("tab");
        if (currentTab !== sectionId) {
          updateURL(sectionId);
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Check URL parameter on initial load
  checkURLParameter();
});

// Show more functionality (unchanged)

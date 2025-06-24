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

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".clickable-tabs .tab");
  const sections = document.querySelectorAll(
    '[id="our-history"], [id="vission-mission"], [id="policies"]'
  );

  function updateURL(tabId) {
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.pushState({ tab: tabId }, "", url);
  }

  function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      tabs.forEach((t) => t.classList.remove("active"));
      const activeTab = document.querySelector(`[data-tab="${targetId}"]`);
      if (activeTab) {
        activeTab.classList.add("active");
      }

      updateURL(targetId);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetId = this.getAttribute("data-tab");
      scrollToSection(targetId);
    });
  });

  function checkURLParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");

    if (tabParam) {
      setTimeout(() => {
        scrollToSection(tabParam);
      }, 100);
    }
  }

  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.tab) {
      const targetElement = document.getElementById(event.state.tab);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

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

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px", 
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        tabs.forEach((t) => t.classList.remove("active"));
        const activeTab = document.querySelector(`[data-tab="${sectionId}"]`);
        if (activeTab) {
          activeTab.classList.add("active");
        }

        const urlParams = new URLSearchParams(window.location.search);
        const currentTab = urlParams.get("tab");
        if (currentTab !== sectionId) {
          updateURL(sectionId);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  checkURLParameter();
});


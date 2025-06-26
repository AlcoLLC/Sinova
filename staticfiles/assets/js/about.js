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

  const aboutSections = document.querySelectorAll(
    '[id="our-history"], [id="vision-mission"], [id="policies"]'
  );

  const dynamicSections = document.querySelectorAll(
    '[id^="business-"], [id^="investor-"]'
  );

  const allSections = [...aboutSections, ...dynamicSections];

  const pageType = getPageType();

  // Navbar offset hesaplama fonksiyonu
  function getNavbarHeight() {
    const navbar = document.querySelector(
      "nav, .navbar, .header, .main-nav, .navigation"
    );

    const specificUrl = "/investorRelation";
    if (window.location.pathname.startsWith(specificUrl)) {
      if (navbar) {
        return navbar.offsetHeight - 20;
      }
    }

    if (navbar) {
      return navbar.offsetHeight + 100;
    }
    return 80;
  }

  function getPageType() {
    const path = window.location.pathname;
    if (path.includes("/about/")) return "about";
    if (path.includes("/businesses/")) return "businesses";
    if (path.includes("/investorRelation/")) return "investor";
    return "general";
  }

  function getTargetId(tab) {
    if (pageType === "about") {
      return tab.getAttribute("data-tab");
    } else {
      return tab.getAttribute("data-slug") || tab.getAttribute("data-tab");
    }
  }

  function findTabByTargetId(targetId) {
    if (pageType === "about") {
      return document.querySelector(`[data-tab="${targetId}"]`);
    } else {
      return (
        document.querySelector(`[data-slug="${targetId}"]`) ||
        document.querySelector(`[data-tab="${targetId}"]`)
      );
    }
  }

  function updateURL(tabId) {
    const url = new URL(window.location);

    let basePath = url.pathname.split("/").filter(Boolean);

    if (basePath.length > 1) {
      basePath = basePath.slice(0, 2);
    }

    url.pathname = `/${basePath[0]}/${tabId}/`;
    url.search = "";

    window.history.pushState({ tab: tabId, pageType: pageType }, "", url);
  }

  function scrollToSection(targetId) {
    const targetElement =
      document.getElementById(targetId) ||
      document.querySelector(`[data-category="${targetId}"]`) ||
      document.querySelector(`[data-slug="${targetId}"]`);

    if (targetElement) {
      const navbarHeight = getNavbarHeight();

      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;

      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      updateActiveTab(targetId);
      updateURL(targetId);
    }
  }

  function updateActiveTab(targetId) {
    tabs.forEach((t) => t.classList.remove("active"));

    const activeTab =
      findTabByTargetId(targetId) ||
      document.querySelector(`[data-category="${targetId}"]`);

    if (activeTab) {
      activeTab.classList.add("active");
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = getTargetId(this);

      if (targetId) {
        if (shouldRedirect(targetId)) {
          redirectToPage(targetId);
        } else {
          scrollToSection(targetId);
        }
      }
    });
  });

  function shouldRedirect(targetId) {
    const currentPath = window.location.pathname;

    if (["our-history", "vision-mission", "policies"].includes(targetId)) {
      return !currentPath.includes("/about/");
    }

    if (
      targetId.startsWith("business-") ||
      targetId.startsWith("finance") ||
      targetId.startsWith("technology") ||
      targetId.startsWith("trade")
    ) {
      return !currentPath.includes("/businesses/");
    }

    if (
      targetId.startsWith("investor-") ||
      targetId.startsWith("reports") ||
      targetId.startsWith("announcements") ||
      targetId.startsWith("governance")
    ) {
      return !currentPath.includes("/investorRelation/");
    }

    return false;
  }

  function redirectToPage(targetId) {
    let redirectUrl = "";

    if (["our-history", "vision-mission", "policies"].includes(targetId)) {
      redirectUrl = `/about/${targetId}/`;
    } else if (
      targetId.startsWith("business-") ||
      ["finance", "technology", "trade"].includes(targetId)
    ) {
      redirectUrl = `/businesses/${targetId}/`;
    } else if (
      targetId.startsWith("investor-") ||
      ["reports", "announcements", "governance"].includes(targetId)
    ) {
      redirectUrl = `/investorRelation/${targetId}/`;
    }

    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }

  function checkURLParameter() {
    let tabParam = null;

    if (pageType === "about") {
      const urlParams = new URLSearchParams(window.location.search);
      tabParam = urlParams.get("tab");
    } else {
      const pathParts = window.location.pathname
        .split("/")
        .filter((part) => part);
      tabParam = pathParts[pathParts.length - 1];

      if (["businesses", "investor", "investorRelation"].includes(tabParam)) {
        tabParam = getDefaultTab();
      }
    }

    if (tabParam) {
      setTimeout(() => {
        scrollToSection(tabParam);
      }, 100);
    } else {
      const defaultTab = getDefaultTab();
      if (defaultTab) {
        updateActiveTab(defaultTab);
      }
    }
  }

  function getDefaultTab() {
    if (pageType === "about") return "our-history";

    const firstTab = tabs[0];
    if (firstTab) {
      return getTargetId(firstTab);
    }

    return null;
  }

  window.addEventListener("popstate", function (event) {
    let targetTab = null;

    if (event.state && event.state.tab) {
      targetTab = event.state.tab;
    } else {
      if (pageType === "about") {
        const urlParams = new URLSearchParams(window.location.search);
        targetTab = urlParams.get("tab");
      } else {
        const pathParts = window.location.pathname
          .split("/")
          .filter((part) => part);
        targetTab = pathParts[pathParts.length - 1];
      }
    }

    if (targetTab) {
      const targetElement =
        document.getElementById(targetTab) ||
        document.querySelector(`[data-category="${targetTab}"]`) ||
        document.querySelector(`[data-slug="${targetTab}"]`);

      if (targetElement) {
        // Burada da navbar offset'i uygula
        const navbarHeight = getNavbarHeight();
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        updateActiveTab(targetTab);
      }
    }
  });

  // Intersection Observer - navbar offset'i ile ayarlandı
  const observerOptions = {
    root: null,
    rootMargin: `-${getNavbarHeight()}px 0px -70% 0px`, // Navbar yüksekliğini rootMargin'e ekle
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId =
          entry.target.id ||
          entry.target.getAttribute("data-category") ||
          entry.target.getAttribute("data-slug");

        if (sectionId) {
          updateActiveTab(sectionId);

          // URL'yi güncelle (sadece değişiklik varsa)
          const currentParam =
            pageType === "about"
              ? new URLSearchParams(window.location.search).get("tab")
              : window.location.pathname
                  .split("/")
                  .filter((part) => part)
                  .pop();

          if (currentParam !== sectionId) {
            updateURL(sectionId);
          }
        }
      }
    });
  }, observerOptions);

  // Observer'ı sadece mevcut sayfadaki section'lara ekle
  allSections.forEach((section) => {
    if (section) {
      observer.observe(section);
    }
  });

  // Sayfa yüklendiğinde URL parametresini kontrol et
  checkURLParameter();

  // Navbar dropdown link'leri için özel event handler
  const navDropdownLinks = document.querySelectorAll(
    ".nav-dropdown a, .mobile-dropdown-content a"
  );
  navDropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Eğer href anchor içeriyorsa veya tab parametresi varsa
      if (href && (href.includes("#") || href.includes("tab="))) {
        e.preventDefault();

        let targetId = null;

        if (href.includes("#")) {
          targetId = href.split("#")[1];
        } else if (href.includes("tab=")) {
          const url = new URL(href, window.location.origin);
          targetId = url.searchParams.get("tab");
        }

        if (targetId) {
          // Aynı sayfadaysak scroll yap, değilse redirect et
          if (
            href.startsWith("#") ||
            window.location.pathname ===
              new URL(href, window.location.origin).pathname
          ) {
            scrollToSection(targetId);
          } else {
            window.location.href = href;
          }
        }
      }
    });
  });

  // Dinamik kategoriler için lazy loading
  function loadCategoryContent(categoryId) {
    const categoryElement = document.getElementById(categoryId);

    if (categoryElement && !categoryElement.dataset.loaded) {
      // AJAX ile kategori içeriğini yükle
      fetch(`/api/category/${categoryId}/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.html) {
            categoryElement.innerHTML = data.html;
            categoryElement.dataset.loaded = "true";
          }
        })
        .catch((error) => {
          console.error("Category content loading error:", error);
        });
    }
  }

  // Tab değişikliklerinde içerik yükleme
  const originalScrollToSection = scrollToSection;
  scrollToSection = function (targetId) {
    loadCategoryContent(targetId);
    originalScrollToSection(targetId);
  };
});

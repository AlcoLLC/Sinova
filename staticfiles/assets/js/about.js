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
  // Dinamik tab ve section selector'ları
  const tabs = document.querySelectorAll(".clickable-tabs .tab");

  // Statik about sayfası için section'lar
  const aboutSections = document.querySelectorAll(
    '[id="our-history"], [id="vision-mission"], [id="policies"]'
  );

  // Dinamik kategoriler için section'lar (businesses, investor relations vb.)
  const dynamicSections = document.querySelectorAll(
    '[id^="category-"], [id^="business-"], [id^="investor-"]'
  );

  // Tüm section'ları birleştir
  const allSections = [...aboutSections, ...dynamicSections];

  // Sayfa tipini belirle
  const pageType = getPageType();

  function getPageType() {
    const path = window.location.pathname;
    if (path.includes("/about/")) return "about";
    if (path.includes("/businesses/")) return "businesses";
    if (path.includes("/investor")) return "investor";
    return "general";
  }

  function updateURL(tabId) {
    const url = new URL(window.location);

    // URL-in əsas hissəsini al ("/about/vision-mission/" kimi)
    let basePath = url.pathname.split("/").filter(Boolean);

    if (basePath.length > 1) {
      basePath = basePath.slice(0, 2); // ["about", "vision-mission"]
    }

    // Yeni path qur
    url.pathname = `/${basePath[0]}/${tabId}/`;
    url.search = ""; // query parametrləri təmizlə

    window.history.pushState({ tab: tabId, pageType: pageType }, "", url);
  }

  function scrollToSection(targetId) {
    const targetElement =
      document.getElementById(targetId) ||
      document.querySelector(`[data-category="${targetId}"]`) ||
      document.querySelector(`[data-slug="${targetId}"]`);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Aktif tab'ı güncelle
      updateActiveTab(targetId);

      // URL'yi güncelle
      updateURL(targetId);
    }
  }

  function updateActiveTab(targetId) {
    tabs.forEach((t) => t.classList.remove("active"));

    // Farklı selector'lar dene
    const activeTab =
      document.querySelector(`[data-tab="${targetId}"]`) ||
      document.querySelector(`[data-category="${targetId}"]`) ||
      document.querySelector(`[data-slug="${targetId}"]`);

    if (activeTab) {
      activeTab.classList.add("active");
    }
  }

  // Tab click event'leri
  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId =
        this.getAttribute("data-tab") ||
        this.getAttribute("data-category") ||
        this.getAttribute("data-slug");

      if (targetId) {
        // Eğer farklı bir sayfaya yönlendirme gerekiyorsa
        if (shouldRedirect(targetId)) {
          redirectToPage(targetId);
        } else {
          scrollToSection(targetId);
        }
      }
    });
  });

  function shouldRedirect(targetId) {
    // Mevcut sayfa ile hedef tab'ın uyumluluğunu kontrol et
    const currentPath = window.location.pathname;

    // About tab'ları about sayfasında olmalı
    if (["our-history", "vision-mission", "policies"].includes(targetId)) {
      return !currentPath.includes("/about/");
    }

    // Business kategorileri businesses sayfasında olmalı
    if (
      targetId.startsWith("business-") ||
      targetId.startsWith("finance") ||
      targetId.startsWith("technology") ||
      targetId.startsWith("trade")
    ) {
      return !currentPath.includes("/businesses/");
    }

    // Investor kategorileri investor sayfasında olmalı
    if (
      targetId.startsWith("investor-") ||
      targetId.startsWith("reports") ||
      targetId.startsWith("announcements") ||
      targetId.startsWith("governance")
    ) {
      return !currentPath.includes("/investor");
    }

    return false;
  }

  function redirectToPage(targetId) {
    let redirectUrl = "";

    // About sayfası redirect'leri
    if (["our-history", "vision-mission", "policies"].includes(targetId)) {
      redirectUrl = `/about/${targetId}/`;
    }
    // Business sayfası redirect'leri
    else if (
      targetId.startsWith("business-") ||
      ["finance", "technology", "trade"].includes(targetId)
    ) {
      redirectUrl = `/businesses/${targetId}/`;
    }
    // Investor sayfası redirect'leri
    else if (
      targetId.startsWith("investor-") ||
      ["reports", "announcements", "governance"].includes(targetId)
    ) {
      redirectUrl = `/investor/${targetId}/`;
    }

    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }

  function checkURLParameter() {
    let tabParam = null;

    if (pageType === "about") {
      // About sayfası için query parameter kontrol et
      const urlParams = new URLSearchParams(window.location.search);
      tabParam = urlParams.get("tab");
    } else {
      // Diğer sayfalar için URL path'inden tab'ı çıkar
      const pathParts = window.location.pathname
        .split("/")
        .filter((part) => part);
      tabParam = pathParts[pathParts.length - 1];

      // Eğer son part sayfa adıysa, varsayılan tab'ı kullan
      if (["businesses", "investor", "investorRelation"].includes(tabParam)) {
        tabParam = getDefaultTab();
      }
    }

    if (tabParam) {
      setTimeout(() => {
        scrollToSection(tabParam);
      }, 100);
    } else {
      // Varsayılan tab'ı aktif yap
      const defaultTab = getDefaultTab();
      if (defaultTab) {
        updateActiveTab(defaultTab);
      }
    }
  }

  function getDefaultTab() {
    if (pageType === "about") return "our-history";

    // İlk kategoriyi varsayılan olarak kullan
    const firstTab = tabs[0];
    if (firstTab) {
      return (
        firstTab.getAttribute("data-tab") ||
        firstTab.getAttribute("data-category") ||
        firstTab.getAttribute("data-slug")
      );
    }

    return null;
  }

  // Browser back/forward navigation
  window.addEventListener("popstate", function (event) {
    let targetTab = null;

    if (event.state && event.state.tab) {
      targetTab = event.state.tab;
    } else {
      // State yoksa URL'den çıkarmaya çalış
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
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        updateActiveTab(targetTab);
      }
    }
  });

  // Intersection Observer - sadece mevcut sayfadaki section'lar için
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
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

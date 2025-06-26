document.addEventListener("DOMContentLoaded", function () {
  const langDropdownBtn = document.querySelector(".lang-dropdown-btn");
  const languageDropdown = document.getElementById("languageDropdown");
  const desktopLangOptions = document.querySelectorAll(
    "#languageDropdown .lang-option"
  );
  const mobileLangButtons = document.querySelectorAll(
    ".mobile-languages .lang-btn"
  );

  // Desktop language dropdown
  if (langDropdownBtn && languageDropdown) {
    langDropdownBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      languageDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
      if (
        !langDropdownBtn.contains(e.target) &&
        !languageDropdown.contains(e.target)
      ) {
        languageDropdown.classList.remove("show");
      }
    });
  }

  // Desktop language options
  desktopLangOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const selectedLang = this.getAttribute("data-lang");

      if (languageDropdown) {
        languageDropdown.classList.remove("show");
      }

      switchLanguage(selectedLang);
    });
  });

  // Mobile language buttons
  mobileLangButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const selectedLang = this.getAttribute("data-lang");
      mobileLangButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      switchLanguage(selectedLang);
    });
  });

  function switchLanguage(langCode) {
    let csrfValue = getCsrfToken();
    const newPath = calculateNewPath(langCode);

    if (csrfValue) {
      submitLanguageForm(langCode, newPath, csrfValue);
    } else {
      window.location.href = newPath;
    }
  }

  function getCsrfToken() {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
      return csrfMeta.getAttribute("content");
    }

    const csrfInput = document.querySelector(
      'input[name="csrfmiddlewaretoken"]'
    );
    if (csrfInput) {
      return csrfInput.value;
    }

    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrftoken") {
        return value;
      }
    }

    return null;
  }

  function getCurrentLanguageFromPath() {
    const currentPath = window.location.pathname;
    // Desteklenen dillerin tam listesi - EN dahil
    const supportedLangs = ["en", "de", "es", "fr", "it", "es", "pt", "zh-hans"];

    // Önce tam eşleşme kontrolü
    for (let lang of supportedLangs) {
      if (currentPath.startsWith(`/${lang}/`) || currentPath === `/${lang}`) {
        return lang;
      }
    }

    // Eğer hiçbir dil prefixi bulunamazsa, varsayılan dil EN
    return "en";
  }

  function calculateNewPath(langCode) {
    const currentPath = window.location.pathname;
    const supportedLangs = ["en", "de", "fr", "it", "es", "pt", "zh-hans"]; // EN eklendi

    let pathWithoutLang = currentPath;
    let currentLang = getCurrentLanguageFromPath();

    // Mevcut dil prefixini kaldır
    if (currentLang !== "en") {
      if (currentPath.startsWith(`/${currentLang}/`)) {
        pathWithoutLang = currentPath.substring(currentLang.length + 1);
      } else if (currentPath === `/${currentLang}`) {
        pathWithoutLang = "/";
      }
    }

    // Yeni dil ile path oluştur
    if (langCode === "en") {
      return pathWithoutLang === "/" ? "/" : pathWithoutLang;
    } else {
      if (pathWithoutLang === "/") {
        return `/${langCode}/`;
      } else if (pathWithoutLang.startsWith("/")) {
        return `/${langCode}${pathWithoutLang}`;
      } else {
        return `/${langCode}/${pathWithoutLang}`;
      }A
    }
  }

  function submitLanguageForm(langCode, nextUrl, csrfToken) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/i18n/setlang/";
    form.style.display = "none";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "csrfmiddlewaretoken";
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    const langInput = document.createElement("input");
    langInput.type = "hidden";
    langInput.name = "language";
    langInput.value = langCode;
    form.appendChild(langInput);

    const nextInput = document.createElement("input");
    nextInput.type = "hidden";
    nextInput.name = "next";
    nextInput.value = nextUrl;
    form.appendChild(nextInput);

    document.body.appendChild(form);
    form.submit();
  }

  function setActiveLanguageButton() {
    const currentLang = getCurrentLanguageFromPath();

    // Tüm dil butonlarından active class'ını kaldır
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Mevcut dil için active class ekle
    document.querySelectorAll(`[data-lang="${currentLang}"]`).forEach((btn) => {
      btn.classList.add("active");
    });

    // Dropdown butonunun metnini güncelle
    if (langDropdownBtn) {
      const langTexts = {
        en: "EN",
        de: "DE",
        fr: "FR",
        it: "IT",
        es: "ES",
        pt: "PT",
        "zh-hans": "汉语",
      };

      const currentLangText = langTexts[currentLang] || "EN";
      langDropdownBtn.innerHTML = `${currentLangText} <i class="fa-solid fa-caret-down"></i>`;
    }
  }

  // Sayfa yüklendiğinde aktif dil butonunu ayarla
  setActiveLanguageButton();

  // Sayfa değiştiğinde aktif dil butonunu güncelle
  window.addEventListener("popstate", setActiveLanguageButton);

  // Rest of your existing navbar JavaScript...
  // WhatsApp scroll functionality
  const headerWhatsapp = document.querySelector(".header-whatsapp");

  window.addEventListener("scroll", function () {
    const fixedWhatsapp = document.querySelector(".fixed-whatsapp");
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
      fixedWhatsapp.style.opacity = "1";
      fixedWhatsapp.style.visibility = "visible";

      if (headerWhatsapp) {
        headerWhatsapp.style.opacity = "0";
        headerWhatsapp.style.visibility = "hidden";
      }
    } else {
      fixedWhatsapp.style.opacity = "0";
      fixedWhatsapp.style.visibility = "hidden";

      if (headerWhatsapp) {
        headerWhatsapp.style.opacity = "1";
        headerWhatsapp.style.visibility = "visible";
      }
    }
  });

  // Navigation dropdown functionality
  const navItems = document.querySelectorAll(".nav-bottom ul li");
  const nav = document.querySelector("nav");

  navItems.forEach((item) => {
    const dropdown = item.querySelector(".nav-dropdown");
    if (dropdown) {
      item.addEventListener("mouseenter", function () {
        document
          .querySelectorAll(".nav-dropdown")
          .forEach((d) => d.classList.remove("active"));
        dropdown.classList.add("active");
        nav.classList.add("dropdown-active");
      });

      item.addEventListener("mouseleave", function () {
        setTimeout(() => {
          if (!nav.matches(":hover")) {
            nav.classList.remove("dropdown-active");
            dropdown.classList.remove("active");
          }
        }, 100);
      });
    }
  });

  nav.addEventListener("mouseleave", function () {
    nav.classList.remove("dropdown-active");
    document
      .querySelectorAll(".nav-dropdown")
      .forEach((d) => d.classList.remove("active"));
  });

  // Mobile menu functionality
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (hamburger && mobileMenu) {
    const hamburgerIcon = hamburger.querySelector("i");

    hamburger.addEventListener("click", function () {
      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        if (hamburgerIcon) {
          hamburgerIcon.className = "fas fa-bars";
        }
      } else {
        mobileMenu.classList.add("active");
        if (hamburgerIcon) {
          hamburgerIcon.className = "fas fa-xmark";
        }
      }
    });
  }

  // Mobile dropdown functionality
  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");

  mobileDropdowns.forEach((dropdown) => {
    const dropdownHead = dropdown.querySelector(".mobile-dropdown-head i");
    const dropdownIcon = dropdown.querySelector("i");

    if (dropdownHead) {
      dropdownHead.addEventListener("click", function (e) {
        e.preventDefault();

        dropdown.classList.toggle("active");

        if (dropdownIcon) {
          if (dropdown.classList.contains("active")) {
            dropdownIcon.className = "fa-solid fa-minus";
          } else {
            dropdownIcon.className = "fa-solid fa-plus";
          }
        }

        // Close other dropdowns
        mobileDropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove("active");
            const otherIcon = otherDropdown.querySelector("i");
            if (otherIcon) {
              otherIcon.className = "fa-solid fa-plus";
            }
          }
        });
      });
    }
  });

  // Desktop dropdown background functionality
  const dropdowns = document.querySelectorAll(".dropdown");
  const dropdownBackground = document.querySelector(".dropdown-background");

  if (dropdownBackground) {
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("mouseenter", function () {
        dropdownBackground.style.display = "block";
        dropdownBackground.style.visibility = "visible";
        dropdownBackground.style.opacity = "1";
      });

      dropdown.addEventListener("mouseleave", function (e) {
        const relatedTarget = e.relatedTarget;
        if (
          !dropdown.contains(relatedTarget) &&
          relatedTarget !== dropdownBackground &&
          !dropdownBackground.contains(relatedTarget)
        ) {
          hideDropdownBackground();
        }
      });
    });

    dropdownBackground.addEventListener("mouseleave", function (e) {
      const relatedTarget = e.relatedTarget;
      let isInDropdown = false;

      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(relatedTarget)) {
          isInDropdown = true;
        }
      });

      if (!isInDropdown) {
        hideDropdownBackground();
      }
    });
  }

  function hideDropdownBackground() {
    if (dropdownBackground) {
      dropdownBackground.style.visibility = "hidden";
      dropdownBackground.style.opacity = "0";
      setTimeout(() => {
        if (dropdownBackground.style.opacity === "0") {
          dropdownBackground.style.display = "none";
        }
      }, 100);
    }
  }

  // Active link functionality - Dil korunarak aktif linkler ayarlanır
  function setActiveLinks() {
    const currentPath = window.location.pathname;
    const currentLang = getCurrentLanguageFromPath();

    const allNavLinks = document.querySelectorAll(
      ".navbar a[href], .mobile-menu a[href]"
    );

    allNavLinks.forEach((link) => {
      link.classList.remove("active");
    });

    const dropdownParents = document.querySelectorAll(
      ".dropdown > a, .mobile-dropdown > .mobile-dropdown-head"
    );
    dropdownParents.forEach((parent) => {
      parent.classList.remove("active");
    });

    const dropdownLinks = document.querySelectorAll(
      ".dropdown-content a[href], .mobile-dropdown-content a[href]"
    );
    let activeDropdownFound = false;

    dropdownLinks.forEach((dropdownLink) => {
      let linkPath = dropdownLink.getAttribute("href");

      // Link path'ini mevcut dil ile karşılaştır
      if (linkPath && currentLang !== "en") {
        // Eğer link absolute path ise ve dil prefixi yoksa, dil prefixini ekle
        if (
          linkPath.startsWith("/") &&
          !linkPath.startsWith(`/${currentLang}/`)
        ) {
          linkPath = `/${currentLang}${linkPath}`;
        }
      }

      if (
        linkPath === currentPath ||
        (linkPath && linkPath !== "/" && currentPath.startsWith(linkPath))
      ) {
        dropdownLink.classList.add("active");

        const parentDropdown = dropdownLink.closest(".dropdown");
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector("> a");
          if (parentLink) {
            parentLink.classList.add("active");
            activeDropdownFound = true;
          }
        }

        const parentMobileDropdown = dropdownLink.closest(".mobile-dropdown");
        if (parentMobileDropdown) {
          const parentMobileLink = parentMobileDropdown.querySelector(
            ".mobile-dropdown-head"
          );
          if (parentMobileLink) {
            parentMobileLink.classList.add("active");
            activeDropdownFound = true;
          }
        }
      }
    });

    if (!activeDropdownFound) {
      const regularNavLinks = document.querySelectorAll(
        ".navbar a[href]:not(.dropdown-content a), .mobile-menu a[href]:not(.mobile-dropdown-content a)"
      );

      regularNavLinks.forEach((link) => {
        let linkPath = link.getAttribute("href");

        // Link path'ini mevcut dil ile karşılaştır
        if (linkPath && currentLang !== "en") {
          if (
            linkPath.startsWith("/") &&
            !linkPath.startsWith(`/${currentLang}/`)
          ) {
            linkPath = `/${currentLang}${linkPath}`;
          }
        }

        if (linkPath === currentPath) {
          link.classList.add("active");
        } else if (
          linkPath &&
          linkPath !== "/" &&
          linkPath !== "" &&
          currentPath.startsWith(linkPath)
        ) {
          link.classList.add("active");
        }
      });
    }
  }

  setActiveLinks();
  window.addEventListener("popstate", function () {
    setActiveLinks();
    setActiveLanguageButton();
  });
  window.updateActiveLinks = setActiveLinks;
});

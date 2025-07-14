document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      this.classList.add("active");
      document.getElementById(targetTab).classList.add("active");

      initializeNewsDisplay();
      checkButtons();
    });
  });

  function initializeNewsDisplay() {
    tabContents.forEach((tabContent) => {
      const newsItems = tabContent.querySelectorAll(".news-sinova-content");
      newsItems.forEach((item, index) => {
        item.classList.remove("hidden", "fade-in", "preparing");
        // İlk 5 öğeyi göster, kalanları gizle
        if (index < 5) {
          item.style.display = "block";
          item.style.opacity = "1";
        } else {
          item.classList.add("hidden");
          item.style.display = "none";
        }
      });
    });
  }

  const showMoreButton = document.getElementById("showMoreNewsButton");
  const scrollTopButton = document.getElementById("scrollTopButton");



  if (showMoreButton) {
    showMoreButton.addEventListener("click", function () {
      const activeTabContent = document.querySelector(".tab-content.active");
      const hiddenItems = activeTabContent.querySelectorAll(
        ".news-sinova-content.hidden"
      );

      this.style.pointerEvents = "none";

      // Her tıklamada 3 öğe daha göster
      const itemsToShow = Math.min(3, hiddenItems.length);

      for (let i = 0; i < itemsToShow; i++) {
        setTimeout(() => {
          hiddenItems[i].classList.remove("hidden");
          hiddenItems[i].classList.add("preparing");
          hiddenItems[i].style.display = "block";

          setTimeout(() => {
            hiddenItems[i].classList.add("fade-in");
            hiddenItems[i].style.opacity = "1";
          }, 50);
        }, i * 300);
      }

      setTimeout(() => {
        this.style.pointerEvents = "auto";
        checkButtons();
      }, itemsToShow * 300 + 800);
    });

  }

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", function () {
      const newsSection = document.querySelector(".news-section");
      newsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

  }

  function checkButtons() {
    const activeTabContent = document.querySelector(".tab-content.active");
    const allItems = activeTabContent.querySelectorAll(".news-sinova-content");
    const hiddenItems = activeTabContent.querySelectorAll(
      ".news-sinova-content.hidden"
    );

    // 5'ten fazla öğe varsa ve gizli öğeler varsa "Show More" butonunu göster
    if (allItems.length > 5 && hiddenItems.length > 0) {
      showMoreButton.style.display = "block";
    } else {
      showMoreButton.style.display = "none";
    }

    // Görünen öğe sayısı 5'ten fazlaysa scroll top butonunu göster
    const visibleItems = activeTabContent.querySelectorAll(
      ".news-sinova-content:not(.hidden)"
    );
    if (visibleItems.length > 5) {
      scrollTopButton.style.display = "block";
    } else {
      scrollTopButton.style.display = "none";
    }
  }

  // Sayfa yüklendiğinde başlangıç durumunu ayarla
  initializeNewsDisplay();
  checkButtons();
});

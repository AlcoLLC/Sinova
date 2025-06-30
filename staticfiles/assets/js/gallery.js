document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.getElementById("galleryImagesContainer");
  const showMoreGalleryBtn = document.getElementById("showMoreGalleryBtn");
  const scrollTopGalleryBtn = document.getElementById("scrollTopGalleryBtn");

  if (!showMoreGalleryBtn || !galleryContainer) return;

  function initializeGalleryDisplay() {
    const imageRows = galleryContainer.querySelectorAll(".gallery-image-row");
    imageRows.forEach((row, index) => {
      row.classList.remove("hidden", "fade-in", "preparing");
      // İlk 3 satırı göster (6 resim), kalanları gizle
      if (index < 3) {
        row.style.display = "flex";
        row.style.opacity = "1";
      } else {
        row.classList.add("hidden");
        row.style.display = "none";
      }
    });
  }

  showMoreGalleryBtn.addEventListener("click", function () {
    const hiddenRows = galleryContainer.querySelectorAll(
      ".gallery-image-row.hidden"
    );

    this.style.pointerEvents = "none";

    // Her tıklamada 3 satır daha göster (6 resim)
    const rowsToShow = Math.min(3, hiddenRows.length);

    for (let i = 0; i < rowsToShow; i++) {
      setTimeout(() => {
        hiddenRows[i].classList.remove("hidden");
        hiddenRows[i].classList.add("preparing");
        hiddenRows[i].style.display = "flex";

        setTimeout(() => {
          hiddenRows[i].classList.add("fade-in");
          hiddenRows[i].style.opacity = "1";
        }, 50);
      }, i * 300);
    }

    setTimeout(() => {
      this.style.pointerEvents = "auto";
      checkGalleryButtons();
    }, rowsToShow * 300 + 800);
  });

  if (scrollTopGalleryBtn) {
    scrollTopGalleryBtn.addEventListener("click", function () {
      const mediaSection = document.querySelector(".sinova-media-center");
      mediaSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function checkGalleryButtons() {
    const allRows = galleryContainer.querySelectorAll(".gallery-image-row");
    const hiddenRows = galleryContainer.querySelectorAll(
      ".gallery-image-row.hidden"
    );

    // 3'ten fazla satır varsa ve gizli satırlar varsa "Show More" butonunu göster
    if (allRows.length > 3 && hiddenRows.length > 0) {
      showMoreGalleryBtn.style.display = "block";
    } else {
      showMoreGalleryBtn.style.display = "none";
    }

    // Görünen satır sayısı 3'ten fazlaysa scroll top butonunu göster
    const visibleRows = galleryContainer.querySelectorAll(
      ".gallery-image-row:not(.hidden)"
    );
    if (visibleRows.length > 3) {
      if (scrollTopGalleryBtn) {
        scrollTopGalleryBtn.style.display = "block";
      }
    } else {
      if (scrollTopGalleryBtn) {
        scrollTopGalleryBtn.style.display = "none";
      }
    }
  }

  initializeGalleryDisplay();
  checkGalleryButtons();

  console.log(
    "Gallery initialized with",
    galleryContainer.querySelectorAll(".gallery-image-item").length,
    "total images"
  );
  console.log(
    "Visible rows:",
    galleryContainer.querySelectorAll(".gallery-image-row:not(.hidden)").length
  );
  console.log(
    "Hidden rows:",
    galleryContainer.querySelectorAll(".gallery-image-row.hidden").length
  );
});

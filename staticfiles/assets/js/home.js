// SECTION Container
document.addEventListener("DOMContentLoaded", function () {
  const centerIcons = document.querySelectorAll(".center-icon");

  centerIcons.forEach((icon) => {
    const afterContent = icon.parentElement.querySelector(".after-content");
    let hoverTimeout;
    let isClicked = false;

    icon.addEventListener("mouseenter", function () {
      if (!isClicked) {
        clearTimeout(hoverTimeout);
        afterContent.classList.add("active");
      }
    });

    icon.addEventListener("mouseleave", function () {
      if (!isClicked) {
        hoverTimeout = setTimeout(() => {
          afterContent.classList.remove("active");
        }, 100);
      }
    });

    icon.addEventListener("click", function () {
      isClicked = !isClicked;
      if (isClicked) {
        afterContent.classList.add("active");
      } else {
        afterContent.classList.remove("active");
      }
    });

    afterContent.addEventListener("mouseenter", function () {
      if (!isClicked) {
        clearTimeout(hoverTimeout);
        afterContent.classList.add("active");
      }
    });

    afterContent.addEventListener("mouseleave", function () {
      if (!isClicked) {
        afterContent.classList.remove("active");
      }
    });
  });
});

// GALLERY SECTION

document.addEventListener("DOMContentLoaded", function () {
  const swiperGallery = new Swiper(".gallery-section .labSwiper", {
    slidesPerView: 2.5,
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    speed: 800,
    navigation: {
      nextEl: ".gallery-section .swiper-button-next",
      prevEl: ".gallery-section .swiper-button-prev",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.3,
        spaceBetween: 15,
      },
      640: {
        slidesPerView: 1.8,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 2.2,
        spaceBetween: 20,
      },
    },
    on: {
      init: function () {
        updateSlideScaling();
      },
      slideChange: function () {
        updateSlideScaling();
      },
    },
  });

  function updateSlideScaling() {
    const slides = document.querySelectorAll(".gallery-section .swiper-slide");

    slides.forEach((slide) => {
      slide.classList.remove("active-slide");
    });

    setTimeout(() => {
      const activeSlide = document.querySelector(
        ".gallery-section .swiper-slide-active"
      );
      if (activeSlide) {
        activeSlide.classList.add("active-slide");
      }
    }, 50);
  }
});


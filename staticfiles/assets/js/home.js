// Scroll to top functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopButton = document.querySelector('footer .contact-us button');
    
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// GALLERY SECTION

document.addEventListener('DOMContentLoaded', function () {
  const swiperGallery = new Swiper('.gallery-section .labSwiper', {
    slidesPerView: 2.5,
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    speed: 800,
    navigation: {
      nextEl: '.gallery-section .swiper-button-next',
      prevEl: '.gallery-section .swiper-button-prev',
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
    const slides = document.querySelectorAll('.gallery-section .swiper-slide');

    slides.forEach((slide) => {
      slide.classList.remove('active-slide');
    });

    setTimeout(() => {
      const activeSlide = document.querySelector(
        '.gallery-section .swiper-slide-active'
      );
      if (activeSlide) {
        activeSlide.classList.add('active-slide');
      }
    }, 50);
  }
});


// TABS SECTION
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      tabs.forEach((t) => t.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active');
      });
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});



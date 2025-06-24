window.addEventListener('scroll', function () {
  const fixedWhatsapp = document.querySelector('.fixed-whatsapp');
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) {
    fixedWhatsapp.style.opacity = '1';
    fixedWhatsapp.style.visibility = 'visible';

    if (headerWhatsapp) {
      headerWhatsapp.style.opacity = '0';
      headerWhatsapp.style.visibility = 'hidden';
    }
  } else {
    fixedWhatsapp.style.opacity = '0';
    fixedWhatsapp.style.visibility = 'hidden';

    if (headerWhatsapp) {
      headerWhatsapp.style.opacity = '1';
      headerWhatsapp.style.visibility = 'visible';
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const navItems = document.querySelectorAll('.nav-bottom ul li');
  const nav = document.querySelector('nav');

  navItems.forEach((item) => {
    const dropdown = item.querySelector('.nav-dropdown');
    if (dropdown) {
      item.addEventListener('mouseenter', function () {
        document
          .querySelectorAll('.nav-dropdown')
          .forEach((d) => d.classList.remove('active'));
        dropdown.classList.add('active');
        nav.classList.add('dropdown-active');
      });

      item.addEventListener('mouseleave', function () {
        setTimeout(() => {
          if (!nav.matches(':hover')) {
            nav.classList.remove('dropdown-active');
            dropdown.classList.remove('active');
          }
        }, 100);
      });
    }
  });

  nav.addEventListener('mouseleave', function () {
    nav.classList.remove('dropdown-active');
    document
      .querySelectorAll('.nav-dropdown')
      .forEach((d) => d.classList.remove('active'));
  });
});

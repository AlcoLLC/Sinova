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

document.addEventListener('DOMContentLoaded', function () {
  // Hamburger menu functionality - əvvəlcə bunu təyin edirik
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    const hamburgerIcon = hamburger.querySelector('i');

    hamburger.addEventListener('click', function () {
      console.log('Hamburger clicked'); // Debug üçün

      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (hamburgerIcon) {
          hamburgerIcon.className = 'fas fa-bars';
        }
      } else {
        mobileMenu.classList.add('active');
        if (hamburgerIcon) {
          hamburgerIcon.className = 'fas fa-xmark';
        }
      }
    });
  }

  // Mobile dropdown functionality
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

  mobileDropdowns.forEach((dropdown) => {
    const dropdownHead = dropdown.querySelector('.mobile-dropdown-head');
    const dropdownIcon = dropdown.querySelector('i');

    if (dropdownHead) {
      dropdownHead.addEventListener('click', function (e) {
        e.preventDefault();

        dropdown.classList.toggle('active');

        if (dropdownIcon) {
          if (dropdown.classList.contains('active')) {
            dropdownIcon.className = 'fa-solid fa-chevron-up';
          } else {
            dropdownIcon.className = 'fa-solid fa-chevron-down';
          }
        }

        // Digər dropdown-ları bağla
        mobileDropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
            const otherIcon = otherDropdown.querySelector('i');
            if (otherIcon) {
              otherIcon.className = 'fa-solid fa-chevron-down';
            }
          }
        });
      });
    }
  });

  // Desktop dropdown functionality
  const dropdowns = document.querySelectorAll('.dropdown');
  const dropdownBackground = document.querySelector('.dropdown-background');

  if (dropdownBackground) {
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener('mouseenter', function () {
        dropdownBackground.style.display = 'block';
        dropdownBackground.style.visibility = 'visible';
        dropdownBackground.style.opacity = '1';
      });

      dropdown.addEventListener('mouseleave', function (e) {
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

    dropdownBackground.addEventListener('mouseleave', function (e) {
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
      dropdownBackground.style.visibility = 'hidden';
      dropdownBackground.style.opacity = '0';
      setTimeout(() => {
        if (dropdownBackground.style.opacity === '0') {
          dropdownBackground.style.display = 'none';
        }
      }, 100);
    }
  }

  function setActiveLinks() {
    const currentPath = window.location.pathname;
    const allNavLinks = document.querySelectorAll(
      '.navbar a[href], .mobile-menu a[href]'
    );

    // Bütün linklərdən active class-ı sil
    allNavLinks.forEach((link) => {
      link.classList.remove('active');
    });

    const dropdownParents = document.querySelectorAll(
      '.dropdown > a, .mobile-dropdown > .mobile-dropdown-head'
    );
    dropdownParents.forEach((parent) => {
      parent.classList.remove('active');
    });

    // Dropdown linklərini yoxla
    const dropdownLinks = document.querySelectorAll(
      '.dropdown-content a[href], .mobile-dropdown-content a[href]'
    );
    let activeDropdownFound = false;

    dropdownLinks.forEach((dropdownLink) => {
      const linkPath = dropdownLink.getAttribute('href');

      if (
        linkPath === currentPath ||
        (linkPath && linkPath !== '/' && currentPath.startsWith(linkPath))
      ) {
        dropdownLink.classList.add('active');

        const parentDropdown = dropdownLink.closest('.dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector('> a');
          if (parentLink) {
            parentLink.classList.add('active');
            activeDropdownFound = true;
          }
        }

        const parentMobileDropdown = dropdownLink.closest('.mobile-dropdown');
        if (parentMobileDropdown) {
          const parentMobileLink = parentMobileDropdown.querySelector(
            '.mobile-dropdown-head'
          );
          if (parentMobileLink) {
            parentMobileLink.classList.add('active');
            activeDropdownFound = true;
          }
        }
      }
    });

    if (!activeDropdownFound) {
      const regularNavLinks = document.querySelectorAll(
        '.navbar a[href]:not(.dropdown-content a), .mobile-menu a[href]:not(.mobile-dropdown-content a)'
      );

      regularNavLinks.forEach((link) => {
        const linkPath = link.getAttribute('href');

        if (linkPath === currentPath) {
          link.classList.add('active');
        } else if (
          linkPath &&
          linkPath !== '/' &&
          linkPath !== '' &&
          currentPath.startsWith(linkPath)
        ) {
          link.classList.add('active');
        }
      });
    }

    handleSpecialDropdownCases(currentPath);
  }

  function handleSpecialDropdownCases(currentPath) {
    const marketsPaths = [
      '/markets_automotive',
      '/markets_industrial',
      '/markets_shipping',
    ];
    const servicesPaths = [
      '/service_aminol_dealer',
      '/service_laboratory',
      '/service_logistics',
    ];

    if (marketsPaths.includes(currentPath)) {
      const marketsDropdown = Array.from(
        document.querySelectorAll('.dropdown > a')
      ).find((link) =>
        link.textContent.trim().toLowerCase().includes('market')
      );

      if (marketsDropdown) {
        marketsDropdown.classList.add('active');
      }

      const mobileMarketsDropdown = Array.from(
        document.querySelectorAll('.mobile-dropdown-head')
      ).find((link) =>
        link.textContent.trim().toLowerCase().includes('market')
      );

      if (mobileMarketsDropdown) {
        mobileMarketsDropdown.classList.add('active');
      }

      const activeDropdownLink = document.querySelector(
        `.dropdown-content a[href="${currentPath}"], .mobile-dropdown-content a[href="${currentPath}"]`
      );
      if (activeDropdownLink) {
        activeDropdownLink.classList.add('active');
      }
    }

    if (servicesPaths.includes(currentPath)) {
      const servicesDropdown = Array.from(
        document.querySelectorAll('.dropdown > a')
      ).find((link) =>
        link.textContent.trim().toLowerCase().includes('service')
      );

      if (servicesDropdown) {
        servicesDropdown.classList.add('active');
      }

      const mobileServicesDropdown = Array.from(
        document.querySelectorAll('.mobile-dropdown-head')
      ).find((link) =>
        link.textContent.trim().toLowerCase().includes('service')
      );

      if (mobileServicesDropdown) {
        mobileServicesDropdown.classList.add('active');
      }

      const activeDropdownLink = document.querySelector(
        `.dropdown-content a[href="${currentPath}"], .mobile-dropdown-content a[href="${currentPath}"]`
      );
      if (activeDropdownLink) {
        activeDropdownLink.classList.add('active');
      }
    }
  }

  setActiveLinks();

  window.addEventListener('popstate', setActiveLinks);
  window.updateActiveLinks = setActiveLinks;

  console.log('Navbar initialized for path:', window.location.pathname);
});

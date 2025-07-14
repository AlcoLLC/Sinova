// Django backend ile entegre çalışan search manager
class SearchManager {
  constructor() {
    this.currentQuery = "";
    this.currentPage = 1;
    this.resultsPerPage = 10;
    this.totalResults = 0;
    this.searchResults = [];
    this.searchTimeout = null;

    // i18n messages - these will be provided by Django template
    this.messages = {
      searchError: gettext(
        "An error occurred during search. Please try again."
      ),
      noResults: gettext("No results found for"),
      noResultsTip: gettext(
        "You can try different keywords or use more general terms."
      ),
      resultsFound: gettext("results found for"),
      showing: gettext("Showing"),
      of: gettext("of"),
      totalResults: gettext("total results"),
    };

    this.initializeElements();
    this.bindEvents();
    this.loadFromURL();
  }

  initializeElements() {
    this.cancelBtn = document.querySelector(".page-header .cancel-button");
    this.searchInput = document.querySelector(".search-input");
    this.searchForm = document.querySelector(".search-form");
    this.searchResultsInfo = document.querySelector(".search-results-info");
    this.searchResultsCount = document.querySelector(".search-results-count");
    this.searchResultsContainer = document.querySelector(
      ".search-results-container"
    );
    this.paginationContainer = document.querySelector(".pagination-container");
    this.paginationInfo = document.querySelector(".pagination-info");
    this.pagination = document.querySelector(".pagination");
    this.searchPlaceholder = document.querySelector(".search-placeholder");
    this.searchLoading = document.querySelector(".search-loading");
  }

  bindEvents() {
    // Cancel button
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clearSearch();
      });
    }

    // Search input events
    if (this.searchInput) {
      // Focus event
      this.searchInput.addEventListener("focus", (e) => {
        setTimeout(() => {
          this.searchInput.focus();
        }, 10);
      });

      // Keydown events
      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (this.searchInput.value.trim().length > 0) {
            this.performSearch(this.searchInput.value.trim());
          }
        }
        if (e.key === "Escape") {
          this.clearSearch();
        }
      });

      // Optional: Real-time search with debounce
      this.searchInput.addEventListener("input", (e) => {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }

        // Uncomment for real-time search:
        /*
        this.searchTimeout = setTimeout(() => {
          const query = this.searchInput.value.trim();
          if (query.length > 2) { // At least 3 characters
            this.performSearch(query);
          } else if (query.length === 0) {
            this.showPlaceholder();
          }
        }, 500);
        */
      });
    }

    // Form submission
    if (this.searchForm) {
      this.searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.searchInput.value.trim().length > 0) {
          this.performSearch(this.searchInput.value.trim());
        }
      });
    }
  }

  loadFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("search");
    const page = parseInt(urlParams.get("page")) || 1;

    if (query) {
      this.searchInput.value = query;
      this.currentPage = page;
      this.performSearch(query, page);
    } else {
      this.showPlaceholder();
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.focus();
        }
      }, 100);
    }
  }

  clearSearch() {
    this.searchInput.value = "";
    this.currentQuery = "";
    this.currentPage = 1;
    this.updateURL();
    this.showPlaceholder();

    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
    }, 10);
  }

  showPlaceholder() {
    if (this.searchPlaceholder) this.searchPlaceholder.style.display = "block";
    if (this.searchResultsInfo) this.searchResultsInfo.style.display = "none";
    if (this.searchResultsContainer) this.searchResultsContainer.innerHTML = "";
    if (this.paginationContainer)
      this.paginationContainer.style.display = "none";
    if (this.searchLoading) this.searchLoading.style.display = "none";
  }

  showLoading() {
    if (this.searchPlaceholder) this.searchPlaceholder.style.display = "none";
    if (this.searchResultsInfo) this.searchResultsInfo.style.display = "none";
    if (this.searchResultsContainer) this.searchResultsContainer.innerHTML = "";
    if (this.paginationContainer)
      this.paginationContainer.style.display = "none";
    if (this.searchLoading) this.searchLoading.style.display = "block";
  }

  showError(message) {
    if (this.searchLoading) this.searchLoading.style.display = "none";
    if (this.searchPlaceholder) this.searchPlaceholder.style.display = "none";
    if (this.searchResultsInfo) this.searchResultsInfo.style.display = "none";
    if (this.paginationContainer)
      this.paginationContainer.style.display = "none";

    if (this.searchResultsContainer) {
      this.searchResultsContainer.innerHTML = `
        <div class="search-error">
          <p><i class="fa-solid fa-exclamation-triangle"></i> ${message}</p>
        </div>
      `;
    }
  }

  async performSearch(query, page = 1) {
    this.showLoading();
    this.currentQuery = query;
    this.currentPage = page;

    try {
      // Django API endpoint'ine AJAX isteği
      const response = await this.fetchSearchResults(query, page);

      if (response.ok) {
        const data = await response.json();
        this.searchResults = data.results || [];
        this.totalResults = data.total_results || 0;
        this.currentPage = data.current_page || page;
        this.totalPages = data.total_pages || 1;
        this.hasNext = data.has_next || false;
        this.hasPrevious = data.has_previous || false;

        this.displayResults();
        this.updateURL();
      } else {
        throw new Error(`Search request failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      this.showError(this.messages.searchError);
    }
  }

  async fetchSearchResults(query, page) {
    const searchParams = new URLSearchParams({
      search: query,
      page: page,
      format: "json",
    });

    const csrfToken = this.getCSRFToken();

    // Django'nun search_api endpoint'ini kullan
    const response = await fetch(`/search/?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    return response;
  }

  getCSRFToken() {
    // CSRF token'ı cookie'den al
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));

    if (csrfCookie) {
      return csrfCookie.split("=")[1];
    }

    // Meta tag'den al
    const csrfMeta = document.querySelector("[name=csrfmiddlewaretoken]");
    if (csrfMeta) {
      return csrfMeta.getAttribute("content");
    }

    // Template'teki hidden input'tan al
    const csrfInput = document.querySelector("[name=csrfmiddlewaretoken]");
    if (csrfInput) {
      return csrfInput.value;
    }

    return "";
  }

  displayResults() {
    if (this.searchLoading) this.searchLoading.style.display = "none";

    if (this.searchResults.length === 0) {
      if (this.searchResultsContainer) {
        this.searchResultsContainer.innerHTML = `
          <div class="no-results">
            <p><i class="fa-solid fa-search"></i> ${this.messages.noResults} "${this.currentQuery}".</p>
            <p class="no-results-tip">${this.messages.noResultsTip}</p>
          </div>
        `;
      }
      if (this.searchResultsInfo) this.searchResultsInfo.style.display = "none";
      if (this.paginationContainer)
        this.paginationContainer.style.display = "none";
      return;
    }

    // Sonuç sayısını göster
    if (this.searchResultsCount) {
      this.searchResultsCount.textContent = `${this.totalResults} ${this.messages.resultsFound} "${this.currentQuery}"`;
    }
    if (this.searchResultsInfo) this.searchResultsInfo.style.display = "block";

    // Sonuçları göster
    if (this.searchResultsContainer) {
      this.searchResultsContainer.innerHTML = this.searchResults
        .map((result) => this.createResultHTML(result))
        .join("");
    }

    // Pagination göster
    if (this.totalPages > 1) {
      this.displayPagination();
    } else {
      if (this.paginationContainer)
        this.paginationContainer.style.display = "none";
    }

    // Arama terimlerini vurgula
    this.highlightSearchTerms(this.currentQuery);
  }

  createResultHTML(result) {
    return `
      <div class="search-result">
        <div class="result-content">
          ${result.image
        ? `<div class="result-image"><img loading="lazy"  src="${result.image}" alt="${result.title}" /></div>`
        : ""
      }
          <div class="result-text">
            <a href="${result.url}" class="result-type">${result.type} ></a>
            <h2><a href="${result.url}">${result.title}</a></h2>
            ${result.description
        ? `<p class="result-description">${result.description}</p>`
        : ""
      }
          </div>
        </div>
        <button class="result-btn">
          <a href="${result.url}"><i class="fa-solid fa-arrow-right"></i></a>
        </button>
      </div>
    `;
  }

  displayPagination() {
    const startIndex = (this.currentPage - 1) * this.resultsPerPage + 1;
    const endIndex = Math.min(
      this.currentPage * this.resultsPerPage,
      this.totalResults
    );

    if (this.paginationInfo) {
      this.paginationInfo.textContent = `${this.messages.showing} ${startIndex}–${endIndex} ${this.messages.of} ${this.totalResults} ${this.messages.totalResults}`;
    }

    let paginationHTML = "";

    // Previous button
    if (this.hasPrevious) {
      paginationHTML += `<a href="#" class="page-btn" data-page="${this.currentPage - 1
        }"><i class="fa-solid fa-chevron-left"></i></a>`;
    }

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      paginationHTML += `<a href="#" class="page-btn" data-page="1">1</a>`;
      if (startPage > 2) {
        paginationHTML += `<span class="ellipsis">...</span>`;
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      if (i === this.currentPage) {
        paginationHTML += `<span class="page-btn active">${i}</span>`;
      } else {
        paginationHTML += `<a href="#" class="page-btn" data-page="${i}">${i}</a>`;
      }
    }

    // Last page
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        paginationHTML += `<span class="ellipsis">...</span>`;
      }
      paginationHTML += `<a href="#" class="page-btn" data-page="${this.totalPages}">${this.totalPages}</a>`;
    }

    // Next button
    if (this.hasNext) {
      paginationHTML += `<a href="#" class="page-btn" data-page="${this.currentPage + 1
        }"><i class="fa-solid fa-chevron-right"></i></a>`;
    }

    if (this.pagination) {
      this.pagination.innerHTML = paginationHTML;
    }
    if (this.paginationContainer) {
      this.paginationContainer.style.display = "block";
    }

    // Pagination event'lerini bağla
    if (this.pagination) {
      this.pagination
        .querySelectorAll(".page-btn[data-page]")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            const page = parseInt(btn.getAttribute("data-page"));
            this.goToPage(page);
          });
        });
    }
  }

  goToPage(page) {
    this.currentPage = page;
    this.performSearch(this.currentQuery, page);
    window.scrollTo({
      top:
        document.querySelector(".search-results-container")?.offsetTop - 100 ||
        0,
      behavior: "smooth",
    });
  }

  updateURL() {
    const url = new URL(window.location);

    if (this.currentQuery) {
      url.searchParams.set("search", this.currentQuery);
      if (this.currentPage > 1) {
        url.searchParams.set("page", this.currentPage);
      } else {
        url.searchParams.delete("page");
      }
    } else {
      url.searchParams.delete("search");
      url.searchParams.delete("page");
    }

    window.history.replaceState({}, "", url.toString());
  }

  highlightSearchTerms(searchQuery) {
    if (!searchQuery) return;

    const resultContents = document.querySelectorAll(
      ".result-text h2 a, .result-text .result-description"
    );

    // Özel karakterleri escape et
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Kelime bazlı arama için regex
    const words = searchQuery.split(/\s+/).filter((word) => word.length > 0);
    const wordRegex = words
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const regex = new RegExp(`(${wordRegex})`, "gi");

    resultContents.forEach((element) => {
      if (element.innerHTML && !element.querySelector(".highlight")) {
        element.innerHTML = element.innerHTML.replace(
          regex,
          '<span class="highlight">$1</span>'
        );
      }
    });
  }
}

// Navbar scroll functionality
class NavbarManager {
  constructor() {
    this.bindScrollEvents();
  }

  bindScrollEvents() {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleNavbarScroll();
          this.handleWhatsappButtons();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    const nav = document.querySelector("nav");

    if (!navbar || !nav) return;

    if (window.scrollY > 20) {
      navbar.classList.remove("transparent");
      navbar.classList.add("scrolled");
      nav.classList.add("scrolled-nav");
    } else {
      navbar.classList.add("transparent");
      navbar.classList.remove("scrolled");
      nav.classList.remove("scrolled-nav");
    }
  }

  handleWhatsappButtons() {
    const headerWhatsapp = document.querySelector(".header-whatsapp");
    const fixedWhatsapp = document.querySelector(".fixed-whatsapp");

    if (!fixedWhatsapp) return;

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
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Eğer sayfa zaten sonuçlar ile yüklenmişse (server-side rendering)
  // ve AJAX kullanmak istemiyorsanız, basit functionality'yi kullanın
  const isServerRendered =
    document.querySelector(".search-results-container")?.children.length > 0;

  if (isServerRendered) {
    // Server-side rendered results için basit JavaScript
    initializeSimpleSearch();
  } else {
    // AJAX-based search için SearchManager'ı kullan
    new SearchManager();
  }

  new NavbarManager();
});

// Server-side rendered results için basit JavaScript
function initializeSimpleSearch() {
  const cancelBtn = document.querySelector(".page-header .cancel-button");
  const searchInput = document.querySelector(".search-input");
  const searchForm = document.querySelector(".search-form");

  // i18n messages for simple search
  const messages = {
    noResults: gettext("No results found for"),
    noResultsTip: gettext(
      "You can try different keywords or use more general terms."
    ),
  };

  if (cancelBtn) {
    cancelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      searchInput.value = "";
      searchInput.focus();
      const url = new URL(window.location);
      url.searchParams.delete("search");
      url.searchParams.delete("page");
      window.location.href = url.toString();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (searchInput.value.trim().length > 0) {
          searchForm.submit();
        }
      }
      if (e.key === "Escape") {
        searchInput.value = "";
        const url = new URL(window.location);
        url.searchParams.delete("search");
        url.searchParams.delete("page");
        window.location.href = url.toString();
      }
    });

    // Focus input if no search query
    if (!searchInput.value) {
      searchInput.focus();
    }
  }

  // Pagination handling
  const paginationNumbers = document.querySelectorAll(".page-btn[data-page]");

  paginationNumbers.forEach(function (pageLink) {
    pageLink.addEventListener("click", function (e) {
      e.preventDefault();
      const pageNum = this.getAttribute("data-page");
      goToPage(pageNum);
    });
  });

  function goToPage(pageNum) {
    const url = new URL(window.location);
    url.searchParams.set("page", pageNum);
    window.location.href = url.toString();
  }

  // Highlight search terms in results
  const queryElement = document.querySelector("[data-search-query]");
  const query = queryElement
    ? queryElement.getAttribute("data-search-query")
    : "";

  if (query && query.trim()) {
    highlightSearchTerms(query.trim());
  }

  function highlightSearchTerms(searchQuery) {
    const resultContents = document.querySelectorAll(
      ".result-text h2, .result-text .result-description"
    );

    const words = searchQuery.split(/\s+/).filter((word) => word.length > 0);
    const wordRegex = words
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const regex = new RegExp(`(${wordRegex})`, "gi");

    resultContents.forEach(function (element) {
      if (element.innerHTML && !element.querySelector(".highlight")) {
        element.innerHTML = element.innerHTML.replace(
          regex,
          '<span class="highlight">$1</span>'
        );
      }
    });
  }
}

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


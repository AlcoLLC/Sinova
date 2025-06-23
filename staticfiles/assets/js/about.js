document.addEventListener('DOMContentLoaded', function () {
  const playButton = document.getElementById('playButton');
  const videoContainer = document.getElementById('videoContainer');
  const youtubeVideo = document.getElementById('youtubeVideo');

  if (playButton) {
    playButton.addEventListener('click', function () {
      playButton.style.display = 'none';
      videoContainer.style.display = 'block';
      const videoSrc = youtubeVideo.src;
      youtubeVideo.src = videoSrc + '&autoplay=1';
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.clickable-tabs .tab');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const targetId = this.getAttribute('data-tab');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        tabs.forEach((t) => t.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
});

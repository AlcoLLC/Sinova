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
       let targetId = this.getAttribute('data-tab');
      
       if (!targetId) {
        targetId = this.getAttribute('data-slug');
      }

       const targetElement = document.getElementById(targetId);

      if (targetElement) {
         const elementPosition = targetElement.offsetTop - 150;
        
         window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });

         tabs.forEach((t) => t.classList.remove('active'));
        
         this.classList.add('active');
      }
    });
  });
});
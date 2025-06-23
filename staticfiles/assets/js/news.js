document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            initializeNewsDisplay();
            checkShowMoreButton();
        });
    });
    
    function initializeNewsDisplay() {
        tabContents.forEach(tabContent => {
            const newsItems = tabContent.querySelectorAll('.news-sinova-content');
            newsItems.forEach((item, index) => {
                item.classList.remove('hidden', 'fade-in', 'preparing');
                if (index < 6) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }
    
    const showMoreButton = document.getElementById('showMoreNewsButton');
    showMoreButton.addEventListener('click', function() {
        const activeTabContent = document.querySelector('.tab-content.active');
        const hiddenItems = activeTabContent.querySelectorAll('.news-sinova-content.hidden');
        
        this.style.pointerEvents = 'none';
        
        const itemsToShow = Math.min(3, hiddenItems.length);
        
        for (let i = 0; i < itemsToShow; i++) {
            setTimeout(() => {
                hiddenItems[i].classList.remove('hidden');
                hiddenItems[i].classList.add('preparing');
                
                setTimeout(() => {
                    hiddenItems[i].classList.add('fade-in');
                }, 50);
            }, i * 300);
        }
        
        setTimeout(() => {
            this.style.pointerEvents = 'auto';
            checkShowMoreButton();
        }, itemsToShow * 300 + 800);
    });
    
    const scrollTopButton = document.getElementById('scrollTopButton');
    scrollTopButton.addEventListener('click', function() {
        const newsSection = document.querySelector('.news-section');
        newsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });

    

    
    
    function checkShowMoreButton() {
        const activeTabContent = document.querySelector('.tab-content.active');
        const allItems = activeTabContent.querySelectorAll('.news-sinova-content');
        const hiddenItems = activeTabContent.querySelectorAll('.news-sinova-content.hidden');
        
        if (allItems.length > 6 && hiddenItems.length > 0) {
            showMoreButton.style.display = 'block';
        } else {
            showMoreButton.style.display = 'none';
        }
    }
    
    initializeNewsDisplay();
    checkShowMoreButton();
});
if (!customElements.get('filter-slider')) {
  customElements.define(
    'filter-slider',
    class FilterSlider extends HTMLElement {
      constructor() {
        super();

        this.slider = this.querySelector('.filter-slider-wrap');
        this.slides = this.querySelectorAll('.filter-slider-slide');
        this.pagination = this.querySelector('.pagination');
        this.youtubeIframes = this.querySelectorAll('.js-youtube');
        this.vimeoIframes = this.querySelectorAll('.js-vimeo');
        this.videos = this.querySelectorAll('.filter-slider-slide video');
        this.currentIndex = 0;

        this.setupPagination();
        this.updateMediaState();
      }

      goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        this.currentIndex = index;
        // Adjust the transform based on percentage to accommodate any number of slides
        this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updatePagination();
        this.updateMediaState();
      }

      setupPagination() {
        // Clear any existing dots to prevent duplication
        this.pagination.innerHTML = '';

        // Dynamically create a dot for each slide
        this.slides.forEach((slide, index) => {
          const dot = document.createElement('span');
          dot.classList.add('dot');
          dot.setAttribute('tabindex', '0');
          dot.setAttribute('role', 'button');
          dot.setAttribute('aria-label', `Pagination dot ${index + 1}`);

          if (index === 0) {
            dot.classList.add('active');
          }

          // Event listener for click
          dot.addEventListener('click', () => this.goToSlide(index));

          // Event listener for keyboard accessibility
          dot.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              this.goToSlide(index);
            }
          });

          this.pagination.appendChild(dot);
        });
      }

      updatePagination() {
        const dots = this.pagination.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
          if (index === this.currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      updateMediaState() {
        // Pause all videos and iframes
        this.videos.forEach(video => video.pause());
        this.youtubeIframes.forEach(iframe => {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });
        this.vimeoIframes.forEach(iframe => {
          iframe.contentWindow.postMessage('{"method":"pause"}', '*');
        });

        // Play videos and iframes in the active slide
        const activeSlide = this.slides[this.currentIndex];
        const activeVideos = activeSlide.querySelectorAll('video');
        const activeYoutubeIframe = activeSlide.querySelector('.js-youtube');
        const activeVimeoIframe = activeSlide.querySelector('.js-vimeo');

        activeVideos.forEach(video => {
          video.play();
        });

        if (activeYoutubeIframe) {
          activeYoutubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
        if (activeVimeoIframe) {
          activeVimeoIframe.contentWindow.postMessage('{"method":"play"}', '*');
        }
      }

      connectedCallback() {
        document.addEventListener('shopify:section:load', this.handleSectionLoad.bind(this));
        document.addEventListener('shopify:section:unload', this.handleSectionUnload.bind(this));
        document.addEventListener('shopify:block:select', this.handleBlockSelect.bind(this));
      
        this.videos.forEach(video => {
          video.addEventListener('pointerdown', (event) => {
            event.preventDefault();
          });
        });
      }

      handleSectionLoad(event) {
        this.setupPagination();
        this.goToSlide(0);
      }

      handleSectionUnload(event) {
        this.pagination.innerHTML = '';
      }

      handleBlockSelect(event) {
        const blockSelectedIsSlide = event.target.classList.contains('filter-slider-slide');
        if (!blockSelectedIsSlide) return;

        const filterSlide = event.target;
        const slideIndex = Array.from(this.slides).indexOf(filterSlide);
        if (slideIndex !== -1) {
          this.goToSlide(slideIndex);
        }
      }
    }
  );
}

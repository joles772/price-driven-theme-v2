(function () {
  function productSlider() {
    const sliders = document.querySelectorAll('.product-slider');

    if (sliders.length) {
      sliders.forEach((slider) => {
        const id = slider.dataset.sectionId;

        const swiperOptions = {
          direction: 'horizontal',
          loop: true,
          autoHeight: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        };
        const swiperannounsmentSlider = new Swiper(`.product-slider-${id}`, swiperOptions);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', productSlider);
  document.addEventListener('shopify:section:load', productSlider);
})();

let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;

        const swiperContainer = document.querySelector('.mySwiper');

        swiperContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            currentTranslate = swiper.getTranslate();
        });

        swiperContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const diffX = e.clientX - startX;
            swiper.setTranslate(currentTranslate + diffX);
        });

        swiperContainer.addEventListener('mouseup', () => {
            isDragging = false;
            swiper.slideToClosest();
        });

        swiperContainer.addEventListener('mouseleave', () => {
            if (!isDragging) return;
            isDragging = false;
            swiper.slideToClosest();
        });

        swiperContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            currentTranslate = swiper.getTranslate();
        });

        swiperContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const diffX = e.touches[0].clientX - startX;
            swiper.setTranslate(currentTranslate + diffX);
        });

        swiperContainer.addEventListener('touchend', () => {
            isDragging = false;
            swiper.slideToClosest();
        });
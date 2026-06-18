/* 
    KaiZen Solutions - Home Page Specific Logic
    Hero Slideshow and Partners Slider
*/

document.addEventListener('DOMContentLoaded', () => {
    // Hero Slideshow Logic
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    const slideInterval = 5000;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        };

        let autoSlide = setInterval(nextSlide, slideInterval);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(autoSlide);
                showSlide(index);
                autoSlide = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // Partners Slider Initialization
    const initPartnersSlider = () => {
        const pSlides = document.querySelectorAll('.partner-slide');
        const pDots = document.querySelectorAll('.partner-dot');
        const sliderContainer = document.querySelector('.partners-slider');
        let pCurrentSlide = 0;
        let pAutoSlide;

        if (pSlides.length > 0) {
            const updateSliderHeight = () => {
                const activeSlide = document.querySelector('.partner-slide.active');
                if (activeSlide && sliderContainer) {
                    const height = activeSlide.offsetHeight;
                    sliderContainer.style.height = height + 'px';
                }
            };

            const showPSlide = (index) => {
                pSlides.forEach(s => s.classList.remove('active'));
                pDots.forEach(d => d.classList.remove('active'));
                
                pSlides[index].classList.add('active');
                if (pDots[index]) pDots[index].classList.add('active');
                pCurrentSlide = index;
                
                setTimeout(updateSliderHeight, 50);
            };

            const nextPSlide = () => {
                let next = (pCurrentSlide + 1) % pSlides.length;
                showPSlide(next);
            };

            if (pAutoSlide) clearInterval(pAutoSlide);
            pAutoSlide = setInterval(nextPSlide, 6000);

            pDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    clearInterval(pAutoSlide);
                    showPSlide(index);
                    pAutoSlide = setInterval(nextPSlide, 6000);
                });
            });

            updateSliderHeight();
            window.addEventListener('resize', updateSliderHeight);
        }
    };

    window.addEventListener('partnersLoaded', initPartnersSlider);
    initPartnersSlider();
});

// 로그인 이미지 슬라이더
function Slider() {
    const carouselSlides = document.querySelectorAll('.slide');
    const dotsSlide = document.querySelector('.dots-container');
    let currentSlide = 0;


    // 선택 slider
    const activeDot = function (slide) {
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        document.querySelector(`.dot[data-slide="${slide}"]`).classList.add('active');
    };
    activeDot(currentSlide);

    const changeSlide = function (slides) {
        carouselSlides.forEach((slide, index) => (slide.style.transform = `translateX(${100 * (index - slides)}%)`));
    };
    changeSlide(currentSlide);


    dotsSlide.addEventListener('click', function (e) {
        if (e.target.classList.contains('dot')) {
            const slide = e.target.dataset.slide;
            changeSlide(slide);
            activeDot(slide);
        }
    });

    // 자동 slider
    setInterval(function(){
        currentSlide++;
        if (carouselSlides.length - 1 < currentSlide) {
            currentSlide = 0;
        };
        changeSlide(currentSlide);
        activeDot(currentSlide);

    }, 3500);

};
window.onload = function() {
    Slider();
}
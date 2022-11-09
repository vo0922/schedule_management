/**
 * 담당자 : 이승현
 * 함수 설명 : forEach문으로 2개의 인자값을 받아와 transform 속성을 계산된 값으로 변경해 주고,
 *            setInterval 함수로 2초마다 자동 슬라이드 되게 하였습니다.
 * 주요 기능 : 로그인 페이지에서 이미지를 2초 간격으로 슬라이드 해 주고
 *            버튼 클릭 시 해당 이미지로 이동합니다.
 */
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
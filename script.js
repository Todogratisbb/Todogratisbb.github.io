document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".carousel__container");
    const items = Array.from(document.querySelectorAll(".carousel__item"));
    const videoPlayer = document.getElementById("videoPlayer");
    let currentIndex = 0;
    let transitioning = false;
    let startX = 0;
    let currentTranslate = 0;

    // Clonar elementos para el efecto infinito
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);
    
    container.appendChild(firstClone);
    container.insertBefore(lastClone, items[0]);

    const updateCarousel = () => {
        if (transitioning) return;
        transitioning = true;
        container.style.transition = 'transform 0.5s ease-in-out';
        container.style.transform = `translateX(-${(currentIndex + 1) * 600}px)`;

        setTimeout(() => {
            if (currentIndex === items.length) {
                currentIndex = 0;
                container.style.transition = 'none';
                container.style.transform = `translateX(-${(currentIndex + 1) * 600}px)`;
            } else if (currentIndex === -1) {
                currentIndex = items.length - 1;
                container.style.transition = 'none';
                container.style.transform = `translateX(-${(currentIndex + 1) * 600}px)`;
            }
            transitioning = false;
        }, 500);
    };

    const playVideo = (videoSrc) => {
        videoPlayer.querySelector('source').src = videoSrc;
        videoPlayer.load();
        videoPlayer.play();
    };

    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        container.style.transition = 'none';
        currentTranslate = -((currentIndex + 1) * 600);
    });

    container.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const translateX = currentTranslate + (touch.clientX - startX);
        container.style.transform = `translateX(${translateX}px)`;
    });

    container.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                currentIndex--;
            } else {
                currentIndex++;
            }
        }

        updateCarousel();
    });

    container.addEventListener("click", (e) => {
        if (e.target.closest(".carousel__item")) {
            const videoSrc = e.target.closest(".carousel__item").getAttribute("data-video");
            playVideo(videoSrc);
        }
    });

    // Iniciar en el primer elemento real
    container.style.transform = `translateX(-600px)`;
});
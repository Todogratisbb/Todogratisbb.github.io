const video = document.getElementById('video');
const videoContainer = document.getElementById('video-container');
const playPauseButton = document.getElementById('play-pause');
const fullscreenButton = document.getElementById('fullscreen-button');
const controls = document.getElementById('controls');
const canvas = document.getElementById('jellyfish-canvas');
const ctx = canvas.getContext('2d');

let controlsTimeout;

function togglePlayPause() {
    if (video.paused) {
        video.play();
        playPauseButton.textContent = 'Pausar';
        hideControls();
    } else {
        video.pause();
        playPauseButton.textContent = 'Reproducir';
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) { // Firefox
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) { // IE/Edge
            videoContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function hideControls() {
    controls.classList.add('hidden');
}

function showControls() {
    controls.classList.remove('hidden');
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 3000); // Ocultar después de 3 segundos
}

playPauseButton.addEventListener('click', togglePlayPause);
fullscreenButton.addEventListener('click', toggleFullscreen);

videoContainer.addEventListener('click', (event) => {
    if (event.target !== playPauseButton && event.target !== fullscreenButton) {
        togglePlayPause();
    }
});

videoContainer.addEventListener('mousemove', showControls);
videoContainer.addEventListener('touchstart', showControls);

video.addEventListener('play', () => {
    playPauseButton.textContent = 'Pausar';
    hideControls();
});

video.addEventListener('pause', () => {
    playPauseButton.textContent = 'Reproducir';
    showControls();
});

function drawJellyfish(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 30, y + 30, x + 30, y + 30, x, y + 60);
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (i - 4) * 5, y + 60);
        ctx.lineTo(x + (i - 4) * 5, y + 80 + Math.sin(Date.now() / 200 + i) * 10);
        ctx.strokeStyle = '#39FF14';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJellyfish(x, y);
    
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 500);
});

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ajustar el canvas cuando se entra o sale del modo pantalla completa
document.addEventListener('fullscreenchange', resizeCanvas);
document.addEventListener('webkitfullscreenchange', resizeCanvas);
document.addEventListener('mozfullscreenchange', resizeCanvas);
document.addEventListener('MSFullscreenChange', resizeCanvas);

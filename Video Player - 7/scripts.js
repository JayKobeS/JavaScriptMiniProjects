const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const toggle = player.querySelector('.toggle');
const progressBar = player.querySelector('.progress__filled');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelectorAll('.fullscreen');
const changeVideoButton = document.querySelector('.changeVideoButton');
const videoFileInput = document.getElementById('videoFileInput');

function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip(){
    console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip)
}


function handleRangeUpdate() {
    video[this.name] = this.value;
    console.log(this.value);
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(e);
}

function handleArrowSkip(e) {
    if (e.key === 'ArrowRight') {
        video.currentTime += 10;
    } else if (e.key === 'ArrowLeft') {
        video.currentTime -= 10;
    }
    else {
        return;
    }
    e.preventDefault();
}
function handleVideoChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
        const fileURL = URL.createObjectURL(file);
        video.src = fileURL;
        video.load();
        video.play();
    }
}

function PauseSpace(e) {
    if (e.key === ' ') {
        togglePlay();
        e.preventDefault();
    }
    else if (e.key === 'Spacebar') {
        togglePlay();
        e.preventDefault();
    }
    else {
        return;
    }
}

function handleFullscreen() {
    if (!document.fullscreenElement) {
        player.requestFullscreen();
    }
    else {
        document.exitFullscreen();
    }
}


video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay)
skipButtons.forEach(button => button.addEventListener('click', skip))

window.addEventListener('keydown', handleArrowSkip);
window.addEventListener('keydown', PauseSpace);

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

changeVideoButton.addEventListener('click', () => videoFileInput.click());
videoFileInput.addEventListener('change', handleVideoChange);

let mousedown = false;

progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', () => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullscreen.forEach(button => button.addEventListener('click', handleFullscreen));
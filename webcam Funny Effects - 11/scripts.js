const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const red = document.querySelector('.red');
const split = document.querySelector('.split');
let currentEffect = null; // 'red' | 'split' | 'green'

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();
    })
    .catch(err => {
        console.error('Oh No',err);
    });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.height = height;
    canvas.width = width;
    console.log(width, height);

    return setInterval(() => {
       ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 

       let pixels = ctx.getImageData(0,0, width, height);

         if (currentEffect === 'red') {
          pixels = redEffect(pixels);
         } else if (currentEffect === 'split') {
          pixels = rgbSplit(pixels);
         } else if (currentEffect === 'greenScreen') {
          pixels = greenScreen(pixels);
         }
       ctx.putImageData(pixels, 0,0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play()
    

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="handsome man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i=0; i < pixels.data.length; i+=4){
        pixels.data[i] = pixels.data[i] + 100; //red
        pixels.data[i+1] = pixels.data[i+1] -50; //green
        pixels.data[i+2] = pixels.data[i+2] * 0.5; //blue

    }
    return pixels;
}

function rgbSplit(pixels) {
        for(let i=0; i < pixels.data.length; i+=4){
        pixels.data[i - 150] = pixels.data[i];
        pixels.data[i + 100] = pixels.data[i+1];
        pixels.data[i + 150] = pixels.data[i+2];

    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {} ;
    document.querySelectorAll('.rgb input').forEach((input) =>{
        const val = Number(input.value);
        levels[input.name] = Number.isFinite(val) ? val : 0;
    });

    for(let i=0; i < pixels.data.length; i = i + 4){
        const r = pixels.data[i];
        const g = pixels.data[i+1];
        const b = pixels.data[i+2];

        if(r >= levels.rmin
            && g >= levels.gmin
            && b >= levels.bmin
            && r <= levels.rmax
            && g <= levels.gmax
            && b <= levels.bmax){
                pixels.data[i+3] = 0;
            }
    }
    return pixels;
}

function setEffect(mode) {
    currentEffect = mode;
}

function clearEffect() {
    currentEffect = null;
}


getVideo();


video.addEventListener('canplay', paintToCanvas);

let btnStart = document.querySelector('#btnStart')

let videoInput = document.querySelector('#videoInput')
let canvasOutput = document.querySelector('#canvasOutput')
let canvasContext = canvasOutput.getContext('2d', { willReadFrequently: true })
let videoStream = null

const FPS = 30
let src = null
let dst = null
let cap = null

// Clique no botão.
btnStart.addEventListener('click', function() {
    if (videoStream == null) {
        startVideo()
    } else {
        stopVideo()
    }
})

// Iniciar vídeo.
function startVideo() {
    const qvga = {
        width: { exact: 320 },
        height: { exact: 240 }
    }

    navigator.mediaDevices.getUserMedia({ video: qvga, audio: false })
    .then(function (stream) {
        videoStream = stream

        videoInput.srcObject = stream
        videoInput.play()
        videoInput.addEventListener('canplay', videoCanStart, false)
    })
    .catch(function (error) {
        console.dir(error)
    });
}

// Parar vídeo.
function stopVideo() {
    videoInput.pause()  // Parar a mostragem do vídeo.
    videoInput.srcObject = null

    canvasContext.clearRect(0, 0, canvasOutput.width, canvasOutput.height)

    videoStream.getVideoTracks()[0].stop()  // Desligar a câmera.
    videoStream = null
}

// Vídeo pode ser iniciado/tratado.
function videoCanStart() {
    src = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4)
    dst = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC1)
    cap = new cv.VideoCapture(videoInput)

    // Iniciar processo de vídeo.
    processVideo()
}

// Processar vídeo.
function processVideo() {
    try {
        if (!videoStream) {
            // Clean and stop.
            src.delete()
            dst.delete()
            return
        }
        let begin = Date.now()

        // Processing.
        cap.read(src)
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)
        cv.imshow('canvasOutput', dst)

        // Delay.
        let delay = 1000 / FPS - (Date.now() - begin)
        setTimeout(processVideo, delay)
    } catch (error) {
        console.dir(error)
    }
}
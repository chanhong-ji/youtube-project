const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
let stream;
let recorder;
let videoFile;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

const onDownload = () => {
  startBtn.innerText = "Start Recording";
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording";
  document.body.appendChild(a);
  a.click();
};

const onStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", onStop);
  startBtn.addEventListener("click", onDownload);
  recorder.stop();
};

const onStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", onStart);
  startBtn.addEventListener("click", onStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

startBtn.addEventListener("click", onStart);

init();

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

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

const onDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true, corePath: "/build/ffmpeg-core.js" });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4Array = ffmpeg.FS("readFile", "output.mp4");
  const thumbArray = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4Array.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbArray.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  startBtn.innerText = "Start Recording";

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "MyRecording.mp4");
  ffmpeg.FS("unlink", "MyThumbnail.jpg");
  ffmpeg.FS("unlink", "recording.webm");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
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

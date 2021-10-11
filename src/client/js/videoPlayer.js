const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const onPlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const onMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const onVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "mute";
  }
  video.volume = value;
  volumeValue = value;
};

const timeFormat = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const onLoadedMetaData = () => {
  const total = Math.floor(video.duration);
  totalTime.innerText = timeFormat(total);
  timeline.max = total;
};

const onTimeUpdate = () => {
  const current = Math.floor(video.currentTime);
  currentTime.innerText = timeFormat(current);
  timeline.value = current;
};

const onTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const onFullScreen = (event) => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter full screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit full screen";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const onMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const onMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", onPlayClick);
muteBtn.addEventListener("click", onMuteClick);
volumeRange.addEventListener("input", onVolumeChange);
video.addEventListener("loadedmetadata", onLoadedMetaData);
video.addEventListener("timeupdate", onTimeUpdate);
video.addEventListener("mousemove", onMouseMove);
video.addEventListener("mouseleave", onMouseLeave);
timeline.addEventListener("input", onTimelineChange);
fullScreenBtn.addEventListener("click", onFullScreen);

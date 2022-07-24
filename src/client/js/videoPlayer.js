const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const onPlayClick = (event) => {
  if (
    event == PointerEvent &&
    event.target.id !== "videoContainer" &&
    event.currentTarget.id !== "play"
  )
    return;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }

  playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const onControlClick = (e) => {
  e.stopPropagation();
};

const onMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.className = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
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

const timeFormat = (seconds) => {
  const duration = new Date(seconds * 1000).toISOString().substring(11, 19);
  if (duration.substring(0, 2) === "00") {
    return duration.substring(3);
  } else {
    return duration;
  }
};

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
    fullScreenBtnIcon.className = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtnIcon.className = "fas fa-compress";
  }
};

const onFullScreenChange = (event) => {
  if (!document.fullscreenElement) {
    fullScreenBtnIcon.className = "fas fa-expand";
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

const onKeyPress = (event) => {
  const key = event.key;
  if (event.target.tagName === "TEXTAREA") {
    return;
  }

  if (event.code == "F5") {
    return location.reload();
  }
  if (event.code === "Space") {
    event.preventDefault();
    return onPlayClick();
  }

  if (!document.fullscreenElement && key === "f") {
    return onFullScreen();
  }

  if (key === "ArrowLeft") {
    video.currentTime -= 5;
  }
  if (key === "ArrowRight") {
    video.currentTime += 5;
  }

  if (event.target === videoContainer) {
    event.preventDefault();
    if (key === "ArrowUp") {
      video.volume =
        video.volume == 1 ? 1 : (video.volume + 0.1).toPrecision(2);
      volumeRange.value = video.volume;
    } else if (key === "ArrowDown") {
      video.volume =
        video.volume == 0 ? 0 : (video.volume - 0.1).toPrecision(2);
      volumeRange.value = video.volume;
    }
  }
};

const onEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const interId = setInterval(() => {
  if (video.duration) {
    clearInterval(interId);
    onLoadedMetaData();
  }
}, 1000);

playBtn.addEventListener("click", onPlayClick);
muteBtn.addEventListener("click", onMuteClick);
volumeRange.addEventListener("input", onVolumeChange);
video.addEventListener("timeupdate", onTimeUpdate);
videoContainer.addEventListener("click", onPlayClick);
video.addEventListener("ended", onEnded);
videoContainer.addEventListener("mousemove", onMouseMove);
videoContainer.addEventListener("mouseleave", onMouseLeave);
videoControls.addEventListener("click", onControlClick);
timeline.addEventListener("input", onTimelineChange);
fullScreenBtn.addEventListener("click", onFullScreen);
document.addEventListener("keydown", onKeyPress);
document.addEventListener("fullscreenchange", onFullScreenChange);

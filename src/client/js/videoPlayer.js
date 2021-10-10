const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const onPlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
const onMute = (event) => {
  if (video.muted) {
    console.log("yes");
  }
};
const onPause = () => (playBtn.innerText = "Play");
const onPlay = () => (playBtn.innerText = "Pause");

playBtn.addEventListener("click", onPlayClick);
muteBtn.addEventListener("click", onMute);
video.addEventListener("pause", onPause);
video.addEventListener("play", onPlay);

const startBtn = document.getElementById("startBtn");

const onStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
};

startBtn.addEventListener("click", onStart);

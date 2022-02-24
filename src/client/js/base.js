const sideBar = document.querySelector(".side-bar");
const menuBtn = document.querySelector(".menu-btn");

const onMenuClick = () => {
  const on = menuBtn.classList.contains("on");
  if (on) {
    menuBtn.classList.remove("on");
    sideBar.animate(
      [
        { transform: "translateX(0px)", easing: "ease-in" },
        { transform: "translateX(-170px)", easing: "ease-out" },
      ],
      {
        duration: 300,
        fill: "forwards",
      }
    );
  } else {
    menuBtn.classList.add("on");
    sideBar.animate(
      [
        { transform: "translateX(-170px)", easing: "ease-in" },
        { transform: "translateX(0px)", easing: "ease-out" },
      ],
      {
        duration: 300,
        fill: "forwards",
      }
    );
  }
};

menuBtn.addEventListener("click", onMenuClick);

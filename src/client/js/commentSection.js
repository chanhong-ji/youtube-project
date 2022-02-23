const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const comments = document.querySelector(".video__comments ul");
const commentList = comments.querySelectorAll("li");

const addComment = (text, id, name, avatarUrl) => {
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const avatarImg = document.createElement("img");
  avatarImg.src = avatarUrl;
  avatarImg.alt = "";
  avatarImg.crossOrigin = true;
  const textBox = document.createElement("div");
  textBox.className = "text-box";
  const textBoxBox = document.createElement("div");
  const textBoxBoxSpan = document.createElement("span");
  textBoxBoxSpan.innerText = name;
  const textBoxText = document.createElement("div");
  textBoxText.className = "text";
  textBoxText.innerText = ` ${text}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "❌";
  newComment.appendChild(avatarImg);
  newComment.appendChild(textBox);
  textBox.appendChild(textBoxBox);
  textBoxBox.appendChild(textBoxBoxSpan);
  textBox.appendChild(textBoxText);
  newComment.appendChild(deleteSpan);
  comments.prepend(newComment);
  deleteSpan.addEventListener("click", onDeleteBtnClick);
};

const onSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";

  if (response.status === 201) {
    const { commentId, commentName, commentAvatar } = await response.json();
    addComment(text, commentId, commentName, commentAvatar);
  }
};

const onDeleteBtnClick = async (event) => {
  const li = event.target.parentElement;
  const commentId = li.dataset.id;
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (response.status == 200) {
    li.remove();
  }
};

form.addEventListener("submit", onSubmit);
commentList.forEach((comment) => {
  const deleteBtn = comment.querySelector("span:nth-child(3)");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", onDeleteBtnClick);
  }
});

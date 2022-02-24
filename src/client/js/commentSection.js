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
  const textBoxName = document.createElement("div");
  textBoxName.className = "name";
  const textBoxNameText = document.createElement("span");
  textBoxNameText.innerText = name;
  const textBoxText = document.createElement("div");
  textBoxText.className = "text";
  textBoxText.innerText = ` ${text}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "delete";
  deleteSpan.innerText = "✖";
  newComment.appendChild(avatarImg);
  newComment.appendChild(textBox);
  textBox.appendChild(textBoxName);
  textBoxName.appendChild(textBoxNameText);
  textBoxName.appendChild(deleteSpan);
  textBox.appendChild(textBoxText);
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
  const li = event.target.parentElement.parentElement.parentElement;
  const commentId = li.dataset.id;
  console.log("comment li id: ", commentId);
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
  if (response.status == 200) {
    li.remove();
  }
};

form.addEventListener("submit", onSubmit);
commentList.forEach((comment) => {
  const deleteBtn = comment.querySelector(".name span:nth-child(2)");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", onDeleteBtnClick);
  }
});

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const comments = document.querySelector(".video__comments ul");
const commentList = comments.querySelectorAll("li");

const addComment = (text, id, name) => {
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  const textBox = document.createElement("div");
  textBox.className = "text-box";
  const textBoxBox = document.createElement("div");
  const textBoxBoxSpan = document.createElement("span");
  textBoxBoxSpan.innerText = name;
  const textBoxText = document.createElement("div");
  textBoxText.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(avatar);
  newComment.appendChild(textBox);
  textBox.appendChild(textBoxBox);
  textBoxBox.appendChild(textBoxBoxSpan);
  textBox.appendChild(textBoxText);
  newComment.appendChild(span2);
  comments.prepend(newComment);
  span2.addEventListener("click", onDeleteBtnClick);
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
    const { commentId, commentName } = await response.json();
    addComment(text, commentId, commentName);
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

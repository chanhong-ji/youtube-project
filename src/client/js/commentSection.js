const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const comments = document.querySelector(".video__comments ul");
const commentList = comments.querySelectorAll("li");

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const i = document.createElement("i");
  i.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  newComment.appendChild(i);
  newComment.appendChild(span);
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
    const { commentId } = await response.json();
    addComment(text, commentId);
  } else {
    console.log("fail");
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

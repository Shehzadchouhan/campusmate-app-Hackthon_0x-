document.addEventListener("DOMContentLoaded", () => {
  const posts = JSON.parse(localStorage.getItem("campusmatePosts")) || [];
  const userURN = "2302612";
  const container = document.querySelector(".post-gallery");

  const userPosts = posts.filter(post => post.user === userURN);

  if (userPosts.length === 0) {
    container.innerHTML = "<p style='color: #777;'>No posts yet.</p>";
    return;
  }

  userPosts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post-card");
    div.innerHTML = `
      <h4>${post.title}</h4>
      <small class="timestamp">🕒 ${post.timestamp || ''}</small>
      <p class="category">Category: ${post.category}</p>
    `;
    container.appendChild(div);
  });
});

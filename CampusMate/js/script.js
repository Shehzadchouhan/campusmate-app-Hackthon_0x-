// 🔁 Load posts from localStorage or use default
let posts = JSON.parse(localStorage.getItem("campusmatePosts")) || [
  {
    id: 1,
    title: "Looking for DBMS notes",
    content: "Anyone has DBMS notes from 2nd year? Please share.",
    category: "Notes",
    image: "",
    likes: 10,
    comments: 2,
    commentList: [],
    user: "2302612",
    timestamp: "2024-05-20, 10:15 AM"
  },
  {
    id: 2,
    title: "Lost Calculator",
    content: "Lost my Casio calculator near CS block. If found, please contact me.",
    category: "Lost & Found",
    image: "",
    likes: 5,
    comments: 1,
    commentList: [],
    user: "2302612",
    timestamp: "2024-05-21, 11:45 AM"
  }
];

// Save posts
function savePosts() {
  localStorage.setItem("campusmatePosts", JSON.stringify(posts));
}

// Render posts
function renderPosts(postsArray) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";

  postsArray.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
      <h3>${post.title} <small class="category">[${post.category}]</small></h3>
      <small class="timestamp">🕒 ${post.timestamp || ''}</small>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ""}
      <div class="post-actions">
        <button class="like-btn" data-index="${index}">👍 ${post.likes}</button>
        <button class="comment-toggle-btn" data-index="${index}">💬 ${post.comments}</button>
      </div>
      <div class="comment-box" id="comment-box-${index}" style="display: none;">
        <input type="text" placeholder="Write a comment..." class="comment-input" data-index="${index}" />
        <button class="comment-submit-btn" data-index="${index}">Post</button>
        <div class="comment-list" id="comment-list-${index}">
          ${post.commentList?.map(c => `<p>💬 ${c}</p>`).join("")}
        </div>
      </div>
    `;

    container.appendChild(postDiv);
  });

  // Likes
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      posts[index].likes++;
      savePosts();
      renderPosts(posts);
    });
  });

  // Toggle comments
  document.querySelectorAll('.comment-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      const box = document.getElementById(`comment-box-${index}`);
      box.style.display = box.style.display === 'none' ? 'block' : 'none';
    });
  });

  // Submit comments
  document.querySelectorAll('.comment-submit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      const input = document.querySelector(`.comment-input[data-index="${index}"]`);
      const text = input.value.trim();
      if (text) {
        posts[index].comments++;
        posts[index].commentList = posts[index].commentList || [];
        posts[index].commentList.push(text);
        savePosts();
        renderPosts(posts);
      }
    });
  });
}

// Handle form submit
document.getElementById("postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const category = document.getElementById("category").value;
  const imageFile = document.getElementById("postImage").files[0];

  if (!title || !content || !category) return;

  const newPost = {
    id: Date.now(),
    title,
    content,
    category,
    image: "",
    likes: 0,
    comments: 0,
    commentList: [],
    user: "2302612",
    timestamp: new Date().toLocaleString()
  };

  const saveAndRender = () => {
    posts.unshift(newPost);
    savePosts();
    renderPosts(posts);
    showSection('home');
    document.getElementById("postForm").reset();
    document.getElementById("imagePreview").style.display = "none";
  };

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      newPost.image = e.target.result;
      saveAndRender();
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveAndRender();
  }
});

// Image preview
document.getElementById("postImage").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("imagePreview");
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
});

// Search
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query)
  );
  renderSearchResults(filtered);
});

function renderSearchResults(results) {
  searchResults.innerHTML = '';
  if (results.length === 0) {
    searchResults.innerHTML = '<p>No posts found.</p>';
    return;
  }

  results.forEach(post => {
    const div = document.createElement('div');
    div.classList.add('post');
    div.innerHTML = `
      <h3>${post.title} <small class="category">[${post.category}]</small></h3>
      <small class="timestamp">🕒 ${post.timestamp || ''}</small>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" class="post-image">` : ""}
      <div class="post-actions">
        <span>👍 ${post.likes}</span> | <span>💬 ${post.comments}</span>
      </div>
    `;
    searchResults.appendChild(div);
  });
}

// Section toggling
function showSection(section) {
  const sections = ['home', 'search', 'post'];
  sections.forEach(sec => {
    const el = document.getElementById(sec + 'Section');
    if (el) el.style.display = sec === section ? 'block' : 'none';
  });
}

// Sort dropdown
document.getElementById("sortOptions")?.addEventListener("change", function () {
  const value = this.value;
  let sorted = [...posts];

  if (value === "newest") {
    sorted.sort((a, b) => b.id - a.id);
  } else if (value === "oldest") {
    sorted.sort((a, b) => a.id - b.id);
  } else if (value === "likes") {
    sorted.sort((a, b) => b.likes - a.likes);
  }

  renderPosts(sorted);
});

const toggleBtn = document.getElementById("toggleModeBtn");
const body = document.body;

// Initial check for theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️ Light Mode";
} else {
  body.classList.add("light-mode");
  toggleBtn.textContent = "🌙 Dark Mode";
}

// Toggle theme on click
toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    toggleBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  }
});


// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  showSection('home');
  renderPosts(posts);
});

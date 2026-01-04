import client from "./config.js";

const postDetailContainer = document.getElementById("postDetailContainer");

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

async function renderPostDetail() {
  if (!postId) return postDetailContainer.innerHTML = "<p>Post not found</p>";

  const { data: posts, error } = await client
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single(); // fetch single post

  if (error) return console.error(error.message);

  postDetailContainer.innerHTML = `
  <button class="back-btn" onclick="history.back()">← Back</button>
  
  <div class="detail-content card">
    <div class="detail-image">
      ${posts.image_url ? `<img src="${posts.image_url}" alt="Post image">` : `<div class="no-image">No Image</div>`}
    </div>
    <div class="detail-text">
      <div class="user-row mb-3">
        <div class="avatar">
          ${posts.name_of_user?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h6>${posts.name_of_user || "Unknown User"}</h6>
          <small>${new Date(posts.created_at).toLocaleString()}</small>
        </div>
      </div>

      <h2>${posts.title}</h2>
      <p class="detail-description">${posts.description}</p>
    </div>
  </div>
`;

}

renderPostDetail();

// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", async () => {
  const { error } = await client.auth.signOut();

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  Swal.fire({
    title: "Logged out",
    icon: "success",
    timer: 1200,
    showConfirmButton: false,
  });

  setTimeout(() => {
    window.location = "index.html";
  }, 1200);
});
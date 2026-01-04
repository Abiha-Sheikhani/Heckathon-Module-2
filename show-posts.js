import client from "./config.js";

const postsContainer = document.getElementById("postsContainer");

async function renderPosts() {
  const { data: posts, error } = await client.from("posts").select("*");

  if (error) return console.error(error.message);

  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.className = "card mb-4";

    postEl.innerHTML = `
      <div class="card-body">
        <div class="user-row mb-3">
          <div class="avatar">
            ${post.name_of_user?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h6>${post.name_of_user || "Unknown User"}</h6>
            <small>${new Date(post.created_at).toLocaleString()}</small>
          </div>
        </div>

        <h3>${post.title}</h3>
        <p class="card-text">${post.description.substring(0, 120)}...</p>

        ${post.image_url ? `<img src="${post.image_url}" alt="Post image">` : ""}

        <a href="post-detail.html?id=${post.id}" class="read-more">Read More</a>
      </div>
    `;

    postsContainer.appendChild(postEl);
  });
}

renderPosts();

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

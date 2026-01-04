import client from "./config.js";
//  ////////////////////show cards of only authen user
const postsContainer = document.getElementById("postsContainer");
    const { data: { user }, error } = await client.auth.getUser();
async function loadMyPosts(uid) {
    postsContainer.innerHTML = "";

    const { data: posts, error } = await client
        .from("posts")
        .select("*")
        .eq("uid", uid)
        .order("created_at", { ascending: false });

    if (error) {
        postsContainer.innerHTML = "Error loading posts";
        return;
    }

    if (posts.length === 0) {
        postsContainer.innerHTML = "<small>No posts yet</small>";
        return;
    }

    posts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.className = "card mb-4";

        postEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <div class="avatar">
            ${post.name_of_user?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h6 class="mb-0">${post.name_of_user || "Unknown User"}</h6>
            <small>${new Date(post.created_at).toLocaleString()}</small>
          </div>
        </div>

        <h3>${post.title}</h3>
        <p class="card-text">${post.description}</p>

        ${post.image_url ? `<img src="${post.image_url}" alt="Post image">` : ""}
          <div class="d-flex gap-2 mt-2">
        <button class="btn btn-sm btn-outline-warning edit-post" data-id="${post.id}">
          Edit
        </button>
        <button class="btn btn-sm btn-outline-danger delete-post" data-id="${post.id}">
          Delete
        </button>
      </div>
      </div>
    
    `;

        postsContainer.appendChild(postEl);
    });
}

async function init() {

    if (error) return console.error(error.message);

    if (!user) {
          setTimeout(()=>{
     window.location = "index.html"
        },2000);
        return;
    }

    await loadMyPosts(user.id);
}

init();




// /////////////deletee post functionalityyyyyy

postsContainer.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-post")) return;

  const postId = e.target.dataset.id;

  const result = await Swal.fire({
    title: "Delete post?",
    text: "This cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  });

  if (!result.isConfirmed) return;

  const { error } = await client
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  Swal.fire("Deleted", "Post removed", "success");

  // reload posts
  const { data: { user } } = await client.auth.getUser();
  loadMyPosts(user.id);
});



// /////////////editt posttttt functionalityyyyyyyyyyyyyy


let editingPostId = null;
let oldImageUrl = "";

// Event delegation for edit buttons
postsContainer.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("edit-post")) return;

  editingPostId = e.target.dataset.id;

  // Fetch current post data
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("id", editingPostId)
    .single();

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  // Fill modal form
  document.getElementById("editTitle").value = data.title;
  document.getElementById("editDescription").value = data.description;
  oldImageUrl = data.image_url || "";

  const preview = document.getElementById("editPreview");
  if (oldImageUrl) {
    preview.src = oldImageUrl;
    preview.classList.remove("d-none");
  } else {
    preview.classList.add("d-none");
  }

  // Show modal
  const editModal = new bootstrap.Modal(document.getElementById("editPostModal"));
  editModal.show();
});

// Optional: Image preview if you allow file input
document.getElementById("editImage")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const preview = document.getElementById("editPreview");
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("d-none");
});

// Save edit
document.getElementById("editPostForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("editTitle").value.trim();
  const desc = document.getElementById("editDescription").value.trim();
  const imageFile = document.getElementById("editImage")?.files[0];

  if (!title || !desc) {
    Swal.fire("Error", "Title and description are required", "error");
    return;
  }

  let imageUrl = oldImageUrl;

  // Upload new image if selected
  if (imageFile) {
    const fileName = `${Date.now()}_${imageFile.name}`;

    const { error: uploadError } = await client.storage
      .from("posts-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      Swal.fire("Error", uploadError.message, "error");
      return;
    }

    const { data } = client.storage
      .from("posts-images")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  // Update post
  const { error } = await client
    .from("posts")
    .update({ title, description: desc, image_url: imageUrl })
    .eq("id", editingPostId);

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  Swal.fire("Updated", "Post updated successfully", "success");

  // Reload posts
  const { data: { user } } = await client.auth.getUser();
  loadMyPosts(user.id);

  // Hide modal
  const modalInstance = bootstrap.Modal.getInstance(document.getElementById("editPostModal"));
  if (modalInstance) modalInstance.hide();
});


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
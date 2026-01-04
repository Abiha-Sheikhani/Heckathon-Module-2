import client from "./config.js";


const postBtn = document.getElementById("postBtn");
const postTitle = document.getElementById("postTitle");
const postDesc = document.getElementById("postDesc");
const postImage = document.getElementById("postImage");

// Fetch posts on load
// window.addEventListener("DOMContentLoaded", fetchPosts);

// Check authentication
let currentUser = null;
async function checkAuth() {
  const { data: { user } } = await client.auth.getUser();
  console.log(user?.user_metadata?.username);
  
  if (!user) {
    window.location = "index.html";
  }
  
  currentUser = user;
  return user;
}



// Add Post
postBtn.addEventListener("click", async () => {
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    window.location = "index.html";
    return;
  }

  const title = postTitle.value.trim();
  const desc = postDesc.value.trim();
  const imageFile = postImage.files[0];

  if (!title || !desc) {
    Swal.fire("Error", "Title and description required!", "error");
    return;
  }

  let imageUrl = null;

  // Upload image if exists
  if (imageFile) {
    const fileName = `${Date.now()}_${imageFile.name.replace(/\s/g, "_")}`;
    const { data, error: uploadError } = await client.storage
      .from("posts-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      Swal.fire("Error", uploadError.message, "error");
      return;
    }

    const { data: urlData } = client.storage.from("posts-images").getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  // Insert post
  const { data: postData, error: insertError } = await client
    .from("posts")
    .insert([{ 
      title, 
      description: desc, 
      image_url: imageUrl, 
      uid: user.id, 
      name_of_user: user?.user_metadata?.username || user.email 
    }]);

  if (insertError) {
    Swal.fire("Error", insertError.message, "error");
    return;
  }

  Swal.fire("Success", "Post created!", "success");

  // Clear form
  postTitle.value = "";
  postDesc.value = "";
  postImage.value = "";

   setTimeout(()=>{
     window.location = "All-posts.html"
        },2000)


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
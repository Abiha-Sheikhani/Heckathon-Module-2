import client from "./config.js";

// /////////////////designing codeeeee
const signinBtn = document.getElementById("signinBtn");
const signupBtn = document.getElementById("signupBtn");

const forms = document.querySelector(".login-2 .forms");
const hero = document.querySelector(".login-2 .card-hero-inner");
const activeBar = document.querySelector(".login-2 .active-bar");

function showSignin() {
  forms.style.top = "0";
  hero.style.top = "0";
  activeBar.style.top = "33.33%";

  signinBtn.classList.add("active");
  signupBtn.classList.remove("active");
}

function showSignup() {
  forms.style.top = "-100%";
  hero.style.top = "-100%";
  activeBar.style.top = "66.66%";

  signupBtn.classList.add("active");
  signinBtn.classList.remove("active");
}

signinBtn.addEventListener("click", showSignin);
signupBtn.addEventListener("click", showSignup);


// ////////////////Auth codeeeee



// designinggggg codeeeeeeeeeee
 const signinForm = document.querySelector(".form.signin");
const signupForm = document.querySelector(".form.signup");
const cardBg1 = document.querySelector(".card-bg-1");
const cardBg2 = document.querySelector(".card-bg-2");

const toggleView = () => {
  const signinActive = signinForm.classList.contains("active");

  signinForm.classList.toggle("active", !signinActive);
  signupForm.classList.toggle("active", signinActive);

  [cardBg1, cardBg2].forEach((el) =>
    el.classList.toggle("signin", signinActive)
  );
  [cardBg1, cardBg2].forEach((el) =>
    el.classList.toggle("signup", !signinActive)
  );
};


// sign up codee --------------------------------

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");

btn &&
  btn.addEventListener("click", async () => {
    try {
      if (!username.value || !email.value || !password.value) {
   Swal.fire({
        title: `please enter all fields!`,
        icon: "error",
        timer: 2000,
      });
        return;
      }

      const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          data: {
            username: username.value,
          },
        },
      });

      if (error) {
        console.error(error.message);
        Swal.fire({
        title: `${error.message}`,
        icon: "error",
        timer: 2000,
      });
        return;
      }
else{
  console.log(data);
  
   console.log(data.user.user_metadata.sub);

      Swal.fire({
        title: "Successfully Signed Up!\nRedirecting to Login Page",
        icon: "success",
        timer: 2000,
      });
      const { data: postData, error: insertError } = await client
    .from("users-data")
    .insert([{ name: username.value, email : email.value , role: "user", uid:data.user.user_metadata.sub }]);

  if (insertError) {
    Swal.fire("Error", insertError.message, "error");
    return;
  }
     setTimeout(() => {
  showSignin()
  
}, 2000);
username.value = ""
email.value = ""
password.value = ""
}
     
    } catch (err) {
      console.error(err);
    }
  });

//loginn functionalityyy

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
console.log(loginEmail,loginPassword);

loginBtn &&
  loginBtn.addEventListener("click", async () => {
    try {
      if (!loginEmail.value || !loginPassword.value) {
        alert("Please enter all fields!");
        return; // Stop further execution
      }

      const { data, error } = await client.auth.signInWithPassword({
        email: loginEmail.value,
        password: loginPassword.value,
      });

      if (error) {
        alert("Login failed!");
        console.log(error.message);
        return;
      }
 else {
        Swal.fire({
          title: "Successfully Logged in!\nRedirecting to post Page",
          icon: "success",
          draggable: true,
          timer: 2000,
        });
        loginEmail.value = ""
        loginPassword.value = ""
        setTimeout(()=>{
     window.location = "user.html"
        },2000)

     console.log(data);
     
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });

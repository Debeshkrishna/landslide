// 🔥 Firebase Configuration
var firebaseConfig = {apiKey: "AIzaSyBdobZkxGjd2jxKX9R_fc3uw8AU6Hknk10",
  authDomain: "landslide-6e594.firebaseapp.com",
  databaseURL: "https://landslide-6e594-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "landslide-6e594",
  storageBucket: "landslide-6e594.firebasestorage.app",
  messagingSenderId: "239694825638",
  appId: "1:239694825638:web:fc02999b4ce51b26a8cc67",
  measurementId: "G-BFVLY7FGE7"
};

// Initialize Firebase (keep config unchanged)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// --- LOGIN ---
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html"; // redirect to dashboard
    })
    .catch(err => {
      if (errorDiv) errorDiv.textContent = err.message;
    });
};

// --- SIGNUP ---
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error");

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => {
      if (errorDiv) errorDiv.textContent = err.message;
    });
};

// --- TOGGLE LOGIN/SIGNUP ---
window.toggleForm = function () {
  const formTitle = document.getElementById("form-title");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const toggleLink = document.querySelector(".toggle-link");

  if (formTitle.textContent === "Login") {
    formTitle.textContent = "Sign Up";
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "block";
    if (toggleLink) toggleLink.textContent = "Already have an account? Login";
  } else {
    formTitle.textContent = "Login";
    if (loginBtn) loginBtn.style.display = "block";
    if (signupBtn) signupBtn.style.display = "none";
    if (toggleLink) toggleLink.textContent = "Don't have an account? Sign up";
  }
};

// --- LOGOUT ---
window.logout = function () {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
};

// --- RESET PASSWORD ---
window.resetPassword = function () {
  const email = document.getElementById("email").value;
  const errorDiv = document.getElementById("error");

  if (!email) {
    if (errorDiv) errorDiv.textContent = "Please enter your email to reset password.";
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent! Check your inbox.");
    })
    .catch(err => {
      if (errorDiv) errorDiv.textContent = err.message;
    });
};

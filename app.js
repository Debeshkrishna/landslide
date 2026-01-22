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

firebase.initializeApp(firebaseConfig);
// Initialize Firebase 
firebase.initializeApp(firebaseConfig);
 const auth = firebase.auth(); 
// Login 
function login() { const email = document.getElementById("email").value; 
const password = document.getElementById("password").value; 
auth.signInWithEmailAndPassword(email, password) .then(() => window.location.href = "index.html") .catch(err => document.getElementById("error").textContent = err.message); } 
// Signup 
function signup() { const email = document.getElementById("email").value; const password = document.getElementById("password").value; auth.createUserWithEmailAndPassword(email, password) .then(() => window.location.href = "index.html") .catch(err => document.getElementById("error").textContent = err.message); } 
// Toggle login/signup 
function toggleForm() { const formTitle = document.getElementById("form-title"); 
const loginBtn = document.getElementById("login-btn"); 
const signupBtn = document.getElementById("signup-btn"); 
const toggleLink = document.querySelector(".toggle-link"); 
if (formTitle.textContent === "Login") { formTitle.textContent = "Sign Up"; 
loginBtn.style.display = "none"; signupBtn.style.display = "block"; 
toggleLink.textContent = "Already have an account? Login"; } else { formTitle.textContent = "Login"; loginBtn.style.display = "block"; signupBtn.style.display = "none"; toggleLink.textContent = "Don't have an account? Sign up"; } } // Logout function logout() { auth.signOut().then(() => { window.location.href = "login.html"; }); } // Reset Password function resetPassword() { const email = document.getElementById("email").value; const errorDiv = document.getElementById("error"); if (!email) { errorDiv.textContent = "Please enter your email to reset password."; return; } auth.sendPasswordResetEmail(email) .then(() => { alert("Password reset email sent! Check your inbox."); }) .catch(err => { errorDiv.textContent = err.message; }); }

var database = firebase.database();
var landslideRef = database.ref("Landslide");

// HTML Elements
const rainEl = document.getElementById("rain");
const rainHeightEl = document.getElementById("rainHeight");
const soilEl = document.getElementById("soil");
const statusEl = document.getElementById("status");
const statusCard = document.getElementById("statusCard");
const alertSound = document.getElementById("alertSound");

// Prevent repeated sound
let lastStatus = "";

// Graph Data
let timeLabels = [];
let rainHeightData = [];
let rainSensorData = [];

// Charts
const rainHeightChart = new Chart(
  document.getElementById("rainHeightChart"), {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [{
        label: "Rainfall Height (cm)",
        data: rainHeightData,
        borderColor: "blue",
        fill: false
      }]
    }
});

const rainSensorChart = new Chart(
  document.getElementById("rainSensorChart"), {
    type: "line",
    data: {
      labels: timeLabels,
      datasets: [{
        label: "Rain Sensor Value",
        data: rainSensorData,
        borderColor: "green",
        fill: false
      }]
    }
});

// Realtime Listener
landslideRef.on("value", function(snapshot) {

  let data = snapshot.val();
  if (!data) return;

  rainEl.innerHTML = data.RainSensor;
  rainHeightEl.innerHTML = data.RainfallHeight_cm + " cm";
  soilEl.innerHTML = data.SoilMoisture == 0 ? "WET" : "DRY";
  statusEl.innerHTML = data.Status;

  statusCard.className = "status-card";

  // Status logic + sound
  if (data.Status === "SAFE") {
    statusCard.classList.add("safe");
  }

  if (data.Status === "WARNING") {
    statusCard.classList.add("warning");
  }

  if (data.Status === "DANGER") {
    statusCard.classList.add("danger");

    if (lastStatus !== "DANGER") {
      alertSound.play();   // 🔔 PLAY SOUND
    }
  }

  lastStatus = data.Status;

  // Graph update
  let time = new Date().toLocaleTimeString();

  if (timeLabels.length > 10) {
    timeLabels.shift();
    rainHeightData.shift();
    rainSensorData.shift();
  }

  timeLabels.push(time);
  rainHeightData.push(data.RainfallHeight_cm);
  rainSensorData.push(data.RainSensor);

  rainHeightChart.update();
  rainSensorChart.update();
});
  const auth = firebase.auth(); const db = firebase.database(); 
// Auth state check
auth.onAuthStateChanged(user => { const dashboard = document.getElementById("dashboard"); const loading = document.getElementById("loading"); if (user) { if (loading) loading.style.display = "none"; if (dashboard) dashboard.style.display = "flex"; } else { if (window.location.pathname.includes("index.html")) { window.location.href = "login.html"; } } }); 
// Login 
function login() { const email = document.getElementById("email").value; const password = document.getElementById("password").value; auth.signInWithEmailAndPassword(email, password) .then(() => window.location.href = "index.html") .catch(err => document.getElementById("error").textContent = err.message); } 
// Signup 
function signup() { const email = document.getElementById("email").value; const password = document.getElementById("password").value; auth.createUserWithEmailAndPassword(email, password) .then(() => window.location.href = "index.html") .catch(err => document.getElementById("error").textContent = err.message); } 
// Toggle login/signup 
function toggleForm() { const formTitle = document.getElementById("form-title"); const loginBtn = document.getElementById("login-btn"); const signupBtn = document.getElementById("signup-btn"); const toggleLink = document.querySelector(".toggle-link"); if (formTitle.textContent === "Login") { formTitle.textContent = "Sign Up"; loginBtn.style.display = "none"; signupBtn.style.display = "block"; toggleLink.textContent = "Already have an account? Login"; } else { formTitle.textContent = "Login"; loginBtn.style.display = "block"; signupBtn.style.display = "none"; toggleLink.textContent = "Don't have an account? Sign up"; } } 
// Logout 
function logout() { auth.signOut().then(() => { window.location.href = "login.html"; }); } 
// Chart (only on dashboard) 
if (document.getElementById("myChart")) { var ctx = document.getElementById('myChart').getContext('2d'); var myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [{ label: 'Sensor Value', data: [], borderColor: 'black', fill: false }] }, options: { responsive: true, animation: false } }); db.ref("sensorData").on("value", snapshot => { const data = snapshot.val(); const value = data.value; myChart.data.labels.push(new Date().toLocaleTimeString()); myChart.data.datasets[0].data.push(value); myChart.update(); }); }

 


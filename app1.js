// Firebase Config
var firebaseConfig = {
  apiKey: "AIzaSyBdobZkxGjd2jxKX9R_fc3uw8AU6Hknk10",
  authDomain: "landslide-6e594.firebaseapp.com",
  databaseURL: "https://landslide-6e594-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "landslide-6e594",
  storageBucket: "landslide-6e594.firebasestorage.app",
  messagingSenderId: "239694825638",
  appId: "1:239694825638:web:fc02999b4ce51b26a8cc67",
  measurementId: "G-BFVLY7FGE7"
};
firebase.initializeApp(firebaseConfig);

// Chart Setup
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sensor Value',
      data: [],
      borderColor: 'black',
      fill: false
    }]
  },
  options: {
    responsive: true,
    animation: false
  }
});

// Dynamic Background Plugin (Chart.js v3+ compatible)
const dynamicBackgroundPlugin = {
  id: 'dynamicBackground',
  beforeDraw(chart) {
    const ctx = chart.ctx;
    const dataset = chart.data && chart.data.datasets && chart.data.datasets[0];
    const data = dataset ? dataset.data : [];
    const latestValue = (data && data.length) ? data[data.length - 1] : null;

    let bgColor = "#ffffff";
    const alertBox = document.getElementById("alertBox");
    if (latestValue === null || typeof latestValue === 'undefined') {
      bgColor = "#ffffff";
      if (alertBox) {
        alertBox.className = "alert-log";
        alertBox.innerText = "";
      }
    } else if (latestValue < 50) {
      bgColor = "#00ff00"; // Safe
      if (alertBox) {
        alertBox.className = "alert-log alert-safe";
        alertBox.innerText = "✅ Safe Condition";
      }
    } else if (latestValue >= 50 && latestValue < 80) {
      bgColor = "#ffff00"; // Alert
      if (alertBox) {
        alertBox.className = "alert-log alert-warning";
        alertBox.innerText = "⚠️ Alert Condition";
      }
    } else if (latestValue >= 80) {
      bgColor = "#ff0000"; // Danger
      if (alertBox) {
        alertBox.className = "alert-log alert-danger";
        alertBox.innerText = "🚨 Danger Condition";
      }
    }

    // draw background without disturbing chart state
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};
Chart.register(dynamicBackgroundPlugin);

// Realtime Firebase Listener
firebase.database().ref("sensorData").on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data || typeof data.value === 'undefined' || data.value === null) {
    // no valid data yet
    return;
  }
  const value = data.value;

  myChart.data.labels.push(new Date().toLocaleTimeString());
  myChart.data.datasets[0].data.push(value);
  myChart.update();

  // Push alerts without login
  if (value >= 80) {
    sendDangerAlert(value);
  } else if (value >= 50) {
    sendWarningAlert(value);
  }
});

// Push Alerts (example console log)
function sendDangerAlert(value) {
  console.log("🚨 Danger Alert! Value:", value);
}
function sendWarningAlert(value) {
  console.log("⚠️ Warning Alert! Value:", value);
}

// Admin Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      document.querySelector(".topbar").style.display = "flex";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
    document.querySelector(".topbar").style.display = "none";
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("dashboard").style.display = "block";
    document.querySelector(".topbar").style.display = "flex";
  } else {
    document.getElementById("dashboard").style.display = "none";
    document.querySelector(".topbar").style.display = "none";
  }
});
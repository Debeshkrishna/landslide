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

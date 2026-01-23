
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

    // Dynamic Background Plugin
    Chart.plugins.register({
      beforeDraw: function(chart) {
        const ctx = chart.ctx;
        let latestValue = chart.data.datasets[0].data.slice(-1)[0];
        let bgColor = "#ffffff";

        if (latestValue < 50) {
          bgColor = "#00ff00"; // Safe
          document.getElementById("alertBox").className = "alert-log alert-safe";
          document.getElementById("alertBox").innerText = "✅ Safe Condition";
        } else if (latestValue >= 50 && latestValue < 80) {
          bgColor = "#ffff00"; // Alert
          document.getElementById("alertBox").className = "alert-log alert-warning";
          document.getElementById("alertBox").innerText = "⚠️ Alert Condition";
        } else if (latestValue >= 80) {
          bgColor = "#ff0000"; // Danger
          document.getElementById("alertBox").className = "alert-log alert-danger";
          document.getElementById("alertBox").innerText = "🚨 Danger Condition";
        }

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, chart.width, chart.height);
      }
    });

    // Realtime Firebase Listener
    firebase.database().ref("sensorData").on("value", (snapshot) => {
      const data = snapshot.val();
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
  
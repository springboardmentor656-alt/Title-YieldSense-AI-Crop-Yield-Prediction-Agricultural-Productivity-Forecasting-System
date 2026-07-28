// Check Login

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

async function predictYield() {
document.getElementById("loader").style.display = "block";

    const area = document.getElementById("area").value;
        const year = document.getElementById("year").value;
    const temp = document.getElementById("temp").value;
    const rainfall = document.getElementById("rainfall").value;
    const pesticides = document.getElementById("pesticides").value;
    const ph = document.getElementById("ph").value;

    // Crop Type
    const selectedCrop =
        document.getElementById("cropType").value;

    const cropType =
        selectedCrop === "Other"
            ? document.getElementById("otherCrop").value
            : selectedCrop;

    // Validation
    if (
    !area ||
    !year ||
    !cropType ||
    !temp ||
    !rainfall ||
    !pesticides ||
    !ph
){
        alert("⚠ Please fill all fields before prediction.");
        return;
    }

    // Loading State
    document.getElementById("yield").innerHTML = "⏳";
    document.getElementById("weather").innerHTML = "Analyzing...";
    document.getElementById("soil").innerHTML = "Analyzing Soil...";
    document.getElementById("risk").innerHTML = "Calculating...";
    document.getElementById("recommendation").innerHTML =
        "Generating recommendation...";
    document.getElementById("report").innerHTML =
        "Preparing report...";

    document.getElementById("summary").innerHTML =
        "🤖 AI is analyzing crop conditions...";

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/v1/predict-yield",
            {
                method: "POST",
                headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
},
               body: JSON.stringify({

    area: area,

    crop_type: cropType,

    year: parseInt(year),

    average_rain_fall_mm_per_year:
        parseFloat(rainfall),

    pesticides_tonnes:
        parseFloat(pesticides),

    avg_temp:
        parseFloat(temp),

    ph:
        parseFloat(ph)

                })
            }
        );

        const data = await response.json();
        document.getElementById("loader").style.display = "none";
        if (data.risk_level === "High Risk") {

    alert(
        `⚠ High Risk Detected!\n\n` +
        `Estimated Yield: ${data.estimated_yield}\n\n` +
        `Recommendation:\n${data.recommendation}`
    );

} else {

    alert(
        `✅ Prediction Completed Successfully!\n\n` +
        `Crop: ${cropType}\n` +
        `Estimated Yield: ${data.estimated_yield}\n` +
        `Risk Level: ${data.risk_level}`
    );
}

        // Yield
        document.getElementById("yield").innerHTML =
            `🌾 ${data.estimated_yield.toFixed(2)}`;

        // Weather
        const weatherElement =
            document.getElementById("weather");

        weatherElement.innerHTML =
            `☀ ${data.weather_status}`;

        if (data.weather_status === "Optimal") {
            weatherElement.style.color = "#2e7d32";
        } else {
            weatherElement.style.color = "#d32f2f";
        }

        // Soil
        document.getElementById("soil").innerHTML =
            `🌱 ${data.soil_status}`;

        // Risk
        const riskElement =
            document.getElementById("risk");

        riskElement.innerHTML =
            `⚠ ${data.risk_level}`;

        if (data.risk_level === "Low Risk") {
            riskElement.style.color = "#2e7d32";
        }
        else if (data.risk_level === "Medium Risk") {
            riskElement.style.color = "#ff9800";
        }
        else {
            riskElement.style.color = "#d32f2f";
        }

        // Recommendation
        document.getElementById("recommendation").innerHTML =
            `💡 ${data.recommendation}`;

        // Productivity Report
        document.getElementById("report").innerHTML =
            `📈 ${data.productivity_report}`;

        // Crop Advisory (if backend returns it)
        if (data.crop_message) {
            document.getElementById("cropAdvice").innerHTML =
                `🌾 ${data.crop_message}`;
        }

        // AI Summary
        document.getElementById("summary").innerHTML =
            `
            <b>🤖 AI Prediction Summary</b><br><br>

            🌾 Crop:
            <b>${cropType}</b><br><br>

            🌾 Estimated Yield:
            <b>${data.estimated_yield.toFixed(2)}</b><br><br>

            ☀ Weather Status:
            <b>${data.weather_status}</b><br><br>

            🌱 Soil Status:
            <b>${data.soil_status}</b><br><br>

            ⚠ Risk Level:
            <b>${data.risk_level}</b><br><br>

            📈 Productivity:
            <b>${data.productivity_report}</b><br><br>

            💡 Recommendation:<br>
            ${data.recommendation}
            `;
    }
    catch (error) {

        console.error(error);

        document.getElementById("summary").innerHTML =
            "❌ Prediction Failed. Please check FastAPI server.";

        alert("Prediction failed! Check backend connection.");
    }
}

function toggleOtherCrop() {

    const cropSelect =
        document.getElementById("cropType");

    const otherCrop =
        document.getElementById("otherCrop");

    if (cropSelect.value === "Other") {
        otherCrop.style.display = "block";
    }
    else {
        otherCrop.style.display = "none";
        otherCrop.value = "";
    }
}
// Display Logged-in User

const username = localStorage.getItem("name");

document.getElementById("username").innerText =
    "👤 " + username;


// Logout

function logout(){

    localStorage.clear();

    window.location.href="login.html";

}
// Welcome Card

const name = localStorage.getItem("name");

const role = localStorage.getItem("role");

document.getElementById("welcomeMessage").innerHTML =
    "Welcome Back, " + name + " 👋";

document.getElementById("welcomeRole").innerHTML =
    "Role : " + role;

 // ---------------- Dashboard Statistics ----------------

async function loadDashboardStats() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/v1/dashboard-stats"
        );

        const data = await response.json();

        document.getElementById("totalPredictions").innerHTML =
            data.total_predictions;

        document.getElementById("averageYield").innerHTML =
            data.average_yield.toFixed(2);

        document.getElementById("bestCrop").innerHTML =
            data.best_crop;

        document.getElementById("currentRisk").innerHTML =
            data.current_risk;

    }
    catch(error){

        console.log(error);

    }

}

loadDashboardStats();

// ---------------- Live Yield Chart ----------------

async function loadYieldChart() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/v1/predictions"
        );

        const predictions = await response.json();

        const crops = predictions.map(p => p.crop);

        const yields = predictions.map(p => p.estimated_yield);

        const ctx = document
            .getElementById("yieldChart")
            .getContext("2d");

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: crops,

                datasets: [{

                    label: "Estimated Yield",

                    data: yields,

                    borderWidth: 1

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: true

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

    }

    catch(error){

        console.log(error);

    }

}

loadYieldChart();
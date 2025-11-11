🌾 CropIQ — Smart Farming with Intelligence

CropIQ (AgriYield) is a lightweight, production-ready smart farming demo that leverages historical field data, soil and weather features, and machine learning to provide crop yield predictions, trend analytics, and optimization recommendations for irrigation and fertilization.

🚀 Overview

CropIQ empowers farmers, agri-advisors, and policy planners with data-driven insights to optimize crop selection, improve yield, and boost profitability — while ensuring sustainable resource management.

🎯 Mission

Empower farmers and agri-advisors with actionable, data-driven insights to optimize crop selection, improve yield, and boost profitability — all while promoting sustainable resource use.

🌍 Vision

Build an accessible AI platform that delivers region-specific recommendations — from district-level trends to field-scale irrigation and fertilizer suggestions.

⚙️ How It Works
1️⃣ Data Ingestion

Collects historical production, soil test results (pH, N-P-K), weather data (temperature, rainfall), and farmer inputs.

2️⃣ Feature Engineering

Computes area-normalized yields, seasonal indicators, and district-level aggregates to capture spatial and temporal trends.

3️⃣ Modeling

Trains machine learning models (Tree-based Regressors / Linear Models) to predict:

Yield (t/ha)

Profitability

1–5 year yield forecasts using time-series trends.

4️⃣ Dashboard & API

Frontend communicates with:

/api/summary → Summary analytics

/predict → Yield prediction

/api/download_report → Generate downloadable PDF reports

<img width="829" height="742" alt="image" src="https://github.com/user-attachments/assets/633336aa-762a-452c-bfa4-dabda384cc70" />

Visualizes insights with Chart.js and Matplotlib.

5️⃣ Optimization

Provides rule-based and data-driven recommendations:

Fertilizer mixes

Irrigation schedules

Profitability scoring
<img width="851" height="724" alt="image" src="https://github.com/user-attachments/assets/df50eb8d-6ad3-468f-8d09-95e150b56f73" />

Scenario comparisons

🌾 Supported Crops

✅ Paddy
✅ Wheat
✅ Maize
✅ Pulses

Easily extendable to other crops with minimal retraining or configuration changes.

📊 Dashboard Highlights

District Analytics: Regional yield and performance metrics

Historical Trends: Seasonal and year-over-year insights

Risk Indicators: Alerts for low rainfall, soil imbalance, or yield drop

Optimization Panel: Scenario-based profitability and resource planning

⚡ Technical Stack
Layer	Technologies
Backend	Python (Flask) REST API
ML/Modeling	Scikit-learn, Pandas, Joblib
Frontend	Chart.js, HTML/CSS/JS
Reports	ReportLab, Matplotlib
Deployment	Docker, Docker Compose
Database (optional)	CSV / SQLite / PostgreSQL
🧠 Example API Endpoints
Endpoint	Description
/api/summary	Returns aggregated field & district statistics
/predict	Predicts yield and profitability for selected crop
/api/download_report	Generates and downloads PDF report
🧩 Features Summary

🌾 Multi-crop support

📊 Interactive analytics dashboard

💧 Irrigation and fertilizer optimization

💰 Profitability and yield forecasting

🧠 ML-driven insights

📈 Scenario comparison for decision support

🧑‍💻 Team

Developed by:
Pratik Kumar — IBM Certified in AI & ML
Data Analyst • Frontend & Backend Developer • AgriTech Enthusiast

📬 Contact

For dataset integration, model retraining, or SIH presentation materials (PPT/screenshots), please contact:

📧 Email: pratikagarwal298@gmail.com

🐳 Deployment (Docker)


# Build and run
docker-compose up --build


App will be available at http://localhost:5000

🧾 License

This project is released under the MIT License — free for research, education, and non-commercial use.

🌱 “Smarter Farms. Better Yields. Sustainable Future.”

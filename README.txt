AgriYield FullStack Demo (SIH-ready)
-----------------------------------
What you have:
- backend/: Flask app (app.py), trained RandomForest model (model.pkl), features.json, data.csv (synthetic)
- frontend/: Static website (index.html, predict.html, optimize.html, dashboard.html)

How to run locally:
1. Create virtualenv & install requirements:
   python3 -m venv venv
   source venv/bin/activate
   pip install flask scikit-learn pandas joblib

2. Start backend (serves frontend and API):
   cd backend
   python app.py
   -> Open http://127.0.0.1:5000 in browser

Notes:
- The demo uses a synthetic dataset. Replace backend/data/data.csv with real dataset (columns: crop,season,area,ph,n,p,k,temp,rain,yield)
- To retrain model: run train script (not included to keep zip small) or re-run training in this environment.

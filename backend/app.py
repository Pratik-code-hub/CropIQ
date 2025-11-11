from flask import Flask, request, jsonify, send_from_directory
from pathlib import Path
import pandas as pd, numpy as np, json, random
from datetime import datetime, timedelta

BASE = Path(__file__).resolve().parent
DATA_CSV = BASE / "data" / "data.csv"

# load dataset
df = pd.read_csv(DATA_CSV)

app = Flask(__name__, static_folder="../frontend", static_url_path="")


def compute_dashboard(mandi_price=8000):
    avg_yield = float(df['yield'].mean().round(3))
    median_profit = int(np.median(df['yield'] * mandi_price))
    # district or crop averages
    if 'district' in df.columns:
        district_avg = df.groupby('district')['yield'].mean().round(3).to_dict()
    else:
        district_avg = df.groupby('crop')['yield'].mean().round(3).to_dict()
    # rainfall adequacy per season
    def rain_ok(row):
        season = row.get('season', 'unknown')
        med = df[df['season']==season]['rain'].median()
        return row['rain'] >= med if not np.isnan(med) else True
    rain_ok_series = df.apply(rain_ok, axis=1)
    rain_adequacy_pct = int((rain_ok_series.sum() / len(rain_ok_series)) * 100)
    # risk buckets
    p33 = np.percentile(df['yield'], 33)
    p66 = np.percentile(df['yield'], 66)
    def bucket(y):
        if y <= p33: return 'Low'
        if y <= p66: return 'Medium'
        return 'High'
    buckets = df['yield'].apply(bucket)
    risk_share = (buckets.value_counts(normalize=True) * 100).round(1).to_dict()
    # dynamic alerts derived from extremes
    alerts = []
    now = datetime.now()
    for _, r in df.iterrows():
        if r['rain'] > 250:
            alerts.append({'date': (now - timedelta(days=random.randint(1,10))).strftime('%Y-%m-%d'),
                           'loc': r.get('district', r.get('crop','Unknown')),
                           'type': 'Heavy Rain Warning',
                           'msg': f"High rainfall ({r['rain']} mm) - risk of waterlogging."})
        if r['rain'] < 20:
            alerts.append({'date': (now - timedelta(days=random.randint(1,10))).strftime('%Y-%m-%d'),
                           'loc': r.get('district', r.get('crop','Unknown')),
                           'type': 'Low Rain Alert',
                           'msg': f"Low rainfall ({r['rain']} mm) - consider irrigation."})
        if r.get('temp',0) > 35:
            alerts.append({'date': (now - timedelta(days=random.randint(1,7))).strftime('%Y-%m-%d'),
                           'loc': r.get('district', r.get('crop','Unknown')),
                           'type': 'Heat Spike',
                           'msg': f"High temp ({r['temp']} °C) - possible heat stress."})
    # dedupe and limit
    seen = set(); unique = []
    for a in alerts:
        if a['msg'] not in seen:
            unique.append(a); seen.add(a['msg'])
        if len(unique) >= 10: break
    return {
        "avg_yield_t_per_ha": avg_yield,
        "median_profit_inr": median_profit,
        "district_avg_yields": district_avg,
        "rainfall_adequacy_pct": rain_adequacy_pct,
        "risk_share_pct": risk_share,
        "alerts": unique
    }


def compute_history(top_n=6):
    # group by crop+season, collect yields as a series (sample-based)
    grouped = df.groupby(['crop','season'])['yield'].apply(list).reset_index(name='yields')
    grouped['count'] = grouped['yields'].apply(len)
    grouped = grouped.sort_values('count', ascending=False).head(top_n)
    history = {}
    for _, row in grouped.iterrows():
        key = f"{row['crop']} ({row['season']})"
        series = row['yields']
        # pad or trim to length 8 (for nicer chart)
        if len(series) < 8:
            series = series + [series[-1]]*(8-len(series))
        else:
            series = series[:8]
        history[key] = [float(round(x,3)) for x in series]
    return history


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json or {}
    # Use a simple fallback model: mean yield for crop+season, else overall mean
    crop = (data.get('crop') or '').strip().lower()
    season = (data.get('season') or '').strip().lower()
    area = float(data.get('area') or 1.0)
    # try exact match in dataset (case-insensitive)
    df_copy = df.copy()
    df_copy['crop_l'] = df_copy['crop'].astype(str).str.lower()
    df_copy['season_l'] = df_copy['season'].astype(str).str.lower()
    mask = (df_copy['crop_l']==crop) & (df_copy['season_l']==season)
    if mask.sum() > 0:
        pred = float(df_copy[mask]['yield'].mean())
    else:
        # try crop only
        mask2 = (df_copy['crop_l']==crop)
        if mask2.sum() > 0:
            pred = float(df_copy[mask2]['yield'].mean())
        else:
            pred = float(df['yield'].mean())
    # optionally adjust slightly based on inputs (simple heuristic)
    try:
        ph = float(data.get('ph', np.nan))
        if not np.isnan(ph):
            # prefer ph around 6.5-7; penalize if very low/high
            if ph < 5.5: pred *= 0.92
            elif ph > 8: pred *= 0.94
    except:
        pass
    pred = round(pred,3)
    total = round(pred * area,3)
    return jsonify({"predicted_yield_t_per_ha": pred, "predicted_total_tons": total})


@app.route('/dashboard', methods=['GET'])
def dashboard():
    mandi_price = int(request.args.get('mandi_price', 8000))
    data = compute_dashboard(mandi_price=mandi_price)
    return jsonify(data)


@app.route('/history', methods=['GET'])
def history():
    top = int(request.args.get('top', 6))
    data = compute_history(top_n=top)
    return jsonify(data)


# serve frontend static files
@app.route('/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)



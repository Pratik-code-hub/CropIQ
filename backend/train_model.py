import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
import joblib
from pathlib import Path

# Paths
BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "data" / "data.csv"

# Load dataset
df = pd.read_csv(DATA_PATH)

print("📊 Dataset loaded with shape:", df.shape)

# Ensure target column is named "yield"
if "yield" not in df.columns:
    raise ValueError("❌ Your dataset must contain a column named 'yield'")

# Separate features and target
X = df.drop("yield", axis=1)
y = df["yield"]

# 🔹 Convert categorical (string) columns to numbers
X = pd.get_dummies(X, drop_first=True)

print("✅ Features after encoding:", X.columns.tolist())

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = DecisionTreeRegressor(random_state=42)
model.fit(X_train, y_train)

# Save model + feature list
joblib.dump(model, BASE / "model.pkl")
X.columns.to_series().to_json(BASE / "features.json")

print("✅ Model trained and saved as model.pkl")
print("📂 Features saved in features.json")

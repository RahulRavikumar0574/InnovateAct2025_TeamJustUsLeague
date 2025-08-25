# backend/server.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

latest_data = {"status": "waiting", "temperature": 0, "humidity": 0}
sos_status = False

@app.route("/data", methods=["POST"])
def receive_data():
    global latest_data
    latest_data = request.json
    print("📡 Data received:", latest_data)
    return jsonify({"message": "Data received"}), 200

@app.route("/latest", methods=["GET"])
def get_latest_data():
    return jsonify(latest_data)

@app.route("/sos", methods=["GET"])
def get_sos():
    return jsonify({"sos": sos_status})

@app.route("/sos/activate", methods=["POST"])
def activate_sos():
    global sos_status
    sos_status = True
    print("🚨 SOS Activated manually!")
    return jsonify({"message": "SOS Activated"})

@app.route("/sos/deactivate", methods=["POST"])
def deactivate_sos():
    global sos_status
    sos_status = False
    print("✅ SOS Deactivated manually!")
    return jsonify({"message": "SOS Deactivated"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

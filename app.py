from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = Flask(__name__)
CORS(app)

# In-memory expense data
expenses = []

# Prometheus request counter
request_counter = Counter(
    "expense_tracker_requests_total",
    "Total number of requests"
)


# Frontend
@app.route("/")
def home():
    return render_template("index.html")


# GET /items - View expenses
@app.route("/items", methods=["GET"])
def get_items():
    return jsonify(expenses)


# POST /items - Add an expense
@app.route("/items", methods=["POST"])
def add_item():
    data = request.get_json()

    if not data or "name" not in data or "amount" not in data:
        return jsonify({
            "error": "name and amount are required"
        }), 400

    expense = {
        "name": data["name"],
        "amount": data["amount"]
    }

    expenses.append(expense)

    return jsonify(expense), 201


# GET /health - Backend health check
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "OK"
    })


# Prometheus metrics
@app.route("/metrics", methods=["GET"])
def metrics():
    request_counter.inc()
    return generate_latest(), 200, {
        "Content-Type": CONTENT_TYPE_LATEST
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
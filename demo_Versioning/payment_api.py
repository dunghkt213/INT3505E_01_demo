from flask import Flask, request, jsonify

app = Flask(__name__)


# Version 1: Chỉ hỗ trợ 1 order
def process_payment_v1(data):
    return {
        "api_version": "v1",
        "orderId": data.get("orderId"),
        "paymentMethod": data.get("paymentMethod", "COD"),
        "total": data.get("total", 0),
        "message": "Payment processed for a single order."
    }

# Version 2: Hỗ trợ nhiều order
def process_payment_v2(data):
    order_ids = data.get("orderIds", [])
    payments = []

    for oid in order_ids:
        payments.append({
            "orderId": oid,
            "status": "SUCCESS",
        })

    return {
        "api_version": "v2",
        "paymentMethod": data.get("paymentMethod", "COD"),
        "total": data.get("total", 0),
        "payments": payments,
        "message": f"Processed {len(order_ids)} orders."
    }

@app.route("/payment", methods=["POST"])
def payment_handler():
    version = request.args.get("version", "1")  # default v1
    data = request.json

    if version == "1":
        result = process_payment_v1(data)
    elif version == "2":
        result = process_payment_v2(data)
    else:
        return jsonify({"error": "Unsupported version"}), 400

    return jsonify(result), 200

if __name__ == "__main__":
    print(" running at http://127.0.0.1:5000/payment?version=1")
    app.run(debug=True)

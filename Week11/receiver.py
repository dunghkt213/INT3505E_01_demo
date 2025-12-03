from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/notify', methods=['POST'])
def receive_webhook():
    data = request.json
    print("------------------------------------------")
    print(f"📡 Đã nhận được Webhook Event: {data.get('event_type')}")
    
    if data.get('event_type') == 'order_created':
        order_id = data.get('payload').get('order_id')
        amount = data.get('payload').get('amount')
        print(f"📧 Đang gửi email xác nhận đơn hàng #{order_id} trị giá ${amount}...")
        return jsonify({"status": "success", "message": "Email sent"}), 200
    
    return jsonify({"status": "ignored"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
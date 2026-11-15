from flask import render_template, redirect, url_for, jsonify, request, flash, current_app, session
from flask import Flask

import time


app = Flask(__name__)

@app.post('/api/v1/chat')
def chat():
    try:
        data = request.get_json(force=True)
        user_message = data.get("message", "")
    except Exception as e:
        print(f"❌ Error en API Chat: {e}")
        return jsonify({"error": str(e)}), 500

    if user_message.startswith("delay"):
        time.sleep(10)

    response = f"usted dijo: {user_message}"

    return jsonify({"response": response})

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'content-type'
    return response

# Esto permite correrlo con "python app.py"
app.run(host="0.0.0.0", port=5000, debug=True)
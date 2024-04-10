from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/detection")
def index():
    return "Hello, World!"

@app.route("/api/detection/members")
def members():
  return{"members": ["Member1", "Member2", "Member3",]}

if __name__ == "__main__":
  app.run(debug=True)
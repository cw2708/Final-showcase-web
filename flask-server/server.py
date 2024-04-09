from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, World!"

@app.route("/favicon.ico")
def favicon():
    pass

@app.route("/members")
def members():
  return{"members": ["Member1", "Member2", "Member3",]}

if __name__ == "__main__":
  app.run(debug=True)
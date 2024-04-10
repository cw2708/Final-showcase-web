# from flask import Flask, jsonify, request
# from ultralytics import YOLO

# app = Flask(__name__)
# model = YOLO('yolov8n.pt')

# @app.route("/api/detection")
# def index():
#     return "Hello, World!"

# @app.route("/api/detection/members")
# def members():
#   return{"members": ["Member1", "Member2", "Member3",]}

# @app.route("/api/detection/detect")
# def predict():
#     results = model('upload image')

#     detections = []
#     for result in results:
#         for box in result.boxes:
#             x1, y1, x2, y2 = box.xyxy[0].tolist()
#             conf, cls = box.conf[0].item(), box.cls[0].item()
#             detections.append({
#                 'class_id': int(cls),
#                 'class_name': result.names[int(cls)],
#                 'confidence': float(conf),
#                 'bounding_box': [x1, y1, x2, y2]
#             })

#     return jsonify({'detections': detections})

# if __name__ == "__main__":
#   app.run(debug=True)
from flask import Flask, jsonify, request
from ultralytics import YOLO
import os

app = Flask(__name__)
model = YOLO('yolov8n.pt')

@app.route("/api/detection")
def index():
    return "Hello, World!"

@app.route("/api/detection/members")
def members():
    return jsonify({"members": ["Member1", "Member2", "Member3"]})

@app.route("/api/detection/upload", methods=["POST"])
def upload():
    if "image" in request.files:
        image = request.files["image"]
        image_path = os.path.join("uploads", image.filename)
        image.save(image_path)
        return jsonify({"message": "Image uploaded successfully", "image_path": image_path})
    else:
        return jsonify({"error": "No image provided"})

@app.route("/api/detection/detect")
def detect():
    if "image_path" in request.args:
        image_path = request.args["image_path"]
        results = model(image_path)

        detections = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf, cls = box.conf[0].item(), box.cls[0].item()
                detections.append({
                    'class_id': int(cls),
                    'class_name': result.names[int(cls)],
                    'confidence': float(conf),
                    'bounding_box': [x1, y1, x2, y2]
                })

        return jsonify({'detections': detections})
    else:
        return jsonify({"error": "No image path provided"})

if __name__ == "__main__":
    app.run(debug=True)
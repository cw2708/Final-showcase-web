
from flask import Flask, jsonify, request

from ultralytics import YOLO
import base64
import numpy as np
import cv2

app = Flask(__name__)
model = YOLO('./storage/yolov8n.pt')

@app.route("/api/detection")
def index():
    return "Hello, World!"

@app.route("/api/detection/members")
def members():
    return jsonify({"members": ["Member1", "Member2", "Member3"]})

@app.route("/api/detection/detect", methods=['POST'])
def detect():
    if 'image_data' in request.json:
        image_data = request.json['image_data']
        image_data += "=" * ((4 - len(image_data) % 4) % 4)  # Add padding if necessary
        image_bytes = base64.b64decode(image_data)
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

        results = model(image)

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
        return jsonify({"error": "No image data provided"})

if __name__ == "__main__":
    app.run(host='0.0.0.0')
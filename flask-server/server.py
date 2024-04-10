from flask import Flask, jsonify, request
from ultralytics import YOLO

app = Flask(__name__)
model = YOLO('yolov8n.pt')

@app.route("/api/detection")
def index():
    return "Hello, World!"

@app.route("/api/detection/members")
def members():
  return{"members": ["Member1", "Member2", "Member3",]}

@app.route("/api/detection/detect")
def predict():
    # if 'image' not in request.files:
    #     return jsonify({'error': 'No image provided'}), 400

    # image = request.files['image']
    # image_bytes = image.read()
    # image_tensor = torch.from_numpy(image_bytes).permute(2, 0, 1).float() / 255.0
    # results = model(image_tensor, size=640)
    results = model('https://ultralytics.com/images/bus.jpg')

    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf, cls = box.conf[0].item(), box.cls[0].item()
            detections.append({
                'class_id': int(cls),
                'confidence': float(conf),
                'bounding_box': [x1, y1, x2, y2]
            })

    return jsonify({'detections': detections})

if __name__ == "__main__":
  app.run(debug=True)
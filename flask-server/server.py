from flask import Flask 
from ultralytics import YOLO
import torch 
import numpy
import cv2
from time import time

app = Flask(__name__)

@app.route("/api/detection")
def index():
    return "Hello, World!"

@app.route("/api/detection/members")
def members():
  return{"members": ["Member1", "Member2", "Member3",]}

@app.route("/api/detection/detect")
def __init__(self, capture_index):
   self.capture_index = capture_index
   self.device = "cpu"
   self.model = self.load_model()

def load_model(self):
  model = YOLO('yolov8n.pt')
  model.fuse()

  return model

def predict(self, frame):
  result = self.model(frame)
  
  return result

def plot_bboxes(self, results, frame):

if __name__ == "__main__":
  app.run(debug=True)
import React, { useState, useEffect, useRef } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

const CameraComponent: React.FC = () => {
  const [isCapturedImageDisplayed, setIsCapturedImageDisplayed] =
    useState<boolean>(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const viewfinderRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isCapturedImageDisplayed && capturedImage) {
      handleImageUpload()
    }
  }, [isCapturedImageDisplayed, capturedImage])

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          if (viewfinderRef.current) {
            viewfinderRef.current.srcObject = stream
            viewfinderRef.current.play()
          }
        })
        .catch(function (error) {
          console.error('Error accessing the camera:', error)
        })
    } else {
      console.error('getUserMedia is not supported in this browser.')
    }
  }, [])

  const toggleDisplay = async () => {
    const viewfinder = viewfinderRef.current
    if (viewfinder) {
      if (isCapturedImageDisplayed) {
        const capturedImageElement = document.getElementById('captured-image')
        if (capturedImageElement) {
          capturedImageElement.remove()
        }
        viewfinder.style.display = 'block'
        const container = document.getElementById('camera')
        if (container) {
          const buttons = container.querySelectorAll('button')
          buttons.forEach((button) => {
            button.remove()
          })
        }
      } else {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (context && viewfinder.videoWidth && viewfinder.videoHeight) {
          canvas.width = viewfinder.videoWidth
          canvas.height = viewfinder.videoHeight
          context.drawImage(viewfinder, 0, 0, canvas.width, canvas.height)
          const capturedImageDataURL = canvas.toDataURL('image/jpeg')

          setCapturedImage(capturedImageDataURL)
        }
        viewfinder.style.display = 'none'
      }
      setIsCapturedImageDisplayed(!isCapturedImageDisplayed)
    }
  }

  const handleImageUpload = async () => {
    if (capturedImage) {
      try {
        const base64Image = capturedImage.split(',')[1]
        const fetchResponse = await fetch(`/api/detection/detect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_data: base64Image }),
        })
        const fetchData = await fetchResponse.json()
        console.log(fetchData)
        if (fetchData.detections && fetchData.detections.length > 0) {
          setDetectionResults(fetchData.detections)
          // drawRectangles(fetchData.detections)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  // const drawRectangles = (detections: any[]) => {
  //   const img = new Image()
  //   img.onload = () => {
  //     const canvas = document.createElement('canvas')
  //     const context = canvas.getContext('2d') as CanvasRenderingContext2D

  //     // Set canvas dimensions based on the image dimensions
  //     canvas.width = img.width
  //     canvas.height = img.height

  //     // Draw the image onto the canvas
  //     context.drawImage(img, 0, 0)

  //     // Draw rectangles for each detection
  //     detections.forEach((detection) => {
  //       const [x, y, width, height] = detection.bounding_box
  //       context.beginPath()
  //       context.rect(x, y, width, height)
  //       context.lineWidth = 6
  //       context.strokeStyle = 'Green'
  //       context.stroke()
  //     })

  //     // Convert the edited canvas to a data URL
  //     const editedImageDataURL = canvas.toDataURL('image/jpeg')

  //     // Create a new image element for the edited image
  //     const capturedImageView = new Image()
  //     capturedImageView.src = editedImageDataURL
  //     capturedImageView.id = 'captured-image'

  //     // Remove previous captured image
  //     const previousCapturedImage = document.getElementById('captured-image')
  //     if (previousCapturedImage) {
  //       previousCapturedImage.remove()
  //     }

  //     // Append the new image element to the DOM
  //     const cameraDiv = document.getElementById('camera')
  //     if (cameraDiv) {
  //       cameraDiv.appendChild(capturedImageView)
  //     }
  //   }
  //   // Access capturedImage directly from the component's state
  //   img.src = capturedImage as string
  // }

  const [detectionResults, setDetectionResults] = useState<
    {
      class_id: number
      class_name: string
      confidence: number
      bounding_box: number[]
    }[]
  >([])

  const DetectionResults: React.FC<{ results: typeof detectionResults }> = ({
    results,
  }) => {
    return (
      <div className="detection-results">
        {results.map((result, index) => (
          <div key={index} className="detection-result">
            <div className="class-name">{result.class_name}</div>
            <div className="confidence">
              Confidence: {result.confidence.toFixed(2)}
            </div>
            <div className="bounding-box">
              Bounding Box: {result.bounding_box.join(', ')}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const drawButtons = (
    detections: any[],
    handleDetectionClick: (detection: any) => void,
    container: HTMLElement,
  ) => {
    detections.forEach((detection, index) => {
      const [x, y, width, height] = detection.bounding_box

      // Create a button for each rectangle
      const button = document.createElement('button')
      button.style.position = 'absolute'
      button.style.left = `${x}px`
      button.style.top = `${y}px`
      button.style.width = `${width}px`
      button.style.height = `${height}px`
      button.style.cursor = 'pointer'
      button.addEventListener('click', () => handleDetectionClick(detection))
      button.textContent = `Button ${index + 1}`

      container.appendChild(button)
    })
  }

  useEffect(() => {
    if (detectionResults.length > 0) {
      const container = document.getElementById('camera')
      if (container) {
        drawButtons(detectionResults, handleDetectionClick, container)
      }
    }
  }, [detectionResults])

  const handleDetectionClick = () => {
    navigate('/Favourites')
  }
  return (
    <div>
      <Navbar />
      <div className="title-container">
        <h1 className="product-title">Product Detector Prototype</h1>
      </div>
      <div id="camera">
        <video id="viewfinder" ref={viewfinderRef} autoPlay playsInline>
          <track kind="captions" src="" srcLang="en" label="English" />
        </video>
      </div>
      <div id="button-container">
        <button className="circular-button" onClick={toggleDisplay}></button>
      </div>
      {detectionResults.length > 0 && (
        <DetectionResults results={detectionResults} />
      )}
    </div>
  )
}

export default CameraComponent

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
      const constraints: MediaStreamConstraints = {
        video: {
          aspectRatio: 16 / 9,
          facingMode: 'environment', // Use the rear camera if available
        },
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
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
          container.style.backgroundImage = ''
          const buttons = container.querySelectorAll('button')
          buttons.forEach((button) => {
            button.remove()
          })
          const canvas = container.querySelectorAll('canvas')
          canvas.forEach((canvas) => {
            canvas.remove()
          })
        }
      } else {
        const cameraDiv = document.getElementById('camera')
        if (!cameraDiv) {
          console.error('cameraDiv not found')
          return // Exit the function if cameraDiv is null
        }
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (
          context &&
          viewfinder.videoWidth &&
          viewfinder.videoHeight &&
          cameraDiv
        ) {
          canvas.width = cameraDiv.offsetWidth
          canvas.height = cameraDiv.offsetHeight
          context.drawImage(
            viewfinder,
            0,
            0,
            cameraDiv.offsetWidth,
            cameraDiv.offsetHeight,
          )
          const capturedImageDataURL = canvas.toDataURL('image/jpeg')

          // Here, you can do something with the captured image, such as displaying it or saving it
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
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
  useEffect(() => {
    const cameraDiv = document.getElementById('camera')
    const viewfinder = viewfinderRef.current

    if (cameraDiv && viewfinder) {
      // Set the background image of the cameraDiv to the capturedImage
      cameraDiv.style.backgroundImage = capturedImage
        ? `url(${capturedImage})`
        : ''

      // Set background size and position to cover and center respectively
      cameraDiv.style.backgroundSize = 'cover'
      cameraDiv.style.backgroundPosition = 'center'

      // Set cameraDiv dimensions to match the viewfinder dimensions
      cameraDiv.style.width = `${viewfinder.videoWidth}px`
      cameraDiv.style.height = `${viewfinder.videoHeight}px`
    }
  }, [capturedImage])
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

  // const drawButtons = (
  //   detections: any[],
  //   handleDetectionClick: (detection: any) => void,
  //   container: HTMLElement,
  // ) => {
  //   detections.forEach((detection, index) => {
  //     const [x, y, width, height] = detection.bounding_box

  //     // Create a button for each rectangle
  //     const button = document.createElement('button')
  //     button.style.position = 'absolute'
  //     button.style.left = `${x}px`
  //     button.style.top = `${y}px`
  //     button.style.width = `${width}px`
  //     button.style.height = `${height}px`
  //     button.style.cursor = 'pointer'
  //     button.addEventListener('click', () => handleDetectionClick(detection))
  //     button.textContent = `Button ${index + 1}`

  //     container.appendChild(button)
  //   })
  // }
  const drawRectangles = (
    detections: any[],
    handleObjClick: (detection: any) => void,
    container: HTMLElement,
    viewfinder: HTMLVideoElement | null,
  ) => {
    if (!viewfinder) {
      console.error('viewfinder is null')
      return // Exit the function if viewfinder is null
    }

    const cameraDiv = document.getElementById('camera')
    if (!cameraDiv) {
      console.error('cameraDiv not found')
      return // Exit the function if cameraDiv is null
    }

    const canvas = document.createElement('canvas')
    canvas.width = cameraDiv.offsetWidth
    canvas.height = cameraDiv.offsetHeight
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(canvas)

    detections.forEach((detection, index) => {
      const [x, y, width, height] = detection.bounding_box

      // Draw rectangle
      context.beginPath()
      context.rect(x, y, width, height)
      context.lineWidth = 2
      context.strokeStyle = 'red'
      context.stroke()

      // Add click event listener to the canvas
      canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const clickY = event.clientY - rect.top
        if (
          clickX >= x &&
          clickX <= x + width &&
          clickY >= y &&
          clickY <= y + height
        ) {
          handleObjClick(detection)
        }
      })
    })
  }

  useEffect(() => {
    if (detectionResults.length > 0) {
      const container = document.getElementById('camera')
      if (container) {
        drawRectangles(
          detectionResults,
          handleObjClick,
          container,
          viewfinderRef.current,
        )

        // Set background size to cover
        container.style.backgroundSize = 'cover'
      }
    }
  }, [detectionResults])

  const handleDetectionClick = () => {
    navigate('/Favourites')
  }

  const handleObjClick = () => {
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

// import Navbar from './Navbar'

// export default function Dashboard() {
//   return (
//     <>
//       <Navbar />
//       <h1>Hello you have made it to the Dashboard page</h1>
//     </>
//   )
// }

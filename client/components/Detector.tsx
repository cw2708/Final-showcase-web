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
          canvas.width = 1072
          canvas.height = 603
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
      cameraDiv.style.backgroundSize = '100%'
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
  const drawMarkers = (
    detections: any[],
    handleObjClick: (detection: any) => void,
    container: HTMLElement,
    viewfinder: HTMLVideoElement | null,
  ) => {
    if (!viewfinder) {
      console.error('viewfinder is null')
      return
    }

    const cameraDiv = document.getElementById('camera')
    if (!cameraDiv) {
      console.error('cameraDiv not found')
      return
    }

    detections.forEach((detection, index) => {
      const [x, y, width, height] = detection.bounding_box

      const imageWidth = cameraDiv.offsetWidth
      const imageHeight = cameraDiv.offsetHeight
      const centerX = Math.max(
        width / 2,
        Math.min(imageWidth - width / 2, x + width / 2),
      )
      const centerY =
        Math.max(
          height / 2,
          Math.min(imageHeight - height / 2, y + height / 2),
        ) - 50

      const marker = document.createElement('button')
      marker.className = 'map-marker-button'

      marker.style.position = 'absolute'
      marker.style.left = `${centerX - 27.5}px`
      marker.style.top = `${centerY - 36.5}px`
      marker.style.width = '55px'
      marker.style.height = '73px'
      marker.style.cursor = 'pointer'

      marker.addEventListener('click', () => {
        handleObjClick(detection)
      })

      const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="50" viewBox="0 0 37.5 54.749999" height="73">
                <defs>
                    <clipPath id="ea64819cb5">
                        <path d="M 0 1.019531 L 36.679688 1.019531 L 36.679688 54.265625 L 0 54.265625 Z M 0 1.019531 " clipRule="nonzero" />
                    </clipPath>
                    <clipPath id="97adcbac90">
                        <path d="M 7.773438 7.953125 L 29.234375 7.953125 L 29.234375 30.410156 L 7.773438 30.410156 Z M 7.773438 7.953125 " clipRule="nonzero" />
                    </clipPath>
                    <clipPath id="2131ad6022">
                        <path d="M 1.097656 2.597656 L 35.703125 2.597656 L 35.703125 52.429688 L 1.097656 52.429688 Z M 1.097656 2.597656 " clipRule="nonzero" />
                    </clipPath>
                </defs>
                <g clipPath="url(#ea64819cb5)">
                    <path fill="#78d870" d="M 18.488281 28.191406 C 13.28125 28.191406 9.058594 23.972656 9.058594 18.765625 C 9.058594 13.558594 13.28125 9.339844 18.488281 9.339844 C 23.695312 9.339844 27.914062 13.558594 27.914062 18.765625 C 27.914062 23.972656 23.695312 28.191406 18.488281 28.191406 Z M 18.488281 1.019531 C 8.6875 1.019531 0.03125 8.992188 0.742188 18.765625 C 0.816406 19.796875 1.082031 21.859375 1.339844 22.863281 C 1.65625 24.097656 2.574219 26.488281 3.117188 27.640625 C 6.390625 34.589844 18.488281 54.257812 18.488281 54.257812 C 18.488281 54.257812 30.601562 34.597656 33.859375 27.640625 C 34.398438 26.488281 35.292969 24.09375 35.609375 22.863281 C 35.867188 21.859375 36.15625 19.796875 36.234375 18.765625 C 36.972656 8.992188 28.289062 1.019531 18.488281 1.019531 " fillOpacity="1" fillRule="nonzero" />
                </g>
                <g clipPath="url(#97adcbac90)">
                    <path fill="#78d870" d="M 7.773438 7.953125 L 29.234375 7.953125 L 29.234375 30.425781 L 7.773438 30.425781 Z M 7.773438 7.953125 " fillOpacity="1" fillRule="nonzero" />
                </g>
                <g clipPath="url(#2131ad6022)">
                    <path fill="#ffffff" d="M 18.488281 28.160156 C 13.589844 28.160156 9.621094 24.1875 9.621094 19.292969 C 9.621094 14.394531 13.589844 10.421875 18.488281 10.421875 C 23.386719 10.421875 27.355469 14.394531 27.355469 19.292969 C 27.355469 24.1875 23.386719 28.160156 18.488281 28.160156 Z M 18.488281 2.597656 C 9.269531 2.597656 1.128906 10.097656 1.796875 19.292969 C 1.867188 20.261719 2.117188 22.203125 2.355469 23.148438 C 2.65625 24.308594 3.519531 26.554688 4.027344 27.640625 C 7.109375 34.179688 18.488281 52.675781 18.488281 52.675781 C 18.488281 52.675781 29.882812 34.1875 32.945312 27.640625 C 33.453125 26.554688 34.296875 24.304688 34.59375 23.148438 C 34.835938 22.203125 35.109375 20.261719 35.179688 19.292969 C 35.875 10.097656 27.707031 2.597656 18.488281 2.597656 " fillOpacity="1" fillRule="nonzero" />
                </g>
            </svg>
        `
      marker.innerHTML = svgContent

      container.appendChild(marker)
    })
  }

  const drawRectangles = (
    detections: any[],
    container: HTMLElement,
    viewfinder: HTMLVideoElement | null,
  ) => {
    if (!viewfinder) {
      console.error('viewfinder is null')
      return
    }

    const cameraDiv = document.getElementById('camera')
    if (!cameraDiv) {
      console.error('cameraDiv not found')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1072
    canvas.height = 603
    const original_height = 576
    const original_width = 1024
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(canvas)

    detections.forEach((detection, index) => {
      const [norm_x, norm_y, norm_width, norm_height] = detection.bounding_box

      // Convert normalized coordinates to pixel values
      const pixel_x = norm_x * original_width
      const pixel_y = norm_y * original_height
      const pixel_width = norm_width * original_width
      const pixel_height = norm_height * original_height

      // Calculate pixel coordinates for the bottom-right corner
      const pixel_x_max = pixel_x + pixel_width
      const pixel_y_max = pixel_y + pixel_height

      // Scale the results to fit the new container size
      const scale_x = canvas.width / original_width
      const scale_y = canvas.height / original_height

      const scaled_pixel_x = pixel_x * scale_x
      const scaled_pixel_y = pixel_y * scale_y
      const scaled_pixel_width = pixel_x_max - pixel_x * scale_x
      const scaled_pixel_height = pixel_y_max - pixel_y * scale_y

      // Draw the rectangle
      context.beginPath()
      context.lineWidth = 2
      context.strokeStyle = 'red'
      context.rect(
        scaled_pixel_x,
        scaled_pixel_y,
        scaled_pixel_width,
        scaled_pixel_height,
      )
      context.stroke()
    })
  }

  useEffect(() => {
    if (detectionResults.length > 0) {
      const container = document.getElementById('camera')
      if (container) {
        drawMarkers(
          detectionResults,
          handleDetectionClick,
          container,
          viewfinderRef.current,
        )

        drawRectangles(detectionResults, container, viewfinderRef.current)

        // Set background size to cover
        container.style.backgroundSize = 'cover'
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

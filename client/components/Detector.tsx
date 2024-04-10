import React, { useState, useEffect, useRef } from 'react'
import Navbar from './Navbar'

const CameraComponent: React.FC = () => {
  const [isCapturedImageDisplayed, setIsCapturedImageDisplayed] =
    useState<boolean>(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const viewfinderRef = useRef<HTMLVideoElement>(null)

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
      } else {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (context && viewfinder.videoWidth && viewfinder.videoHeight) {
          canvas.width = viewfinder.videoWidth
          canvas.height = viewfinder.videoHeight
          context.drawImage(viewfinder, 0, 0, canvas.width, canvas.height)
          const capturedImageDataURL = canvas.toDataURL('image/jpeg')

          const capturedImageView = new Image()
          capturedImageView.src = capturedImageDataURL
          capturedImageView.id = 'captured-image'

          const previousCapturedImage =
            document.getElementById('captured-image')
          if (previousCapturedImage) {
            previousCapturedImage.remove()
          }

          const cameraDiv = document.getElementById('camera')
          if (cameraDiv) {
            cameraDiv.appendChild(capturedImageView)
          }

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
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div id="camera">
        <video id="viewfinder" ref={viewfinderRef} autoPlay playsInline>
          <track kind="captions" src="" srcLang="en" label="English" />
        </video>
      </div>
      <div id="button-container">
        <button className="circular-button" onClick={toggleDisplay}></button>
      </div>
    </div>
  )
}

export default CameraComponent

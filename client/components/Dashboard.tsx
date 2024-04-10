import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'

const CameraComponent: React.FC = () => {
  const [isCapturedImageDisplayed, setIsCapturedImageDisplayed] =
    useState<boolean>(false)
  const viewfinderRef = React.useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if the browser supports getUserMedia
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
        // Remove the captured image
        const capturedImage = document.getElementById('captured-image')
        if (capturedImage) {
          capturedImage.remove()
        }
        // Show the viewfinder again
        viewfinder.style.display = 'block'
      } else {
        // Capture image from the viewfinder (assuming it's a video element)
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (context && viewfinder.videoWidth && viewfinder.videoHeight) {
          canvas.width = viewfinder.videoWidth
          canvas.height = viewfinder.videoHeight
          context.drawImage(viewfinder, 0, 0, canvas.width, canvas.height)
          const capturedImage = canvas.toDataURL('image/jpeg')

          // Create an image element to display the captured image
          const capturedImageView = new Image()
          capturedImageView.src = capturedImage
          capturedImageView.id = 'captured-image'

          const previousCapturedImage =
            document.getElementById('captured-image')
          if (previousCapturedImage) {
            previousCapturedImage.remove() // Remove the previous captured image
          }

          const cameraDiv = document.getElementById('camera')
          if (cameraDiv) {
            cameraDiv.appendChild(capturedImageView)
          }
        }
        // Hide the viewfinder
        viewfinder.style.display = 'none'
      }
      // Toggle the display mode
      setIsCapturedImageDisplayed(!isCapturedImageDisplayed)
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

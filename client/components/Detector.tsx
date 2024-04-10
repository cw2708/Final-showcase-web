// import Navbar from './Navbar'
// import React, { useState, useEffect } from 'react'

// export default function Detector() {
//   const [members, setMembers] = useState([])

//   const uploadImage = 'bus.jpg'
//   const handleImageUpload = () => {
//     const formData = new FormData()
//     formData.append('image', uploadImage)

//     fetch('/api/detection/detect', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log('Image uploaded:', data)
//       })
//       .catch((error) => console.error('Error uploading image:', error))
//   }

//   useEffect(() => {
//     fetch('/api/detection/detect')
//       .then((res) => res.json())
//       .then((data) => {
//         setMembers(data.detection)
//         console.log(data)
//       })
//       .catch((error) => console.error('Error fetching members:', error))
//   }, [])

//   return (
//     <>
//       <Navbar />
//       <h1>Hello you have made it to the Detector page</h1>
//       <button onClick={handleImageUpload}>Upload Image </button>
//     </>
//   )
// }
import Navbar from './Navbar'
import React, { useState } from 'react'

export default function Detector() {
  const [members, setMembers] = useState([])
  const uploadImage = 'bus.jpg'

  const handleImageUpload = async () => {
    try {
      // Fetch detection results
      const fetchResponse = await fetch(
        `/api/detection/detect?image_path=${uploadImage}`,
      )
      const fetchData = await fetchResponse.json()
      setMembers(fetchData.detections)
      console.log(fetchData)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <Navbar />
      <h1>Hello you have made it to the Detector page</h1>
      <button onClick={handleImageUpload}>Upload Image</button>
    </>
  )
}

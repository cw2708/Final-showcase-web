import Navbar from './Navbar'
import React, { useState, useEffect } from 'react'

export default function Detector() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetch('/api/detection/members')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members)
        console.log(data)
      })
      .catch((error) => console.error('Error fetching members:', error))
  }, [])

  return (
    <>
      <Navbar />
      <h1>Hello you have made it to the Detector page</h1>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member}</li>
        ))}
      </ul>
    </>
  )
}

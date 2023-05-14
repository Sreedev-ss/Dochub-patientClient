import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import './Home.scss'

const Home = () => {
  return (
    <>
        <Navbar/>
        <Sidebar/>
        <h1>Welcome home</h1>
    </>
  )
}

export default Home

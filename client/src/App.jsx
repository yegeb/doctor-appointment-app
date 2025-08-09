import React                           from "react"
import { Route, Routes }               from "react-router-dom"
import { ToastContainer }              from 'react-toastify'
import Home                            from "./pages/Home"
import Doctors                         from "./pages/Doctors"
import MyAppointments                  from "./pages/MyAppointments"
import About                           from "./pages/About"
import Contact                         from "./pages/Contact"
import MyProfile                       from "./pages/MyProfile"
import Appointment                     from "./pages/Appointment"
import Login                           from "./pages/Login"
import Navbar                          from "./components/Navbar"
import Footer                          from "./components/Footer"


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/doctors' element={<Doctors/>} />
        <Route path='/doctors/:speciality' element={<Doctors/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/my-profile' element={<MyProfile/>} />
        <Route path='/my-appointments' element={<MyAppointments/>} />
        <Route path='/appointment/:docId' element={<Appointment/>} />
      </Routes>
      <Footer/>

    </div>
  )
} 

console.log("App loaded");

export default App
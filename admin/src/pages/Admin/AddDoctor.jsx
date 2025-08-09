  import React, { useContext, useState } from 'react'
  import { AdminContext }                from '../../context/AdminContext'
  import { toast }                       from 'react-toastify'
  import axios                           from 'axios'
  import { assets } from '../../assets/assets' 

  const AddDoctor = () => {

    const [docImg, setDocImg]         = useState(false)
    const [name, setName]             = useState('')
    const [email, setEmail]           = useState('')
    const [password, setPassword]     = useState('')
    const [experience, setExperience] = useState('0-1')
    const [fee, setFee]               = useState('')
    const [about, setAbout]           = useState('')
    const [speciality, setSpeciality] = useState('General Physician')
    const [degree, setDegree]         = useState('')
    const [address1, setAddress1]     = useState('')
    const [address2, setAddress2]     = useState('')

    const { backendURL, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
      event.preventDefault();

      try{
        if(!docImg) {
          return toast.error('Image Not Selected')
        }

        const formData = new FormData()

        formData.append('image', docImg)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('experience', experience)
        formData.append('fee', Number(fee))
        formData.append('about', about)
        formData.append('speciality', speciality)
        formData.append('degree', degree)
        formData.append('address', JSON.stringify({line1: address1, line2:address2}))

        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        })

        const { data } = await axios.post(backendURL + '/api/admin/add-doctor', formData, { headers: { atoken: aToken, 'Content-Type': 'multipart/form-data' } })


        if (data.success) {
          toast.success(data.message)
          setDocImg(false)
          setName('')
          setEmail('')
          setPassword('')
          setExperience('0-1 years')
          setFee('')
          setAbout('')
          setSpeciality('General Physician')
          setDegree('')
          setAddress1('')
          setAddress2('')


        }
        
      }

      catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        console.error(error);
      }
    }

    return (
      <form onSubmit={onSubmitHandler} className='m-5 w-full'>

        <p className='mb-3 text-lg font-medium'>Add Doctor</p>

        <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
          <div className='flex items-center gap-4 mb-8 text-gray-500 '>
            <label htmlFor="doc-img" className='cursor-pointer'>
              <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" /> 
            </label>
            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden/>
            <p>Upload Doctor <br /> Picture</p>
          </div>

          <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

            <div className='w-full lg:flex-1 flex flex-col gap-4'>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Doctor Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder='Name' required  />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Doctor Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder='Email' required  />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Doctor Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="border rounded px-3 py-2" type="password" placeholder='Password' required  />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Experience</p>
                <select onChange={(e) => setExperience(e.target.value)} value={experience} className="border rounded px-3 py-2">
                  <option value="">Select experience</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10-20 years">10-20 years</option>
                  <option value="20+ years">20+ years</option>
                </select>
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Fees</p>
                <input onChange={(e) => setFee(e.target.value)} value={fee} className="border rounded px-3 py-2" type="number" placeholder='Fees' required />
              </div>

            </div>

            <div className='w-full lg:flex-1 flex flex-col gap-4'>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Speciality</p>
                <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="border rounded px-3 py-2" name="" id="">
                  <option value="">Select Speciality</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>  
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Education</p>
                <input onChange={(e) => setDegree(e.target.value)} value={degree} className="border rounded px-3 py-2" type="text" placeholder='Education' required />
              </div>

              <div className='flex-1 flex flex-col gap-1'>
                <p>Address</p>
                <input onChange={(e) => setAddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder='Address1' required />
                <input onChange={(e) => setAddress2(e.target.value)} value={address2} className="border rounded px-3 py-2" type="text" placeholder='Address2' required />
              </div>
  
            </div>

          </div>

          <div>
                <p className='mt-4 mb-2'>About Doctor </p>
                <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write About Doctor' rows={5} required />
          </div>

          <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
          
        </div>
      </form>
    )
  }  

  export default AddDoctor
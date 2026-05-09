import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function CreatePet(){

  const [form,setForm] = useState({
    name:'',
    age:'',
    type:'',
    breed:'',
    gender:'',
    healthStatus:'',
    location:'',
    description:''
  })
  
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, PNG and WEBP images are allowed.')
        setImageFile(null)
        setImagePreview(null)
        e.target.value = null
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size cannot exceed 5MB.')
        setImageFile(null)
        setImagePreview(null)
        e.target.value = null
        return
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('age', form.age || 0)
      formData.append('type', form.type)
      formData.append('breed', form.breed)
      formData.append('gender', form.gender)
      formData.append('healthStatus', form.healthStatus)
      formData.append('location', form.location)
      formData.append('description', form.description)
      
      if (imageFile) {
        formData.append('image', imageFile)
      }

      await API.post('/Pet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Pet Created Successfully')
      navigate('/')
    } catch(err) {
      toast.error(err.response?.data?.title || err.response?.data || 'Failed to create pet')
    } finally {
      setIsUploading(false)
    }
  }

  return(
    <div className='container mt-5 mb-5'>
      <div className='card p-4 shadow-sm'>
        <h2>Create Pet Post</h2>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className='row'>
            <div className='col-md-6 mb-3'>
              <label className="form-label">Pet Name</label>
              <input
                className='form-control'
                placeholder='e.g., Bella'
                required
                onChange={(e)=>setForm({...form,name:e.target.value})}
              />
            </div>
            <div className='col-md-6 mb-3'>
              <label className="form-label">Age (Years)</label>
              <input
                type='number'
                className='form-control'
                placeholder='e.g., 3'
                required
                min="0"
                onChange={(e)=>setForm({...form,age:e.target.value})}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-4 mb-3'>
              <label className="form-label">Animal Type</label>
              <select className='form-select' required onChange={(e)=>setForm({...form,type:e.target.value})}>
                <option value=''>Select Animal Type</option>
                <option value='Dog'>Dog</option>
                <option value='Cat'>Cat</option>
                <option value='Bird'>Bird</option>
                <option value='Other'>Other</option>
              </select>
            </div>
            <div className='col-md-4 mb-3'>
              <label className="form-label">Breed</label>
              <input
                className='form-control'
                placeholder='e.g., Golden Retriever'
                required
                onChange={(e)=>setForm({...form,breed:e.target.value})}
              />
            </div>
            <div className='col-md-4 mb-3'>
              <label className="form-label">Gender</label>
              <select className='form-select' required onChange={(e)=>setForm({...form,gender:e.target.value})}>
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Unknown'>Unknown</option>
              </select>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6 mb-3'>
              <label className="form-label">Health Status</label>
              <input
                className='form-control'
                placeholder='e.g., Fully Vaccinated, Healthy'
                required
                onChange={(e)=>setForm({...form,healthStatus:e.target.value})}
              />
            </div>
            <div className='col-md-6 mb-3'>
              <label className="form-label">Location</label>
              <input
                className='form-control'
                placeholder='e.g., New York, NY'
                required
                onChange={(e)=>setForm({...form,location:e.target.value})}
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className="form-label">Pet Image</label>
            <input
              type='file'
              className='form-control'
              accept="image/jpeg, image/png, image/webp, image/jpg"
              required
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3">
                <p className="mb-1 text-muted">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="img-thumbnail" 
                  style={{ maxHeight: '250px', objectFit: 'contain' }} 
                />
              </div>
            )}
          </div>

          <div className='mb-4'>
            <label className="form-label">Description</label>
            <textarea
              className='form-control'
              placeholder='Tell us about the pet...'
              rows='4'
              required
              onChange={(e)=>setForm({...form,description:e.target.value})}
            />
          </div>

          <button 
            className='btn btn-primary w-100 py-2' 
            type="submit" 
            disabled={isUploading}
          >
            {isUploading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Uploading & Creating...</>
            ) : (
              'Create Pet Post'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePet
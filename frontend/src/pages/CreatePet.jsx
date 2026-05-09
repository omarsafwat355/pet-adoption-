import { useState } from 'react'
import { toast } from 'react-toastify'

function CreatePet(){

  const [form,setForm] = useState({
    petName:'',
    breed:'',
    age:'',
    location:'',
    description:''
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    toast.success('Pet Created Successfully')
  }

  return(
    <div className='container mt-5'>
      <div className='card p-4'>
        <h2>Create Pet</h2>

        <form onSubmit={handleSubmit}>
          <input
            className='form-control mb-3'
            placeholder='Pet Name'
            onChange={(e)=>setForm({...form,petName:e.target.value})}
          />

          <input
            className='form-control mb-3'
            placeholder='Breed'
            onChange={(e)=>setForm({...form,breed:e.target.value})}
          />

          <input
            className='form-control mb-3'
            placeholder='Age'
            onChange={(e)=>setForm({...form,age:e.target.value})}
          />

          <input
            className='form-control mb-3'
            placeholder='Location'
            onChange={(e)=>setForm({...form,location:e.target.value})}
          />

          <textarea
            className='form-control mb-3'
            placeholder='Description'
            onChange={(e)=>setForm({...form,description:e.target.value})}
          />

          <button className='btn btn-primary'>
            Create Pet
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePet
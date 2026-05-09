import { useState } from 'react'
import { toast } from 'react-toastify'

function Register(){

  const [form,setForm] = useState({
    name:'',
    email:'',
    password:'',
    role:'Adopter'
  })

  const handleSubmit = (e)=>{
    e.preventDefault()
    toast.success('Registration Submitted')
  }

  return(
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card p-4'>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
              <input
                className='form-control mb-3'
                placeholder='Name'
                onChange={(e)=>setForm({...form,name:e.target.value})}
              />

              <input
                className='form-control mb-3'
                placeholder='Email'
                onChange={(e)=>setForm({...form,email:e.target.value})}
              />

              <input
                type='password'
                className='form-control mb-3'
                placeholder='Password'
                onChange={(e)=>setForm({...form,password:e.target.value})}
              />

              <select
                className='form-select mb-3'
                onChange={(e)=>setForm({...form,role:e.target.value})}
              >
                <option>Adopter</option>
                <option>Shelter</option>
              </select>

              <button className='btn btn-success w-100'>
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
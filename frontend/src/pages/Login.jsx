import { useState } from 'react'
import { toast } from 'react-toastify'

function Login(){

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const handleSubmit = (e)=>{
    e.preventDefault()

    localStorage.setItem('token','demo-token')

    toast.success('Login Successful')
  }

  return(
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-5'>
          <div className='card p-4'>
            <h2 className='mb-4'>Login</h2>

            <form onSubmit={handleSubmit}>
              <input
                type='email'
                className='form-control mb-3'
                placeholder='Email'
                onChange={(e)=>setEmail(e.target.value)}
              />

              <input
                type='password'
                className='form-control mb-3'
                placeholder='Password'
                onChange={(e)=>setPassword(e.target.value)}
              />

              <button className='btn btn-primary w-100'>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
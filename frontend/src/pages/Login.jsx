import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { AuthContext } from '../context/AuthContext'

function Login(){

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const { data } = await API.post('/auth/login', { email, password })
      login(data)
      toast.success('Login Successful')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data || 'Login Failed')
    }
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
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function Navbar(){
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return(
    <nav className='navbar navbar-expand-lg navbar-dark px-4'>
      <Link className='navbar-brand fw-bold' to='/'>
        PetAdopt
      </Link>

      <div className='ms-auto d-flex gap-2 align-items-center'>
        {user && (user.role === 'PetOwner' || user.role === 'Shelter') && (
          <>
            <Link className='btn btn-light' to='/dashboard'>
              Dashboard
            </Link>
            <Link className='btn btn-success' to='/create-pet'>
              Add Pet
            </Link>
          </>
        )}

        {user && user.role === 'Adopter' && (
          <>
            <Link className='btn btn-warning me-2' to='/favorites'>
              Favorites
            </Link>
            <Link className='btn btn-success' to='/adopted'>
              Adopted Pets
            </Link>
          </>
        )}

        {user && user.role === 'Admin' && (
          <Link className='btn btn-info' to='/admin'>
            Admin Panel
          </Link>
        )}

        {!user ? (
          <>
            <Link className='btn btn-outline-light' to='/register'>
              Register
            </Link>
            <Link className='btn btn-dark' to='/login'>
              Login
            </Link>
          </>
        ) : (
          <>
            <span className='text-white me-2'>
              {user.email} ({user.role})
            </span>
            <button className='btn btn-danger' onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
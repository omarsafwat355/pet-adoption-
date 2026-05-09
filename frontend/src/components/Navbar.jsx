import { Link } from 'react-router-dom'

function Navbar(){

  return(
    <nav className='navbar navbar-expand-lg navbar-dark px-4'>
      <Link className='navbar-brand fw-bold' to='/'>
        PetAdopt
      </Link>

      <div className='ms-auto d-flex gap-2'>
        <Link className='btn btn-light' to='/dashboard'>
          Dashboard
        </Link>

        <Link className='btn btn-warning' to='/favorites'>
          Favorites
        </Link>

        <Link className='btn btn-success' to='/create-pet'>
          Add Pet
        </Link>

        <Link className='btn btn-dark' to='/login'>
          Login
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
import { useParams } from 'react-router-dom'

function PetDetails(){

  const {id} = useParams()

  return(
    <div className='container mt-5'>
      <div className='card p-4'>
        <img
          src='https://placehold.co/900x400'
          className='img-fluid rounded mb-4'
        />

        <h1>Pet #{id}</h1>

        <p>
          Friendly pet looking for a new home.
        </p>

        <button className='btn btn-success'>
          Send Adoption Request
        </button>
      </div>
    </div>
  )
}

export default PetDetails
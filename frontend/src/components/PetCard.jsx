import { Link } from 'react-router-dom'

function PetCard({pet}){

  return(
    <div className='col-md-4 mb-4'>
      <div className='card h-100'>
        <img
          src={pet.imageUrl}
          className='card-img-top pet-image'
        />

        <div className='card-body'>
          <h4>{pet.petName}</h4>

          <p><strong>Breed:</strong> {pet.breed}</p>

          <p><strong>Location:</strong> {pet.location}</p>

          <Link
            to={`/pet/${pet.id}`}
            className='btn btn-primary w-100'
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PetCard
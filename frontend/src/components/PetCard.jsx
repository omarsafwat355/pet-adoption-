import { Link } from 'react-router-dom'

function PetCard({pet}){

  return(
    <div className='col-md-4 mb-4'>
      <div className='card h-100 shadow-sm'>
        {pet.imageUrl ? (
          <img
            src={pet.imageUrl}
            className='card-img-top pet-image'
            style={{ height: '200px', objectFit: 'cover' }}
            alt={pet.name}
          />
        ) : (
          <div className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: '200px' }}>
            No Image
          </div>
        )}

        <div className='card-body'>
          <h4 className="card-title text-primary">{pet.name}</h4>
          
          <div className="mb-2">
            <span className="badge bg-secondary me-1">{pet.type}</span>
            <span className="badge bg-info text-dark me-1">{pet.gender}</span>
            {pet.status === 'Adopted' && <span className="badge bg-success">Adopted</span>}
          </div>

          <p className="mb-1"><strong>Breed:</strong> {pet.breed}</p>
          <p className="mb-1"><strong>Age:</strong> {pet.age} years</p>
          <p className="mb-1"><strong>Health:</strong> {pet.healthStatus}</p>
          <p className="mb-1"><strong>Location:</strong> {pet.location}</p>
          <p className="mb-3 text-muted small"><strong>Owner:</strong> {pet.ownerName}</p>

          <Link
            to={`/pet/${pet.id}`}
            className='btn btn-primary w-100 mt-auto'
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PetCard
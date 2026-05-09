import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../api/axios'

function PetDetails(){
  const {id} = useParams()
  const [pet, setPet] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await API.get('/Pet')
        const found = data.find(p => p.id === parseInt(id))
        if(found) setPet(found)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPet()
  }, [id])

  const handleApply = async () => {
    try {
      await API.post('/Adopation/apply', { PetId: id, Message: message })
      toast.success('Adoption request sent successfully!')
      setMessage('')
    } catch(err) {
      toast.error(err.response?.data || 'Failed to apply')
    }
  }

  if (!pet) return <div className='container mt-5'>Loading pet details...</div>

  return(
    <div className='container mt-5'>
      <div className='card p-4 shadow-sm'>
        <div className='row'>
          <div className='col-md-6 mb-4'>
            {pet.imageUrl ? (
              <img
                src={pet.imageUrl}
                className='img-fluid rounded'
                style={{ width: '100%', objectFit: 'cover' }}
                alt={pet.name}
              />
            ) : (
              <div className="bg-light rounded d-flex align-items-center justify-content-center text-muted" style={{ height: '300px' }}>
                No Image Available
              </div>
            )}
          </div>
          <div className='col-md-6'>
            <h1 className='text-primary'>{pet.name}</h1>
            
            <div className="mb-3">
              <span className="badge bg-secondary me-2 fs-6">{pet.type}</span>
              <span className="badge bg-info text-dark me-2 fs-6">{pet.gender}</span>
              {pet.status === 'Adopted' && <span className="badge bg-success fs-6">Adopted</span>}
            </div>

            <h5 className="text-muted mb-4">Owner: {pet.ownerName}</h5>

            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item px-0"><strong>Breed:</strong> {pet.breed}</li>
              <li className="list-group-item px-0"><strong>Age:</strong> {pet.age} years</li>
              <li className="list-group-item px-0"><strong>Health Status:</strong> {pet.healthStatus}</li>
              <li className="list-group-item px-0"><strong>Location:</strong> {pet.location}</li>
            </ul>

            <h4>About {pet.name}</h4>
            <p className="lead fs-6">{pet.description}</p>
          </div>
        </div>

        <hr className='my-5' />

        <div className='mt-4'>
          <h4>Apply for Adoption</h4>
          <textarea 
            className='form-control mb-3' 
            rows='4' 
            placeholder='Provide your history (past pets, veterinary references, experience)...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div className='d-flex gap-2'>
            <button className='btn btn-success px-4' onClick={handleApply}>
              Send Adoption Request
            </button>
            <button className='btn btn-outline-danger px-4' onClick={async () => {
              try {
                await API.post('/Favorite', { PetId: parseInt(id) })
                toast.success('Saved to Favorites!')
              } catch(err) {
                toast.error('Could not save to favorites')
              }
            }}>
              ❤️ Save to Favorites
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PetDetails
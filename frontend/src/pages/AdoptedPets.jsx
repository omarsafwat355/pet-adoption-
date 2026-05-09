import { useState, useEffect } from 'react'
import API from '../api/axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

function AdoptedPets(){
  const [pets, setPets] = useState([])
  const [reviews, setReviews] = useState({})

  useEffect(() => {
    fetchAdoptedPets()
  }, [])

  const fetchAdoptedPets = async () => {
    try {
      const { data } = await API.get('/Pet/adopted')
      setPets(data)
    } catch(err) {
      console.error(err)
      toast.error('Failed to load adopted pets')
    }
  }

  const handleReviewChange = (petId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [petId]: {
        ...prev[petId],
        [field]: value
      }
    }))
  }

  const submitReview = async (petId) => {
    const review = reviews[petId]
    if (!review?.comment || !review?.rating) {
      toast.warning('Please provide both a comment and a rating.')
      return
    }

    try {
      await API.post('/Review', { 
        PetId: petId, 
        Comment: review.comment,
        Rating: parseInt(review.rating)
      })
      toast.success('Review submitted successfully!')
      // Clear the review form for this pet
      setReviews(prev => ({
        ...prev,
        [petId]: { comment: '', rating: '' }
      }))
    } catch(err) {
      toast.error('Failed to submit review')
    }
  }

  return(
    <div className='container mt-5 mb-5'>
      <h2 className="mb-4">My Adopted Pets</h2>
      
      {pets.length === 0 ? (
        <div className="alert alert-info">You haven't adopted any pets yet. <Link to="/">Browse pets</Link></div>
      ) : (
        <div className='row'>
          {pets.map((pet) => (
            <div className='col-md-6 mb-4' key={pet.id}>
              <div className='card h-100 shadow-sm'>
                {pet.imageUrl ? (
                  <img
                    src={pet.imageUrl}
                    className='card-img-top pet-image'
                    style={{ height: '250px', objectFit: 'cover' }}
                    alt={pet.name}
                  />
                ) : (
                  <div className="card-img-top bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: '250px' }}>
                    No Image
                  </div>
                )}

                <div className='card-body'>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="card-title text-primary mb-0">{pet.name}</h4>
                    <span className="badge bg-success">Adopted</span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="badge bg-secondary me-1">{pet.type}</span>
                    <span className="badge bg-info text-dark me-1">{pet.gender}</span>
                  </div>

                  <p className="mb-1"><strong>Breed:</strong> {pet.breed}</p>
                  <p className="mb-1"><strong>Location:</strong> {pet.location}</p>
                  <p className="mb-3 text-muted small"><strong>Original Owner:</strong> {pet.ownerName}</p>
                  
                  <Link to={`/pet/${pet.id}`} className='btn btn-outline-primary w-100 mb-4'>
                    View Pet Details
                  </Link>

                  <hr/>

                  <div className='mt-3'>
                    <h5 className="mb-3">Leave Feedback for Owner</h5>
                    <textarea 
                      className='form-control mb-2' 
                      rows='2' 
                      placeholder='Write your feedback about the adoption process...'
                      value={reviews[pet.id]?.comment || ''}
                      onChange={(e) => handleReviewChange(pet.id, 'comment', e.target.value)}
                    ></textarea>
                    
                    <div className="d-flex gap-2">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Rating (1-5)" 
                        min="1" 
                        max="5"
                        style={{ width: '120px' }}
                        value={reviews[pet.id]?.rating || ''}
                        onChange={(e) => handleReviewChange(pet.id, 'rating', e.target.value)}
                      />
                      <button 
                        className='btn btn-primary flex-grow-1' 
                        onClick={() => submitReview(pet.id)}
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdoptedPets

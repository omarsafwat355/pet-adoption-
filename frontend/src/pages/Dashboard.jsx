import { useState, useEffect } from 'react'
import API from '../api/axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

function Dashboard(){
  const [pets, setPets] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Assuming these endpoints exist or will exist
      const petData = await API.get('/Pet/mypets')
      setPets(petData.data || [])
      
      const reqData = await API.get('/Adopation/requests')
      setRequests(reqData.data || [])
    } catch(err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure?')) {
      try {
        await API.delete(`/Pet/${id}`)
        toast.success('Pet deleted')
        fetchData()
      } catch(err) {
        toast.error('Delete failed')
      }
    }
  }

  const handleRequest = async (id, action) => {
    try {
      await API.post(`/Adopation/${action}?id=${id}`)
      toast.success(`Request ${action}d`)
      fetchData()
    } catch(err) {
      toast.error('Action failed')
    }
  }

  const [editingPet, setEditingPet] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEditClick = (pet) => {
    setEditingPet(pet.id)
    setEditForm({
      id: pet.id,
      name: pet.name,
      age: pet.age,
      type: pet.type,
      breed: pet.breed,
      gender: pet.gender,
      healthStatus: pet.healthStatus,
      location: pet.location,
      description: pet.description
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.put('/Pet', editForm)
      toast.success('Pet updated successfully')
      setEditingPet(null)
      fetchData()
    } catch(err) {
      toast.error('Failed to update pet')
    }
  }

  return(
    <div className='container mt-5'>
      <h1>Shelter Dashboard</h1>

      <div className='row mt-4'>
        <div className='col-md-6'>
          <div className='card p-4'>
            <h4>Total Pets Posted</h4>
            <h2>{pets.length}</h2>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card p-4'>
            <h4>Pending Requests</h4>
            <h2>{requests.filter(r => r.status === 'Pending').length}</h2>
          </div>
        </div>
      </div>

      <div className='mt-5'>
        <h3>Manage Pets <Link to="/create-pet" className="btn btn-sm btn-primary ms-3">Add New</Link></h3>
        <table className="table table-bordered mt-3">
          <thead>
            <tr><th>Name</th><th>Breed</th><th>Status</th><th>Adopter Review</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {pets.map(pet => (
              <tr key={pet.id}>
                {editingPet === pet.id ? (
                  <td colSpan="5">
                    <form onSubmit={handleEditSubmit} className="p-3 border rounded bg-light">
                      <div className="row mb-2">
                        <div className="col-md-3">
                          <label>Name</label>
                          <input className="form-control" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} required/>
                        </div>
                        <div className="col-md-3">
                          <label>Breed</label>
                          <input className="form-control" value={editForm.breed} onChange={e=>setEditForm({...editForm, breed: e.target.value})} required/>
                        </div>
                        <div className="col-md-3">
                          <label>Age</label>
                          <input type="number" className="form-control" value={editForm.age} onChange={e=>setEditForm({...editForm, age: parseInt(e.target.value) || 0})} required/>
                        </div>
                        <div className="col-md-3">
                          <label>Type</label>
                          <select className="form-control" value={editForm.type} onChange={e=>setEditForm({...editForm, type: e.target.value})} required>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-3">
                          <label>Gender</label>
                          <select className="form-control" value={editForm.gender} onChange={e=>setEditForm({...editForm, gender: e.target.value})} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label>Health Status</label>
                          <input className="form-control" value={editForm.healthStatus} onChange={e=>setEditForm({...editForm, healthStatus: e.target.value})} required/>
                        </div>
                        <div className="col-md-3">
                          <label>Location</label>
                          <input className="form-control" value={editForm.location} onChange={e=>setEditForm({...editForm, location: e.target.value})} required/>
                        </div>
                        <div className="col-md-3">
                          <label>Description</label>
                          <input className="form-control" value={editForm.description} onChange={e=>setEditForm({...editForm, description: e.target.value})} required/>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success btn-sm">Save</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingPet(null)}>Cancel</button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td>{pet.name}</td>
                    <td>{pet.breed}</td>
                    <td><span className={`badge ${pet.status === 'Adopted' ? 'bg-success' : pet.status === 'Approved' ? 'bg-info text-dark' : 'bg-warning'}`}>{pet.status}</span></td>
                    <td>
                      {pet.reviewComment ? (
                        <div>
                          <strong>Rating:</strong> {pet.reviewRating}/5 <br/>
                          <em>"{pet.reviewComment}"</em>
                        </div>
                      ) : (
                        <span className='text-muted'>No review yet</span>
                      )}
                    </td>
                    <td>
                      <button className='btn btn-sm btn-warning me-2' onClick={() => handleEditClick(pet)}>Edit</button>
                      <button className='btn btn-sm btn-danger' onClick={() => handleDelete(pet.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {pets.length === 0 && <tr><td colSpan="5" className="text-center">You haven't posted any pets yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className='mt-5 mb-5'>
        <h3>Pending Adoption Requests</h3>
        <div className='list-group mt-3'>
          {requests.filter(req => req.status === 'Pending').map(req => (
            <div key={req.id} className='list-group-item p-4 mb-2 border rounded shadow-sm'>
              <div className='d-flex justify-content-between align-items-start'>
                <div>
                  <h5 className='text-primary'>Request for Pet: {req.petName} (ID: {req.petId})</h5>
                  <p className='mb-1'><strong>Adopter:</strong> {req.adopterName} ({req.adopterEmail})</p>
                  <p className='mb-1'><strong>Status:</strong> <span className={`badge bg-warning`}>{req.status}</span></p>
                  
                  <div className='mt-3 p-3 bg-light rounded border'>
                    <h6 className='text-muted mb-2'>Adopter's History / Experience:</h6>
                    <p className='mb-0' style={{ whiteSpace: 'pre-wrap' }}>{req.message}</p>
                  </div>
                </div>
                
                <div className='d-flex flex-column gap-2 ms-3'>
                  <button className='btn btn-success' onClick={() => handleRequest(req.id, 'approve')}>Approve</button>
                  <button className='btn btn-outline-danger' onClick={() => handleRequest(req.id, 'reject')}>Reject</button>
                </div>
              </div>
            </div>
          ))}
          {requests.filter(req => req.status === 'Pending').length === 0 && <div className='alert alert-info'>No pending adoption requests.</div>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
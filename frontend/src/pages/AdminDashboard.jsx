import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import API from '../api/axios'
import { useSignalR } from '../context/SignalRContext'

function AdminDashboard(){
  const [pendingPets, setPendingPets] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const { subscribe } = useSignalR()

  useEffect(() => {
    fetchPending()
    fetchPendingUsers()

    // Auto-refresh when a new pet is submitted by an owner
    const unsubPet = subscribe('PetPending', () => {
      toast.info('📋 A new pet post needs approval!')
      fetchPending()
    })
    // Auto-refresh when a new user registers and needs approval
    const unsubUser = subscribe('UserPending', () => {
      toast.info('👤 A new shelter account needs approval!')
      fetchPendingUsers()
    })

    return () => { unsubPet(); unsubUser() }
  }, [])

  const fetchPending = async () => {
    try {
      const { data } = await API.get('/Pet/pending')
      setPendingPets(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPendingUsers = async () => {
    try {
      const { data } = await API.get('/Auth/pending')
      setPendingUsers(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleApprovePet = async (id) => {
    try {
      await API.post(`/Pet/approve?id=${id}`)
      toast.success('Pet Approved')
      fetchPending()
    } catch(err) {
      toast.error('Failed to approve')
    }
  }

  const handleRejectPet = async (id) => {
    try {
      await API.post(`/Pet/reject?id=${id}`)
      toast.success('Pet Rejected')
      fetchPending()
    } catch(err) {
      toast.error('Failed to reject')
    }
  }

  const handleApproveUser = async (id) => {
    try {
      await API.post(`/Auth/approve?id=${id}`)
      toast.success('User Approved')
      fetchPendingUsers()
    } catch(err) {
      toast.error('Failed to approve user')
    }
  }

  const handleRejectUser = async (id) => {
    try {
      await API.post(`/Auth/reject?id=${id}`)
      toast.success('User Rejected')
      fetchPendingUsers()
    } catch(err) {
      toast.error('Failed to reject user')
    }
  }

  return(
    <div className='container mt-5'>
      <h1>Admin Dashboard</h1>

      {/* Pending User Approvals */}
      <h3 className='mt-4'>Pending Account Approvals (Shelters / Pet Owners)</h3>
      {pendingUsers.length === 0 ? <p>No pending accounts.</p> : pendingUsers.map(user => (
        <div key={user.id} className='card p-3 mt-3'>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h5>{user.name}</h5>
              <p className='mb-0'>Email: {user.email} | Role: {user.role}</p>
            </div>
            <div className='d-flex gap-2'>
              <button className='btn btn-success' onClick={() => handleApproveUser(user.id)}>Approve</button>
              <button className='btn btn-danger' onClick={() => handleRejectUser(user.id)}>Reject</button>
            </div>
          </div>
        </div>
      ))}

      {/* Pending Pet Approvals */}
      <h3 className='mt-5'>Pending Pet Post Approvals</h3>
      {pendingPets.length === 0 ? <p>No pending pets.</p> : pendingPets.map(pet => (
        <div key={pet.id} className='card p-3 mt-3'>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h5>{pet.name}</h5>
              <p className='mb-0'>Breed: {pet.breed} | Location: {pet.location}</p>
            </div>
            <div className='d-flex gap-2'>
              <button className='btn btn-success' onClick={() => handleApprovePet(pet.id)}>Approve</button>
              <button className='btn btn-danger' onClick={() => handleRejectPet(pet.id)}>Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
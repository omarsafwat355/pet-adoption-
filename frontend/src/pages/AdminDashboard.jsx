function AdminDashboard(){

  return(
    <div className='container mt-5'>
      <h1>Admin Dashboard</h1>

      <div className='card p-4 mt-4'>
        <h3>Pending Approvals</h3>

        <div className='d-flex gap-2 mt-3'>
          <button className='btn btn-success'>
            Approve
          </button>

          <button className='btn btn-danger'>
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
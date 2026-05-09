function Dashboard(){

  return(
    <div className='container mt-5'>
      <h1>Dashboard</h1>

      <div className='row mt-4'>
        <div className='col-md-4'>
          <div className='card p-4'>
            <h4>Total Pets</h4>
            <h2>12</h2>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card p-4'>
            <h4>Requests</h4>
            <h2>8</h2>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='card p-4'>
            <h4>Favorites</h4>
            <h2>5</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
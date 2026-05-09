import { useState, useEffect } from 'react'
import PetCard from '../components/PetCard'
import API from '../api/axios'

function Home(){

  const [pets, setPets] = useState([])
  const [search,setSearch] = useState({
    type: '',
    breed: '',
    age: '',
    location: ''
  })

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await API.get('/Pet')
        setPets(data)
      } catch (error) {
        console.error("Error fetching pets", error)
      }
    }
    fetchPets()
  }, [])

  const filteredPets = pets.filter((pet)=> {
    return (
      (search.type === '' || pet.type?.toLowerCase().includes(search.type.toLowerCase())) &&
      (search.breed === '' || pet.breed?.toLowerCase().includes(search.breed.toLowerCase())) &&
      (search.age === '' || pet.age?.toString() === search.age) &&
      (search.location === '' || pet.location?.toLowerCase().includes(search.location.toLowerCase()))
    )
  })

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value })
  }

  return(
    <div className='container mt-5'>

      <div className='mb-4 p-4 card'>
        <h2>Search Pets</h2>
        <div className='row'>
          <div className='col-md-3'>
            <input name='type' className='form-control' placeholder='Animal Type (e.g. Dog)' onChange={handleChange} />
          </div>
          <div className='col-md-3'>
            <input name='breed' className='form-control' placeholder='Breed' onChange={handleChange} />
          </div>
          <div className='col-md-3'>
            <input name='age' type='number' className='form-control' placeholder='Age' onChange={handleChange} />
          </div>
          <div className='col-md-3'>
            <input name='location' className='form-control' placeholder='Location' onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className='row'>
        {filteredPets.length > 0 ? filteredPets.map((pet)=>(
          <PetCard key={pet.id} pet={pet}/>
        )) : <p>No pets found matching your search.</p>}
      </div>
    </div>
  )
}

export default Home
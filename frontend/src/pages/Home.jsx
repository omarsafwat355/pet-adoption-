import { useState } from 'react'
import PetCard from '../components/PetCard'

function Home(){

  const [search,setSearch] = useState('')

  const pets = [
    {
      id:1,
      petName:'Bella',
      breed:'Golden Retriever',
      location:'Cairo',
      imageUrl:'https://placehold.co/600x400'
    },
    {
      id:2,
      petName:'Rocky',
      breed:'Husky',
      location:'Alexandria',
      imageUrl:'https://placehold.co/600x400'
    },
    {
      id:3,
      petName:'Luna',
      breed:'Persian Cat',
      location:'Giza',
      imageUrl:'https://placehold.co/600x400'
    }
  ]

  const filteredPets = pets.filter((pet)=>
    pet.petName.toLowerCase().includes(search.toLowerCase())
  )

  return(
    <div className='container mt-5'>

      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Available Pets</h1>

        <input
          type='text'
          className='form-control w-25'
          placeholder='Search...'
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      <div className='row'>
        {filteredPets.map((pet)=>(
          <PetCard key={pet.id} pet={pet}/>
        ))}
      </div>
    </div>
  )
}

export default Home
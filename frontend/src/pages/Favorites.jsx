import { useState, useEffect } from 'react'
import API from '../api/axios'
import PetCard from '../components/PetCard'

function Favorites(){
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    fetchFavs()
  }, [])

  const fetchFavs = async () => {
    try {
      const { data } = await API.get('/Favorite')
      setFavorites(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  return(
    <div className='container mt-5'>
      <h1>Favorites</h1>

      <div className='row mt-4'>
        {favorites.length === 0 ? (
          <div className='card p-4'>No favorite pets yet.</div>
        ) : (
          favorites.map(fav => <PetCard key={fav.id} pet={fav.pet || fav} />)
        )}
      </div>
    </div>
  )
}

export default Favorites
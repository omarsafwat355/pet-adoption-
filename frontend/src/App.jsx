import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Favorites from './pages/Favorites'
import PetDetails from './pages/PetDetails'
import CreatePet from './pages/CreatePet'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import { ToastContainer } from 'react-toastify'

function App(){
  return(
    <BrowserRouter>
      <Navbar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/pet/:id' element={<PetDetails/>}/>

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>

        <Route path='/favorites' element={
          <ProtectedRoute>
            <Favorites/>
          </ProtectedRoute>
        }/>

        <Route path='/create-pet' element={
          <ProtectedRoute>
            <CreatePet/>
          </ProtectedRoute>
        }/>

        <Route path='/admin' element={
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
        }/>
      </Routes>

      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Favorites from './pages/Favorites'
import PetDetails from './pages/PetDetails'
import CreatePet from './pages/CreatePet'
import AdoptedPets from './pages/AdoptedPets'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import { ToastContainer, toast } from 'react-toastify'
import { SignalRProvider, useSignalR } from './context/SignalRContext'
import { useEffect } from 'react'

// Inner component so it can use useSignalR hook inside SignalRProvider
function AppContent() {
  const { subscribe } = useSignalR()

  useEffect(() => {
    const unsub = subscribe('ReceiveNotification', (message) => {
      toast.info(`🔔 ${message}`)
    })
    return unsub
  }, [subscribe])

  return (
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

        <Route path='/adopted' element={
          <ProtectedRoute>
            <AdoptedPets/>
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

function App() {
  return (
    <SignalRProvider>
      <AppContent/>
    </SignalRProvider>
  )
}

export default App
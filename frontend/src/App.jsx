import { useEffect } from 'react'
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
import * as signalR from '@microsoft/signalr'

function App(){

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7207/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err));

    connection.on("ReceiveNotification", (message) => {
      toast.info(`New Notification: ${message}`);
    });

    return () => {
      connection.stop();
    }
  }, [])
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

export default App
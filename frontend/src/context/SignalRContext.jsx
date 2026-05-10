import { createContext, useContext, useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'

const SignalRContext = createContext(null)

export const SignalRProvider = ({ children }) => {
  const connectionRef = useRef(null)
  const listenersRef = useRef({})  // { eventName: [callback, ...] }

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7207/notificationHub')
      .withAutomaticReconnect()
      .build()

    connection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Error:', err))

    // Route all incoming events to registered listeners
    const knownEvents = ['PetPending', 'PetApproved', 'PetRejected', 'NewAdoptionRequest', 'AdoptionStatusChanged', 'ReceiveNotification']
    knownEvents.forEach(event => {
      connection.on(event, (...args) => {
        const callbacks = listenersRef.current[event] || []
        callbacks.forEach(cb => cb(...args))
      })
    })

    connectionRef.current = connection
    return () => connection.stop()
  }, [])

  const subscribe = (event, callback) => {
    if (!listenersRef.current[event]) listenersRef.current[event] = []
    listenersRef.current[event].push(callback)
    // Return unsubscribe function
    return () => {
      listenersRef.current[event] = (listenersRef.current[event] || []).filter(cb => cb !== callback)
    }
  }

  return (
    <SignalRContext.Provider value={{ subscribe }}>
      {children}
    </SignalRContext.Provider>
  )
}

export const useSignalR = () => useContext(SignalRContext)

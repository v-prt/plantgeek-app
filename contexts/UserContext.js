import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../constants'
import * as SecureStore from 'expo-secure-store'

const storeToken = async (key, value) => {
  await SecureStore.setItemAsync(key, value)
}

const deleteToken = async key => {
  await SecureStore.deleteItemAsync(key)
}

export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('plantgeekToken')
      setToken(token)
    }
    getToken()
  }, [])

  // LOGIN
  const handleLogin = async values => {
    try {
      const res = await axios.post(`${API_URL}/login`, values)
      storeToken('plantgeekToken', res.data.token)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      return { error: err.response.data }
    }
  }

  // VERIFY TOKEN AND SET CURRENT USER ID
  const verifyToken = async token => {
    try {
      const res = await axios.post(`${API_URL}/token`, { token })
      if (res.status === 200) {
        setCurrentUserId(res.data.user._id)
      } else {
        // something wrong with token
        deleteToken('plantgeekToken')
        setCurrentUserId(undefined)
      }
    } catch (err) {
      // something wrong with token
      deleteToken('plantgeekToken')
      setCurrentUserId(undefined)
    }
  }

  useEffect(() => {
    if (token) {
      verifyToken(token)
    }
  }, [token])

  // LOGOUT
  const handleLogout = () => {
    deleteToken('plantgeekToken')
    setCurrentUserId(undefined)
  }

  return (
    <UserContext.Provider
      value={{
        token,
        handleLogin,
        handleLogout,
        authenticated: !!currentUserId,
      }}>
      {children}
    </UserContext.Provider>
  )
}

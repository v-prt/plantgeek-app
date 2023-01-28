import { createContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import * as SecureStore from 'expo-secure-store'
import * as Haptics from 'expo-haptics'

const storeToken = async (key, value) => {
  await SecureStore.setItemAsync(key, value)
}

const deleteToken = async key => {
  await SecureStore.deleteItemAsync(key)
}

export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const queryClient = new useQueryClient()
  const [token, setToken] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)

  const { data: currentUser, status: userStatus } = useQuery(
    ['current-user', currentUserId],
    async () => {
      if (currentUserId) {
        const { data } = await axios.get(`${API_URL}/users/${currentUserId}`)
        return data.user
      } else return null
    }
  )

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('plantgeekToken')
      setToken(token)
    }
    getToken()
  }, [])

  // SIGNUP
  const handleSignup = async values => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    try {
      const res = await axios.post(`${API_URL}/users`, values)
      storeToken('plantgeekToken', res.data.token)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      return { error: err.response.data }
    }
  }

  // LOGIN
  // FIXME: error occurs when signing out then logging back in - currentUser is undefined on UserProfile
  const handleLogin = async values => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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

  // UPDATE CURRENT USER DATA
  const updateCurrentUser = async data => {
    try {
      const res = await axios.put(`${API_URL}/users/${currentUser._id}`, data)
      queryClient.invalidateQueries('current-user')
      return res.data
    } catch (err) {
      console.log(err)
      return { error: err.response.data.message }
    }
  }

  // LOGOUT
  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    deleteToken('plantgeekToken')
    setCurrentUserId(undefined)
  }

  return (
    <UserContext.Provider
      value={{
        token,
        currentUserId,
        currentUser,
        userStatus,
        handleSignup,
        handleLogin,
        updateCurrentUser,
        handleLogout,
        authenticated: !!currentUserId,
      }}>
      {children}
    </UserContext.Provider>
  )
}

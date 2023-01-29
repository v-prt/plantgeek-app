import { createContext, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'
import { API_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET_USERS } from '../constants'

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

  // UPLOAD PROFILE IMAGE
  const uploadProfileImage = async file => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET_USERS)

    await axios
      .post(cloudinaryUrl, formData)
      .then(res => {
        const imageUrl = res.data.secure_url

        axios
          .put(`${API_URL}/users/${currentUserId}`, { imageUrl })
          .then(() => {
            queryClient.invalidateQueries('current-user')
          })
          .catch(err => {
            console.log(err)
            Alert.alert('Internal Server Error', 'Something went wrong. Please try again later.')
          })
      })
      .catch(err => {
        console.log(err)
        Alert.alert('Image Upload Error', 'Something went wrong. Please try again later.')
      })
  }

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

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    deleteToken('plantgeekToken')
    setCurrentUserId(undefined)
    axios.delete(`${API_URL}/users/${currentUser._id}`).catch(err => console.log(err))
    // TODO: show loading/success screen ("Your account has been deleted and you've signed out." - press ok to go back to login screen)
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
        uploadProfileImage,
        updateCurrentUser,
        handleLogout,
        handleDeleteAccount,
        authenticated: !!currentUserId,
      }}>
      {children}
    </UserContext.Provider>
  )
}

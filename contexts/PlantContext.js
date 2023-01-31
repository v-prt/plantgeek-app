import { useNavigation } from '@react-navigation/native'
import { createContext, useState } from 'react'
import { useQueryClient } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import * as Haptics from 'expo-haptics'
import { Alert } from 'react-native'

export const PlantContext = createContext(null)

export const PlantProvider = ({ children }) => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({ sort: 'name-asc' })
  const [duplicatePlant, setDuplicatePlant] = useState(undefined)
  const [fetching, setFetching] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const fetchPlants = async ({ pageParam }) => {
    setFetching(true)
    const res = await axios.get(`${API_URL}/plants/${pageParam || 1}`, {
      params: formData,
    })
    setTotalResults(res.data?.totalResults)
    setFetching(false)
    return res.data
  }

  const fetchPendingPlants = async ({ pageParam }) => {
    const res = await axios.get(`${API_URL}/plants-to-review/${pageParam || 1}`)
    return res.data
  }

  const deletePlant = async plantId => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    await axios
      .delete(`${API_URL}/plants/${plantId}`)
      .then(() => {
        Alert.alert('Success', 'The plant has been deleted.')
        navigation.navigate('Browse')
      })
      .catch(err => {
        console.log(err)
        Alert.alert('Internal Server Error', 'Something went wrong. Please try again later.')
      })
    queryClient.invalidateQueries('plants')
    queryClient.invalidateQueries('plant')
  }

  return (
    <PlantContext.Provider
      value={{
        formData,
        setFormData,
        fetchPlants,
        fetchPendingPlants,
        duplicatePlant,
        setDuplicatePlant,
        deletePlant,
        fetching,
        totalResults,
      }}>
      {children}
    </PlantContext.Provider>
  )
}

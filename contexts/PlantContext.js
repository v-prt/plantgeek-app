import { createContext, useState } from 'react'
import axios from 'axios'
import { REACT_APP_API_URL } from '@env'
const API_URL = REACT_APP_API_URL

export const PlantContext = createContext(null)

export const PlantProvider = ({ children }) => {
  const [formData, setFormData] = useState({ sort: 'name-asc' })
  const [duplicatePlant, setDuplicatePlant] = useState(undefined)

  const fetchPlants = async ({ pageParam }) => {
    const res = await axios.get(`${API_URL}/plants/${pageParam || 1}`, {
      params: formData,
    })
    return res.data
  }

  const fetchPendingPlants = async ({ pageParam }) => {
    const res = await axios.get(`${API_URL}/plants-to-review/${pageParam || 1}`)
    return res.data
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
      }}>
      {children}
    </PlantContext.Provider>
  )
}

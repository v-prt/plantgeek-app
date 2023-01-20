import { createContext, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../constants'

export const PlantContext = createContext(null)

export const PlantProvider = ({ children }) => {
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

  return (
    <PlantContext.Provider
      value={{
        formData,
        setFormData,
        fetchPlants,
        fetchPendingPlants,
        duplicatePlant,
        setDuplicatePlant,
        fetching,
        totalResults,
      }}>
      {children}
    </PlantContext.Provider>
  )
}

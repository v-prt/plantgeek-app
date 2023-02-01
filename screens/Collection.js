import { useContext } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { PlantList } from '../components/PlantList'

export const Collection = () => {
  const { currentUser } = useContext(UserContext)

  const { data, status } = useQuery(['collection', currentUser.plantCollection], async () => {
    try {
      const { data } = await axios.get(`${API_URL}/collection/${currentUser._id}`)
      return data.collection
    } catch (err) {
      return null
    }
  })

  return (
    <View style={styles.screen}>
      {status === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary100} />
        </View>
      )}
      {status === 'success' && <PlantList plants={data} listType='collection' />}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

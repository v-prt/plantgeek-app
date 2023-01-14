import { StyleSheet, FlatList } from 'react-native'
import { PlantCard } from './PlantCard'

export const PlantList = ({ plants }) => {
  return (
    <FlatList
      data={plants}
      renderItem={({ item }) => <PlantCard plant={item} />}
      keyExtractor={item => item._id}
      style={styles.list}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    padding: 8,
  },
})

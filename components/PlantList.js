import { StyleSheet, FlatList } from 'react-native'
import { PlantCard } from './PlantCard'

export const PlantList = ({ plants }) => {
  return (
    <FlatList
      data={plants}
      renderItem={({ item }) => <PlantCard plant={item} />}
      keyExtractor={item => item._id}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    padding: 10,
  },
})

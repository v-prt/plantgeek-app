import { StyleSheet, FlatList } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { PlantCard } from './PlantCard'

export const PlantList = ({ plants, infiniteScroll }) => {
  return (
    <FlatList
      data={plants}
      renderItem={({ item }) => <PlantCard plant={item} />}
      keyExtractor={item => item._id}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
      onEndReachedThreshold={0.5}
      onEndReached={infiniteScroll}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.primary300,
    width: '100%',
    padding: 10,
  },
})

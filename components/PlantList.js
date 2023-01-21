import { StyleSheet, FlatList, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { PlantCard } from './PlantCard'

export const PlantList = ({ plants, handleScroll, infiniteScroll }) => {
  return plants?.length > 0 ? (
    <FlatList
      data={plants}
      renderItem={({ item }) => <PlantCard plant={item} />}
      keyExtractor={item => item._id}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
      onEndReachedThreshold={0.5}
      onEndReached={infiniteScroll}
      onScroll={handleScroll}
    />
  ) : (
    <View style={styles.noResultsWrapper}>
      <Text style={styles.noResultsText}>No results.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.primary800,
    width: '100%',
    padding: 10,
  },
  noResultsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    opacity: 0.5,
    fontSize: 16,
  },
})

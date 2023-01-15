import { useContext } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { useInfiniteQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
import { PlantContext } from '../contexts/PlantContext'
import { PlantList } from '../components/PlantList'

export const Browse = () => {
  const { formData, fetchPlants } = useContext(PlantContext)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants', formData], fetchPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  const handleScroll = () => {
    // TODO: Implement infinite scroll
  }

  return (
    <View style={styles.screen}>
      {status === 'loading' && <ActivityIndicator size='large' color={COLORS.primary100} />}
      {status === 'success' && (
        // TODO: error/no results
        <PlantList
          onScroll={handleScroll}
          plants={data.pages.map(group => group.plants.map(plant => plant)).flat()}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

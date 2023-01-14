import { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useInfiniteQuery } from 'react-query'
import { COLORS } from '../GlobalStyles'
import { PlantContext } from '../contexts/PlantContext'

export const Browse = () => {
  const { formData, fetchPlants } = useContext(PlantContext)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(['plants', formData], fetchPlants, {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    })

  console.log(data)

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Browse</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
  },
})

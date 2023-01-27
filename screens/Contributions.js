import { useContext } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { PlantList } from '../components/PlantList'

// TODO: add 2 separate lists (pending, approved) and a toggle to switch between them
export const Contributions = ({ reviewStatus = 'approved' }) => {
  const { currentUser } = useContext(UserContext)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery(
      [`${reviewStatus}-contributions`, currentUser._id],
      async ({ pageParam }) => {
        const res = await axios.get(
          `${API_URL}/contributions/${currentUser._id}/${pageParam || 1}`,
          {
            params: { review: reviewStatus },
          }
        )
        return res.data
      },
      {
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
      }
    )

  // fetch more plants when scrolled to end
  const handleInfiniteScroll = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <View style={styles.screen}>
      {status === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary100} />
        </View>
      )}
      {status === 'success' && (
        <PlantList
          plants={data.pages.map(group => group.contributions.map(plant => plant)).flat()}
          infiniteScroll={handleInfiniteScroll}
        />
      )}
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

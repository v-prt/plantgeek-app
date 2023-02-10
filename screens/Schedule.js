import { useContext } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { RemindersList } from '../components/reminders/RemindersList'

export const Schedule = () => {
  const { currentUser } = useContext(UserContext)

  const { data, status, hasNextPage, isFetchingNextPage } = useQuery(
    ['reminders'],
    async ({ pageParam }) => {
      try {
        const { data } = await axios.get(
          `${API_URL}/reminders/${currentUser._id}/${pageParam || 1}`
        )
        return data.reminders
      } catch (err) {
        return null
      }
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  )

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
        <RemindersList reminders={data} handleInfiniteScroll={handleInfiniteScroll} />
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

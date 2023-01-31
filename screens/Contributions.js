import { useContext, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import { StyleSheet, View, Pressable, Text, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { PlantList } from '../components/PlantList'

const Approved = ({ currentUser }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ['approved-contributions', currentUser._id],
    async ({ pageParam }) => {
      const res = await axios.get(`${API_URL}/contributions/${currentUser._id}/${pageParam || 1}`, {
        params: { review: 'approved' },
      })
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
    <View style={styles.list}>
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

const Pending = ({ currentUser }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ['pending-contributions', currentUser._id],
    async ({ pageParam }) => {
      const res = await axios.get(`${API_URL}/contributions/${currentUser._id}/${pageParam || 1}`, {
        params: { review: 'pending' },
      })
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
    <View style={styles.list}>
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

export const Contributions = () => {
  const { currentUser } = useContext(UserContext)
  const [view, setView] = useState('approved')

  return (
    <View style={styles.screen}>
      <View style={styles.toggleWrapper}>
        <Pressable
          onPress={() => setView('approved')}
          style={[styles.toggleBtn, view === 'approved' && styles.activeBtn]}>
          <Text style={[styles.btnText, view === 'approved' && styles.activeText]}>Approved</Text>
        </Pressable>
        <Pressable
          onPress={() => setView('pending')}
          style={[styles.toggleBtn, view === 'pending' && styles.activeBtn]}>
          <Text style={[styles.btnText, view === 'pending' && styles.activeText]}>Pending</Text>
        </Pressable>
      </View>
      {view === 'approved' && <Approved currentUser={currentUser} />}
      {view === 'pending' && <Pending currentUser={currentUser} />}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  toggleBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  btnText: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  activeText: {
    fontFamily: 'Quicksand-Bold',
  },
})

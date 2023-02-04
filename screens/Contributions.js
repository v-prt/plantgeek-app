import { useContext, useEffect, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { UserContext } from '../contexts/UserContext'
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import { COLORS } from '../GlobalStyles'
import { PlantList } from '../components/PlantList'
import { IconButton } from '../components/ui/IconButton'
import { TextButton } from '../components/ui/TextButton'

const List = ({ currentUser, reviewStatus }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    [`${reviewStatus}-contributions`, currentUser._id],
    async ({ pageParam }) => {
      const res = await axios.get(`${API_URL}/contributions/${currentUser._id}/${pageParam || 1}`, {
        params: { review: reviewStatus },
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
          listType='contributions'
        />
      )}
    </View>
  )
}

export const Contributions = ({ navigation }) => {
  const { currentUser } = useContext(UserContext)
  const [view, setView] = useState('approved')
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon='info-outline'
          color={COLORS.primary100}
          onPress={() => setInfoModalVisible(true)}
        />
      ),
    })
  })

  return (
    <View style={styles.screen}>
      <View style={styles.toggles}>
        <Pressable
          onPress={() => setView('approved')}
          style={[styles.toggleButton, view === 'approved' && styles.activeBtn]}>
          <Text style={[styles.toggleText, view === 'approved' && styles.activeText]}>
            Approved
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setView('pending')}
          style={[styles.toggleButton, view === 'pending' && styles.activeBtn]}>
          <Text style={[styles.toggleText, view === 'pending' && styles.activeText]}>Pending</Text>
        </Pressable>
      </View>
      <List currentUser={currentUser} reviewStatus={view} />
      <Modal visible={infoModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Contributions</Text>
              <Pressable onPress={() => setInfoModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
            <Text style={styles.modalText}>
              If you're not able to find a specific plant, you can submit it to be added to
              plantgeek. Pending plants will be unlisted (private) but they may be added to your
              collection in order to set up watering reminders.
            </Text>
            <TextButton
              type='primary'
              onPress={() => {
                setInfoModalVisible(false)
                navigation.navigate('ManagePlant')
              }}
              icon='add'
              iconColor={COLORS.primary800}>
              Add New Plant
            </TextButton>
          </View>
        </SafeAreaView>
      </Modal>
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
  toggles: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  toggleButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  toggleText: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  activeText: {
    fontFamily: 'Quicksand-Bold',
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  modalWrapper: {
    backgroundColor: COLORS.primary800,
    flex: 1,
  },
  modalInner: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
  },
  modalText: {
    marginVertical: 30,
    fontSize: 18,
  },
})

import { useContext, useRef, useState } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  View,
  TextInput,
  Keyboard,
} from 'react-native'
import { useInfiniteQuery } from 'react-query'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../GlobalStyles'
import { PlantContext } from '../contexts/PlantContext'
import { DynamicHeader } from '../components/ui/DynamicHeader'
import { PlantList } from '../components/PlantList'
import { IconButton } from '../components/ui/IconButton'
import { Formik } from 'formik'

export const Browse = ({ navigation }) => {
  const { formData, setFormData, fetchPlants } = useContext(PlantContext)
  const submitRef = useRef(0)
  const [scrolledPastTop, setScrolledPastTop] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ['plants', formData],
    fetchPlants,
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  )

  // search plants based on input
  const handleSubmit = async values => {
    submitRef.current++
    const thisSubmit = submitRef.current
    setTimeout(() => {
      if (thisSubmit === submitRef.current) {
        setFormData({ ...formData, ...values })
      }
    }, 400)
  }

  // animate header based on scroll position
  const handleScroll = e => {
    if (e.nativeEvent.contentOffset.y > 60) {
      setScrolledPastTop(true)
    } else {
      setScrolledPastTop(false)
    }
  }

  // fetch more plants when scrolled to end
  const handleInfiniteScroll = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleFilterMenu = () => {
    navigation.navigate('Filter')
  }

  return (
    <SafeAreaView style={styles.screen}>
      <DynamicHeader scrolledPastTop={scrolledPastTop} />
      <View style={styles.searchBar}>
        <Formik initialValues={formData} onSubmit={handleSubmit}>
          {({ submitForm }) => (
            <>
              <View style={styles.searchInputWrapper}>
                <Ionicons name='search' size={20} color={COLORS.primary100} />
                <TextInput
                  style={styles.searchInput}
                  placeholder='Search houseplants'
                  placeholderTextColor='#999'
                  onSubmitEditing={Keyboard.dismiss}
                  onChangeText={e => {
                    // TODO: show list of suggestions while typing, and allow selection from list
                    setFormData({ ...formData, search: [e] })
                    submitForm()
                  }}
                  value={formData.search}
                />
              </View>
              <IconButton icon='filter' color={COLORS.primary100} onPress={handleFilterMenu} />
            </>
          )}
        </Formik>
      </View>
      {status === 'loading' && (
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={COLORS.primary100} />
        </View>
      )}
      {status === 'success' && (
        <PlantList
          plants={data.pages.map(group => group.plants.map(plant => plant)).flat()}
          handleScroll={handleScroll}
          infiniteScroll={handleInfiniteScroll}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
  },
  loading: {
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  searchBar: {
    backgroundColor: COLORS.primary800,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  searchInputWrapper: {
    backgroundColor: '#444',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  searchInput: {
    marginLeft: 8,
    color: COLORS.primary100,
    flex: 1,
  },
})

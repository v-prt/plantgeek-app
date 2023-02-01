import { useContext, useState } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native'
import { useInfiniteQuery } from 'react-query'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../GlobalStyles'
import { PlantContext } from '../contexts/PlantContext'
import { DynamicHeader } from '../components/ui/DynamicHeader'
import { PlantList } from '../components/PlantList'
import { SearchList } from '../components/SearchList'
import { IconButton } from '../components/ui/IconButton'

export const Browse = ({ navigation }) => {
  const { formData, setFormData, fetchPlants } = useContext(PlantContext)
  const [scrolledPastTop, setScrolledPastTop] = useState(false)
  const [searchVal, setSearchVal] = useState(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery(
    ['plants', formData],
    fetchPlants,
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  )

  const handleClearSearch = () => {
    setSearchVal(null)
    setFormData({ ...formData, search: null })
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
        <View style={styles.searchInputWrapper}>
          <Ionicons name='search' size={20} color={COLORS.primary100} />
          <TextInput
            style={styles.searchInput}
            placeholder='Search houseplants'
            placeholderTextColor='#999'
            selectionColor={COLORS.primary400}
            onBlur={Keyboard.dismiss}
            onChangeText={e => {
              if (e === '') {
                setFormData({ ...formData, search: null })
              }
              setSearchVal(e)
            }}
            value={searchVal || formData?.search?.[0] || ''}
          />
          {(searchVal || formData?.search?.[0]) && (
            <Pressable onPress={handleClearSearch}>
              <Ionicons name='close' size={20} color={COLORS.primary100} />
            </Pressable>
          )}
        </View>
        <View style={styles.buttons}>
          <IconButton icon='filter-list' color={COLORS.primary100} onPress={handleFilterMenu} />
          <IconButton
            icon='add'
            color={COLORS.primary100}
            onPress={() => navigation.navigate('ManagePlant')}
          />
        </View>
      </View>
      {searchVal ? (
        <SearchList
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          formData={formData}
          setFormData={setFormData}
        />
      ) : (
        <>
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
        </>
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
    color: COLORS.primary100,
    marginLeft: 8,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
  },
})

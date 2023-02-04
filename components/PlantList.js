import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, FlatList, KeyboardAvoidingView, ScrollView, View, Text } from 'react-native'
import { PlantContext } from '../contexts/PlantContext'
import { COLORS } from '../GlobalStyles'
import { PlantCard } from './PlantCard'
import { TextButton } from './ui/TextButton'

export const PlantList = ({ plants, handleScroll, infiniteScroll, listType }) => {
  const navigation = useNavigation()
  const { setFormData } = useContext(PlantContext)

  const noResultsText = () => {
    if (listType === 'collection') return 'No plants in collection yet.'
    if (listType === 'wishlist') return 'No plants in wishlist yet.'
    if (listType === 'search') return 'No results.'
    if (listType === 'contributions') return 'No contributions yet.'
  }

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
    <KeyboardAvoidingView
      style={styles.noResults}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.noResults} keyboardShouldPersistTaps='handled'>
        <Text style={styles.noResultsText}>{noResultsText()}</Text>
        {(listType === 'collection' || listType === 'wishlist') && (
          <TextButton
            type='primary'
            onPress={() => navigation.navigate('Browse')}
            icon='search'
            iconColor={COLORS.primary800}>
            Browse Plants
          </TextButton>
        )}
        {listType === 'search' && (
          <View style={styles.buttons}>
            <TextButton type='primary' onPress={() => setFormData({ sort: 'name-asc' })}>
              Clear Search
            </TextButton>
            <TextButton
              type='flat'
              onPress={() => navigation.navigate('ManagePlant')}
              icon='add'
              iconColor={COLORS.primary400}>
              Add New Plant
            </TextButton>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.primary800,
    width: '100%',
    padding: 10,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    opacity: 0.7,
    fontSize: 16,
    marginBottom: 15,
  },
})

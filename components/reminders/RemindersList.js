import { StyleSheet, FlatList, View, Text } from 'react-native'
import { ReminderItem } from './ReminderItem'
import { COLORS } from '../../GlobalStyles'

export const RemindersList = ({ reminders, infiniteScroll }) => {
  return reminders?.length > 0 ? (
    <FlatList
      data={reminders}
      renderItem={({ item }) => <ReminderItem reminder={item} />}
      keyExtractor={item => item._id}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
      onEndReachedThreshold={0.5}
      onEndReached={infiniteScroll}
    />
  ) : (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>No reminders yet.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.primary800,
    width: '100%',
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

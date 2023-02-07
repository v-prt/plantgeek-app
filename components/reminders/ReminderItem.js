import { StyleSheet, View, Text } from 'react-native'
import moment from 'moment'
import { COLORS } from '../../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'
import { MaterialIcons } from '@expo/vector-icons'

export const ReminderItem = ({ reminder }) => {
  // TODO: completion functionality, option to delete/edit
  return (
    <View style={styles.wrapper}>
      <ImageLoader
        style={styles.plantImage}
        source={{ uri: reminder.plantId.imageUrl }}
        borderRadius={8}
      />
      <View style={styles.text}>
        <Text style={styles.plantName}>{reminder.plantId.primaryName}</Text>
        <Text style={styles.plantSecondaryName}>{reminder.plantId.secondaryName}</Text>
        <View style={styles.reminderInfo}>
          <View style={styles.iconTextWrapper}>
            <MaterialIcons
              name='calendar-today'
              size={16}
              color={COLORS.primary100}
              style={styles.icon}
            />
            <Text>{moment(reminder.dateDue).format('ll')}</Text>
          </View>
          <Text style={styles.divider}>•</Text>
          <Text style={styles.reminderType}>{reminder.type}</Text>
          <Text style={styles.divider}>•</Text>
          <View style={styles.iconTextWrapper}>
            <MaterialIcons name='repeat' size={16} color={COLORS.primary100} style={styles.icon} />
            <Text>
              {reminder.frequencyNumber} {reminder.frequencyUnit}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantImage: {
    width: 75,
    height: 75,
    marginRight: 12,
  },
  text: {
    flex: 1,
    justifyContent: 'space-between',
  },
  plantName: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  plantSecondaryName: {
    fontSize: 14,
    marginBottom: 10,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  reminderType: {
    fontFamily: 'Quicksand-Bold',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 16,
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    marginHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
})

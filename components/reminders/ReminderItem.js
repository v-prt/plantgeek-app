import { useState, useEffect, useContext, useRef } from 'react'
import {
  StyleSheet,
  Animated,
  Pressable,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native'
import { useQueryClient } from 'react-query'
import moment from 'moment'
import { COLORS } from '../../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { API_URL } from '../../constants'
import { UserContext } from '../../contexts/UserContext'
import * as Haptics from 'expo-haptics'
import { RemindersForm } from './RemindersForm'

export const ReminderItem = ({ reminder, selectedItem, setSelectedItem }) => {
  const queryClient = new useQueryClient()
  const due = moment(reminder.dateDue).isBefore(new Date())

  const dateText = moment(reminder.dateDue).isSame(new Date(), 'day')
    ? 'Today'
    : moment(reminder.dateDue).isSame(moment().subtract(1, 'days'), 'day')
    ? 'Yesterday'
    : moment(reminder.dateDue).isSame(moment().add(1, 'days'), 'day')
    ? 'Tomorrow'
    : moment(reminder.dateDue).format('ll')

  const { currentUser } = useContext(UserContext)
  const [actionsVisible, setActionsVisible] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const heightAnim = useRef(new Animated.Value(0)).current
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [initialValues, setInitialValues] = useState({
    type: reminder.type,
    dateDue: reminder.dateDue,
    frequencyNumber: reminder.frequencyNumber,
    frequencyUnit: reminder.frequencyUnit,
  })

  useEffect(() => {
    if (selectedItem === reminder._id) {
      setActionsVisible(true)
    } else {
      setActionsVisible(false)
    }
  }, [selectedItem])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: actionsVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(heightAnim, {
        toValue: actionsVisible ? 50 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }, [actionsVisible])

  const handleComplete = async () => {
    //  TODO: smoothly animate the original reminder out of the list and new reminder in
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setLoading(true)

    try {
      await axios.put(`${API_URL}/reminders/${reminder._id}/complete`)
      queryClient.invalidateQueries('plant-reminders')
      queryClient.invalidateQueries('reminders')
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again later.')
      console.log(err)
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    // TODO: smoothly animate the deleted reminder away
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/reminders/${reminder._id}`)
              queryClient.invalidateQueries('plant-reminders')
              queryClient.invalidateQueries('reminders')
            } catch (err) {
              Alert.alert('Error', 'Something went wrong. Please try again later.')
              console.log(err)
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.reminderDetails, actionsVisible && styles.active]}
        onPress={() => setSelectedItem(selectedItem === reminder._id ? null : reminder._id)}>
        <ImageLoader
          style={styles.plantImage}
          source={{ uri: reminder.plantId.imageUrl }}
          borderRadius={8}
        />
        <View style={styles.text}>
          <Text style={styles.plantName}>{reminder.plantId.primaryName}</Text>
          <Text style={styles.plantSecondaryName}>{reminder.plantId.secondaryName}</Text>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderType}>{reminder.type}</Text>
            <Text style={styles.divider}>•</Text>
            <View style={styles.iconTextWrapper}>
              <MaterialIcons
                name='calendar-today'
                size={16}
                color={due ? COLORS.error : COLORS.primary100}
                style={styles.icon}
              />
              <Text style={[styles.infoText, due && styles.due]}>{dateText}</Text>
            </View>
            <Text style={styles.divider}>•</Text>
            <View style={styles.iconTextWrapper}>
              <MaterialIcons
                name='repeat'
                size={16}
                color={COLORS.primary100}
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                {reminder.frequencyNumber} {reminder.frequencyUnit}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            height: heightAnim,
          },
          styles.actions,
        ]}>
        <Pressable
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          onPress={() => handleComplete()}>
          {loading ? (
            <ActivityIndicator size='small' color={COLORS.primary400} />
          ) : (
            <MaterialIcons name='check' size='16' color={COLORS.primary400} />
          )}
          <Text style={[styles.actionText, styles.complete]}>Complete</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          onPress={() => setModalVisible(true)}>
          <MaterialIcons name='edit' size='16' color={COLORS.primary100} />
          <Text style={[styles.actionText, styles.edit]}>Edit</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
          onPress={() => handleDelete()}>
          <MaterialIcons name='delete' size='16' color={COLORS.error} />
          <Text style={[styles.actionText, styles.delete]}>Delete</Text>
        </Pressable>
      </Animated.View>

      <Modal visible={modalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Reminder</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
            <RemindersForm
              editMode={reminder._id}
              initialValues={initialValues}
              plant={{
                _id: reminder.plantId._id,
                primaryName: reminder.plantId.primaryName,
                imageUrl: reminder.plantId.imageUrl,
                water: reminder.plantId.water,
              }}
              currentUserId={currentUser._id}
              setModalVisible={setModalVisible}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  reminderDetails: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  plantImage: {
    width: 70,
    height: 70,
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
    marginTop: 3,
    opacity: 0.7,
  },
  reminderInfo: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  reminderType: {
    textTransform: 'uppercase',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Quicksand-Bold',
  },
  due: {
    color: COLORS.error,
  },
  divider: {
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  icon: {
    marginRight: 5,
  },
  actionText: {
    textAlign: 'center',
    color: COLORS.primary800,
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    marginLeft: 5,
  },
  complete: {
    color: COLORS.primary400,
  },
  edit: {
    color: COLORS.primary100,
  },
  delete: {
    color: COLORS.error,
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  modalWrapper: {
    backgroundColor: COLORS.primary800,
    padding: 20,
    flex: 1,
  },
  modalInner: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
  },
})

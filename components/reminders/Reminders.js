import { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import {
  StyleSheet,
  SafeAreaView,
  View,
  Modal,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native'
import { API_URL } from '../../constants'
import axios from 'axios'
import moment from 'moment'
import { UserContext } from '../../contexts/UserContext'
import { COLORS } from '../../GlobalStyles'
import { IconButton } from '../ui/IconButton'
import { RemindersForm } from './RemindersForm'
import { MaterialIcons } from '@expo/vector-icons'

const ExistingReminder = ({ type, reminders, setEditMode, setInitialValues, setModalVisible }) => {
  const reminder = reminders?.find(reminder => reminder.type === type)
  const due = moment(reminder?.dateDue).isBefore(new Date())

  const dateText = moment(reminder.dateDue).isSame(new Date(), 'day')
    ? 'Today'
    : moment(reminder.dateDue).isSame(moment().subtract(1, 'days'), 'day')
    ? 'Yesterday'
    : moment(reminder.dateDue).isSame(moment().add(1, 'days'), 'day')
    ? 'Tomorrow'
    : moment(reminder.dateDue).format('ll')

  return (
    <View style={styles.reminderWrapper}>
      <View>
        <Text style={styles.reminderText}>{type}</Text>
        <View style={styles.reminderInfo}>
          <View style={styles.iconTextWrapper}>
            <MaterialIcons
              name='calendar-today'
              size={16}
              color={due ? COLORS.warning : COLORS.primary100}
              style={styles.icon}
            />
            <Text style={due && styles.due}>{dateText}</Text>
          </View>
          <Text style={styles.divider}>•</Text>
          <View style={styles.iconTextWrapper}>
            <MaterialIcons name='repeat' size={16} color={COLORS.primary100} style={styles.icon} />
            <Text>
              {reminder.frequencyNumber} {reminder.frequencyUnit}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.reminderButtons}>
        <IconButton
          small
          icon='info-outline'
          color={COLORS.primary400}
          onPress={() => {
            setEditMode(reminder._id)
            setInitialValues({
              type,
              dateDue: reminder.dateDue,
              frequencyNumber: reminder.frequencyNumber,
              frequencyUnit: reminder.frequencyUnit,
            })
            setModalVisible(true)
          }}
        />
      </View>
    </View>
  )
}

const NewReminder = ({ type, setEditMode, setInitialValues, setModalVisible }) => {
  return (
    <View style={[styles.reminderWrapper, styles.newReminderWrapper]}>
      <Text style={[styles.reminderText, styles.newReminderText]}>{type}</Text>
      <IconButton
        small
        icon='add-alert'
        color={COLORS.primary100}
        onPress={() => {
          setEditMode(false)
          setInitialValues({
            type,
            dateDue: new Date(),
            frequencyNumber: 1,
            frequencyUnit: 'Days',
          })
          setModalVisible(true)
        }}
      />
    </View>
  )
}

export const Reminders = ({ plant }) => {
  const { currentUser } = useContext(UserContext)
  const inCollection = currentUser.plantCollection?.includes(plant._id)
  const [editMode, setEditMode] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [initialValues, setInitialValues] = useState(undefined)

  const { data: reminders, status } = useQuery(['plant-reminders', plant._id], async () => {
    const { data } = await axios.get(`${API_URL}/plant-reminders/${plant._id}/${currentUser._id}`)
    return data.reminders
  })

  return inCollection ? (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Reminders</Text>
      {status === 'loading' && <ActivityIndicator size='small' color={COLORS.primary100} />}
      {status === 'success' && (
        <View style={styles.buttons}>
          {reminders?.find(reminder => reminder.type === 'water') ? (
            <ExistingReminder
              type='water'
              reminders={reminders}
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          ) : (
            <NewReminder
              type='water'
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          )}
          {reminders?.find(reminder => reminder.type === 'fertilize') ? (
            <ExistingReminder
              type='fertilize'
              reminders={reminders}
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          ) : (
            <NewReminder
              type='fertilize'
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          )}
          {reminders?.find(reminder => reminder.type === 'repot') ? (
            <ExistingReminder
              type='repot'
              reminders={reminders}
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          ) : (
            <NewReminder
              type='repot'
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          )}
        </View>
      )}

      <Modal visible={modalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Edit' : 'New'} Reminder</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
            <RemindersForm
              editMode={editMode}
              initialValues={initialValues}
              plant={plant}
              currentUserId={currentUser._id}
              setModalVisible={setModalVisible}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  ) : null
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    marginBottom: 20,
  },
  reminderWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  reminderText: {
    textTransform: 'capitalize',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  reminderInfo: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  divider: {
    marginHorizontal: 10,
  },
  due: {
    color: COLORS.warning,
  },
  newReminderWrapper: {
    borderStyle: 'dashed',
  },
  newReminderText: {
    opacity: 0.7,
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

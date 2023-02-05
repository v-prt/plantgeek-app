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
import { UserContext } from '../../contexts/UserContext'
import { COLORS } from '../../GlobalStyles'
import { IconButton } from '../ui/IconButton'
import { RemindersForm } from './RemindersForm'

const ExistingReminder = ({ type, reminders }) => {
  return (
    <View style={styles.reminderWrapper}>
      <Text style={styles.reminderText}>{type}</Text>
      <View style={styles.reminderButtons}>
        <IconButton
          icon='edit'
          onPress={() => {
            setEditMode(true)
            setInitialValues({
              type,
              dateDue: reminders?.find(reminder => reminder.type === type).dateDue,
              frequencyNumber: reminders?.find(reminder => reminder.type === type).frequencyNumber,
              frequencyOption: reminders?.find(reminder => reminder.type === type).frequencyOption,
            })
            setModalVisible(true)
          }}
        />
        <IconButton icon='delete' onPress={() => {}} />
        <IconButton icon='check' onPress={() => {}} />
      </View>
    </View>
  )
}

const NewReminder = ({ type, setEditMode, setInitialValues, setModalVisible }) => {
  return (
    <View style={[styles.reminderWrapper, styles.newReminderWrapper]}>
      <Text style={[styles.reminderText, styles.newReminderText]}>{type}</Text>
      <IconButton
        icon='add-alert'
        color={COLORS.primary400}
        onPress={() => {
          setEditMode(false)
          setInitialValues({
            type,
            dateDue: new Date(),
            frequencyNumber: 1,
            frequencyOption: 'Days',
          })
          setModalVisible(true)
        }}
        small
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

  const { data: reminders, status } = useQuery(['reminders'], async () => {
    const { data } = await axios.get(`${API_URL}/plant-reminders/${plant._id}/${currentUser._id}`)
    return data.reminders
  })

  return inCollection ? (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Schedule</Text>
      {status === 'loading' && <ActivityIndicator size='small' color={COLORS.primary100} />}
      {status === 'success' && (
        <View style={styles.buttons}>
          {/* TODO: 
              - if reminder is set for that type, click to open modal and edit/delete
              */}
          {reminders?.find(reminder => reminder.type === 'water') ? (
            <ExistingReminder type='water' reminders={reminders} />
          ) : (
            <NewReminder
              type='water'
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          )}
          {reminders?.find(reminder => reminder.type === 'fertilize') ? (
            <ExistingReminder type='fertilize' reminders={reminders} />
          ) : (
            <NewReminder
              type='fertilize'
              setEditMode={setEditMode}
              setInitialValues={setInitialValues}
              setModalVisible={setModalVisible}
            />
          )}
          {reminders?.find(reminder => reminder.type === 'repot') ? (
            <ExistingReminder type='repot' reminders={reminders} />
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
              <Text style={styles.modalTitle}>{editMode ? 'Edit' : 'New'} Schedule</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
            <RemindersForm editMode={editMode} initialValues={initialValues} plant={plant} />
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
    opacity: 0.7,
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

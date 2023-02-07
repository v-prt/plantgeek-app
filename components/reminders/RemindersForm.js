import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { StyleSheet, View, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { API_URL } from '../../constants'
import axios from 'axios'
import * as yup from 'yup'
import { COLORS } from '../../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'
import { MaterialIcons } from '@expo/vector-icons'
import { IconButton } from '../ui/IconButton'
import { TextButton } from '../ui/TextButton'
import * as Haptics from 'expo-haptics'

export const RemindersForm = ({
  editMode,
  initialValues,
  plant,
  currentUserId,
  setModalVisible,
}) => {
  const queryClient = new useQueryClient()
  const [selectedDate, setSelectedDate] = useState(new Date(initialValues.dateDue))
  const [recommendation, setRecommendation] = useState('')
  const [selectedNumber, setSelectedNumber] = useState(initialValues.frequencyNumber)
  const [selectedUnit, setSelectedUnit] = useState(initialValues.frequencyUnit)

  const minNumber = 1
  const maxNumber = 99
  const units = ['Days', 'Weeks', 'Months', 'Years']

  const schema = yup.object().shape({
    type: yup.string().required('Required'),
    dateDue: yup.date().required('Required'),
    frequencyNumber: yup.number().required('Required').min(minNumber).max(maxNumber),
    frequencyUnit: yup.string().required('Required'),
  })

  useEffect(() => {
    // SETTING RECOMMENDATION
    // TODO: refactor this to be more DRY
    // TODO: set initial values for frequencyNumber and frequencyUnit
    if (initialValues.type === 'water') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        setRecommendation('Water lightly every 3-5 days (when soil feels dry to touch)')
      } else if (plant.water === 'medium') {
        setRecommendation('Water moderately every 5-10 days (when soil partly dry)')
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        setRecommendation('Water generously every 10-14 days (when soil mostly dry)')
      }
    }

    if (initialValues.type === 'fertilize') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        setRecommendation('Fertilize every 2-4 weeks (with organic fertilizer)')
      } else if (plant.water === 'medium') {
        setRecommendation('Fertilize every 1-2 months (with organic fertilizer)')
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        setRecommendation('Fertilize every 2-3 months (with organic fertilizer)')
      }
    }

    if (initialValues.type === 'repot') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        // plants requiring more water tend to have a fast growth rate
        setRecommendation('Repot every 8-12 months depending on maturity (1-2 inches larger)')
      } else if (plant.water === 'medium') {
        // moderate growth rate
        setRecommendation('Repot every 12-18 months depending on maturity (1-2 inches larger)')
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        // slow growth rate
        setRecommendation('Repot every 2-3 years depending on maturity (1-2 inches larger)')
      }
    }
  }, [plant.water, initialValues.type])

  const handleNumberChange = (direction, setFieldValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (direction === 'increase') {
      if (selectedNumber < maxNumber) {
        setFieldValue('frequencyNumber', selectedNumber + 1)
        setSelectedNumber(selectedNumber + 1)
      }
    } else if (direction === 'decrease') {
      if (selectedNumber > minNumber) {
        setFieldValue('frequencyNumber', selectedNumber - 1)
        setSelectedNumber(selectedNumber - 1)
      }
    }
  }

  const handleUnitChange = (direction, setFieldValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (direction === 'increase') {
      if (units.indexOf(selectedUnit) < units.length - 1) {
        setFieldValue('frequencyUnit', units[units.indexOf(selectedUnit) + 1])
        setSelectedUnit(units[units.indexOf(selectedUnit) + 1])
      }
    } else if (direction === 'decrease') {
      if (units.indexOf(selectedUnit) > 0) {
        setFieldValue('frequencyUnit', units[units.indexOf(selectedUnit) - 1])
        setSelectedUnit(units[units.indexOf(selectedUnit) - 1])
      }
    }
  }

  const handleReminder = async values => {
    const data = {
      ...values,
      userId: currentUserId,
      plantId: plant._id,
    }

    if (editMode) {
      const reminderId = editMode
      // update reminder
      const result = await axios.put(`${API_URL}/reminders/${reminderId}`, data)
      queryClient.invalidateQueries('plant-reminders')
      if (result) setModalVisible(false)
    } else {
      // create reminder
      const result = await axios.post(`${API_URL}/reminders`, data)
      queryClient.invalidateQueries('plant-reminders')
      if (result) setModalVisible(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleReminder}>
      {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
        <>
          <View style={styles.plantInfo}>
            <ImageLoader
              style={styles.plantImage}
              source={{ uri: plant.imageUrl }}
              borderRadius={8}
            />
            <Text style={styles.plantName}>{plant.primaryName}</Text>
          </View>

          <Text style={styles.reminderType}>{initialValues.type}</Text>

          <View style={styles.datePicker}>
            <View style={styles.labelWrapper}>
              <MaterialIcons
                name='calendar-today'
                size={20}
                color={COLORS.primary400}
                style={styles.labelIcon}
              />
              <Text style={styles.labelText}>Due Date</Text>
            </View>
            <DateTimePicker
              testID='dateTimePicker'
              mode='date'
              value={selectedDate}
              is24Hour={true}
              accentColor={COLORS.primary400}
              style={{ flex: 1 }}
              onChange={(event, date) => {
                setSelectedDate(date)
                setFieldValue('dateDue', date)
              }}
            />
          </View>

          <View style={styles.frequencyWrapper}>
            <View style={styles.labelWrapper}>
              <MaterialIcons
                name='repeat'
                size={20}
                color={COLORS.primary400}
                style={styles.labelIcon}
              />
              <Text style={styles.labelText}>Frequency</Text>
            </View>
            <View style={styles.frequencyOptions}>
              <View style={styles.pickerWrapper}>
                <IconButton
                  small
                  icon='remove'
                  size={18}
                  color={COLORS.primary400}
                  style={styles.pickerIcon}
                  onPress={() => {
                    handleNumberChange('decrease', setFieldValue)
                  }}
                  disabled={selectedNumber === minNumber}
                />
                <Text style={styles.pickerText}>{values.frequencyNumber}</Text>
                <IconButton
                  small
                  icon='add'
                  size={18}
                  color={COLORS.primary400}
                  style={styles.pickerIcon}
                  onPress={() => {
                    handleNumberChange('increase', setFieldValue)
                  }}
                  disabled={selectedNumber === maxNumber}
                />
              </View>
              <View style={styles.pickerWrapper}>
                <IconButton
                  small
                  icon='remove'
                  size={18}
                  color={COLORS.primary400}
                  style={styles.pickerIcon}
                  onPress={() => {
                    handleUnitChange('decrease', setFieldValue)
                  }}
                  disabled={selectedUnit === 'Days'}
                />
                <Text style={styles.pickerText}>{values.frequencyUnit}</Text>
                <IconButton
                  small
                  icon='add'
                  size={18}
                  color={COLORS.primary400}
                  style={styles.pickerIcon}
                  onPress={() => {
                    handleUnitChange('increase', setFieldValue)
                  }}
                  disabled={selectedUnit === 'Years'}
                />
              </View>

              <View style={styles.recommendationWrapper}>
                <Text style={styles.smallLabel}>Recommendation</Text>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            </View>
          </View>

          <TextButton
            type='primary'
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}>
            Save
          </TextButton>
        </>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  plantInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  plantImage: {
    width: 75,
    height: 75,
    marginRight: 12,
  },
  plantName: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    flex: 1,
  },
  reminderType: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  datePicker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  labelIcon: {
    marginRight: 8,
  },
  labelText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  frequencyWrapper: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  frequencyOptions: {
    width: '100%',
    marginTop: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  recommendationWrapper: {
    marginTop: 20,
    marginHorizontal: 5,
  },
  smallLabel: {
    fontFamily: 'Quicksand-Bold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 16,
  },
})

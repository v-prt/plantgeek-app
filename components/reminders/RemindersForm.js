import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as yup from 'yup'
import { COLORS } from '../../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'
import { MaterialIcons } from '@expo/vector-icons'
import { IconButton } from '../ui/IconButton'
import { TextButton } from '../ui/TextButton'
import * as Haptics from 'expo-haptics'

export const RemindersForm = ({ initialValues, editMode, plant }) => {
  const [selectedDate, setSelectedDate] = useState(initialValues.dateDue)
  const [recommendation, setRecommendation] = useState('')
  const minNumber = 1
  const maxNumber = 99
  const options = ['Days', 'Weeks', 'Months', 'Years']
  const [selectedNumber, setSelectedNumber] = useState(initialValues.frequencyNumber)
  const [selectedOption, setSelectedOption] = useState(initialValues.frequencyOption)

  const schema = yup.object().shape({
    type: yup.string().required('Required'),
    dateDue: yup.date().required('Required'),
    frequencyNumber: yup.number().required('Required').min(minNumber).max(maxNumber),
    frequencyOption: yup.string().required('Required'),
  })

  useEffect(() => {
    // SETTING RECOMMENDATION
    // TODO: refactor this to be more DRY
    // TODO: set initial values for frequencyNumber and frequencyOption
    if (initialValues.type === 'water') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        setRecommendation('Water lightly every 3-5 days (when soil feels dry)')
      } else if (plant.water === 'medium') {
        setRecommendation('Water moderately every 5-10 days (when soil feels dry)')
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        setRecommendation('Water generously every 10-14 days (when soil feels dry)')
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
        setRecommendation('Repot every 6-8 months (1-2 inches larger)')
      } else if (plant.water === 'medium') {
        setRecommendation('Repot every 8-12 months (1-2 inches larger)')
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        setRecommendation('Repot every 1-2 years (1-2 inches larger)')
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

  const handleOptionChange = (direction, setFieldValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (direction === 'increase') {
      if (options.indexOf(selectedOption) < options.length - 1) {
        setFieldValue('frequencyOption', options[options.indexOf(selectedOption) + 1])
        setSelectedOption(options[options.indexOf(selectedOption) + 1])
      }
    } else if (direction === 'decrease') {
      if (options.indexOf(selectedOption) > 0) {
        setFieldValue('frequencyOption', options[options.indexOf(selectedOption) - 1])
        setSelectedOption(options[options.indexOf(selectedOption) - 1])
      }
    }
  }

  const handleReminder = values => {
    console.log(values)
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
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date
                setSelectedDate(currentDate)
                setFieldValue('dateDue', currentDate)
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
                    handleOptionChange('decrease', setFieldValue)
                  }}
                  disabled={selectedOption === 'Days'}
                />
                <Text style={styles.pickerText}>{values.frequencyOption}</Text>
                <IconButton
                  small
                  icon='add'
                  size={18}
                  color={COLORS.primary400}
                  style={styles.pickerIcon}
                  onPress={() => {
                    handleOptionChange('increase', setFieldValue)
                  }}
                  disabled={selectedOption === 'Years'}
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
    fontSize: 16,
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

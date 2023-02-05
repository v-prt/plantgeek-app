import { Formik } from 'formik'
import { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as yup from 'yup'
import { COLORS } from '../../GlobalStyles'
import { ImageLoader } from '../ui/ImageLoader'
import { MaterialIcons } from '@expo/vector-icons'

export const RemindersForm = ({ initialValues, editMode, plant }) => {
  const [date, setDate] = useState(new Date())

  const schema = yup.object().shape({
    type: yup.string().required('Required'),
    dateDue: yup.date().required('Required'),
    frequency: yup.string().required('Required'),
  })

  const reminderHandler = values => {
    console.log(values)
  }

  const recommendation = () => {
    if (initialValues.type === 'water') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        return 'Water lightly every 3-5 days (when soil feels dry)'
      } else if (plant.water === 'medium') {
        return 'Water moderately every 5-10 days (when soil feels dry)'
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        return 'Water generously every 10-14 days (when soil feels dry)'
      }
    }

    if (initialValues.type === 'fertilize') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        return 'Fertilize every 2-4 weeks (with organic fertilizer)'
      } else if (plant.water === 'medium') {
        return 'Fertilize every 1-2 months (with organic fertilizer)'
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        return 'Fertilize every 2-3 months (with organic fertilizer)'
      }
    }

    if (initialValues.type === 'repot') {
      if (plant.water === 'high' || plant.water === 'medium to high') {
        return 'Repot every 6-8 months (1-2 inches larger)'
      } else if (plant.water === 'medium') {
        return 'Repot every 8-12 months (1-2 inches larger)'
      } else if (plant.water === 'low to medium' || plant.water === 'low') {
        return 'Repot every 1-2 years (1-2 inches larger)'
      }
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={reminderHandler}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        status,
        isSubmitting,
      }) => (
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
              value={date}
              is24Hour={true}
              accentColor={COLORS.primary400}
              style={{ flex: 1 }}
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date
                setDate(currentDate)
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
              {/* TODO: number picker (1-999), option picker (days, weeks, months, years) */}
            </View>
          </View>

          <View style={styles.recommendationWrapper}>
            <Text style={styles.smallLabel}>Recommendation</Text>
            <Text style={styles.recommendationText}>{recommendation()}</Text>
          </View>
        </>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  plantInfo: {
    backgroundColor: COLORS.primary400,
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
    color: COLORS.primary800,
  },
  reminderType: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  datePicker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 5,
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
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  recommendationWrapper: {
    marginTop: 20,
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
    marginBottom: 20,
  },
})

import { useEffect } from 'react'
import { StyleSheet, Pressable, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { COLORS } from '../GlobalStyles'
import { Formik } from 'formik'
import { FormItem } from '../components/ui/FormItem'
import { Input } from '../components/ui/Input'
import { AlertText } from '../components/ui/AlertText'
import { TextButton } from '../components/ui/TextButton'
import { SelectOptions } from '../components/ui/SelectOptions'
import * as yup from 'yup'
import * as Haptics from 'expo-haptics'

export const ManagePlant = ({ route, navigation }) => {
  // TODO: check if editing existing plant or adding new plant
  const plant = route.params.plant

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      ),
    })
  })

  const initialValues = {
    imageUrl: plant.imageUrl,
    primaryName: plant.primaryName,
    secondaryName: plant.secondaryName,
    light: plant.light,
    water: plant.water,
    temperature: plant.temperature,
    humidity: plant.humidity,
    toxic: plant.toxic,
    origin: plant.origin,
    climate: plant.climate,
    rarity: plant.rarity,
    review: plant.review,
    sourceUrl: plant.sourceUrl,
  }

  const schema = yup.object().shape({
    imageUrl: yup.string().required('Required'),
    primaryName: yup
      .string()
      .min(2, 'Too short')
      .required('Required')
      // no special characters except hyphens and apostrophes
      .matches(/^[a-zA-Z0-9-'\s]+$/, 'No special characters'),
    secondaryName: yup
      .string()
      .min(2, 'Too short')
      .matches(/^[a-zA-Z0-9-'\s]+$/, 'No special characters'),
    light: yup.string().required('Required'),
    water: yup.string().required('Required'),
    temperature: yup.string().required('Required'),
    humidity: yup.string().required('Required'),
    toxic: yup.string().required('Required'),
    origin: yup.string(),
    climate: yup.string(),
    rarity: yup.string(),
    sourceUrl: yup.string().url('Invalid URL').required('Required'),
  })

  const handlePlantUpdate = async (values, { setStatus }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus('')
    console.log(values)
    // TODO: submit updates and handle errors - test each setting
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handlePlantUpdate}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        setFieldValue,
        isSubmitting,
        status,
      }) => (
        <KeyboardAwareScrollView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={styles.formSectionWrapper}>
            {status && (
              <AlertText
                type='error'
                icon='error'
                title={`Couldn't update plant`}
                subtitle={status}
              />
            )}
            {/* TODO: image upload */}
            <FormItem name='primaryName' label='Botanical name'>
              <Input
                config={{
                  onBlur: handleBlur('primaryName'),
                  onChangeText: handleChange('primaryName'),
                  value: values.primaryName,
                }}
              />
            </FormItem>
            <FormItem name='secondaryName' label='Common name'>
              <Input
                config={{
                  onBlur: handleBlur('secondaryName'),
                  onChangeText: handleChange('secondaryName'),
                  value: values.secondaryName,
                }}
              />
            </FormItem>
          </View>

          <FormItem name='light' label='Light' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='light'
              options={[
                { value: 'low to bright indirect', label: 'Low to bright indirect' },
                { value: 'medium to bright indirect', label: 'Medium to bright indirect' },
                { value: 'bright indirect', label: 'Bright indirect' },
              ]}
              value={values.light}
              setFieldValue={setFieldValue}
            />
          </FormItem>
          <FormItem name='water' label='Water' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='water'
              options={[
                { value: 'low', label: 'Low' },
                { value: 'low to medium', label: 'Low to medium' },
                { value: 'medium', label: 'Medium' },
                { value: 'medium to high', label: 'Medium to high' },
                { value: 'high', label: 'High' },
              ]}
              value={values.water}
              setFieldValue={setFieldValue}
            />
          </FormItem>
          <FormItem name='temperature' label='Temperature' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='temperature'
              options={[
                { value: 'average', label: 'Average' },
                { value: 'above average', label: 'Above average' },
              ]}
              value={values.temperature}
              setFieldValue={setFieldValue}
            />
          </FormItem>
          <FormItem name='humidity' label='Humidity' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='humidity'
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              value={values.humidity}
              setFieldValue={setFieldValue}
            />
          </FormItem>
          <FormItem name='toxic' label='Toxicity' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='toxic'
              options={[
                { value: true, label: 'Toxic' },
                { value: false, label: 'Non-toxic' },
              ]}
              value={values.toxic}
              setFieldValue={setFieldValue}
            />
          </FormItem>
          <FormItem name='climate' label='Climate' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='climate'
              options={[
                { value: 'tropical', label: 'Tropical' },
                { value: 'subtropical', label: 'Subtropical' },
                { value: 'temperate', label: 'Temperate' },
                { value: 'desert', label: 'Desert' },
              ]}
              value={values.climate}
              setFieldValue={setFieldValue}
            />
          </FormItem>
          <FormItem name='rarity' label='Rarity' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='rarity'
              options={[
                { value: 'common', label: 'Common' },
                { value: 'uncommon', label: 'Uncommon' },
                { value: 'rare', label: 'Rare' },
                { value: 'very rare', label: 'Very rare' },
                { value: 'unicorn', label: 'Unicorn' },
              ]}
              value={values.rarity}
              setFieldValue={setFieldValue}
            />
          </FormItem>

          <View style={styles.formSectionWrapper}>
            <FormItem name='origin' label='Region of origin'>
              <Input
                config={{
                  onBlur: handleBlur('origin'),
                  onChangeText: handleChange('origin'),
                  value: values.origin,
                }}
              />
            </FormItem>
            <FormItem name='sourceUrl' label='Source URL'>
              <Input
                config={{
                  onBlur: handleBlur('sourceUrl'),
                  onChangeText: handleChange('sourceUrl'),
                  value: values.sourceUrl,
                }}
              />
            </FormItem>
          </View>

          <FormItem name='review' label='Review status' labelStyle={styles.labelStyle}>
            <SelectOptions
              name='review'
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={values.review}
              setFieldValue={setFieldValue}
            />
          </FormItem>

          <View style={styles.formSectionWrapper}>
            <View style={styles.buttonWrapper}>
              <TextButton
                onPress={handleSubmit}
                disabled={isSubmitting || values === initialValues}
                loading={isSubmitting}>
                Save
              </TextButton>
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 20,
  },
  labelStyle: {
    marginLeft: 20,
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  flatButton: {
    backgroundColor: 'transparent',
  },
  flatButtonText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: COLORS.primary300,
  },
  formSectionWrapper: {
    marginHorizontal: 20,
  },
  buttonWrapper: {
    marginVertical: 20,
  },
})

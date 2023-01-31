import { useState, useEffect, useContext } from 'react'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { API_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants'
import axios from 'axios'
import * as yup from 'yup'
import * as Haptics from 'expo-haptics'
import { StyleSheet, Pressable, Text, View, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { COLORS } from '../GlobalStyles'
import { Formik } from 'formik'
import { FormItem } from '../components/ui/FormItem'
import { Input } from '../components/ui/Input'
import { AlertText } from '../components/ui/AlertText'
import { TextButton } from '../components/ui/TextButton'
import { SelectOptions } from '../components/ui/SelectOptions'
import { ImagePicker } from '../components/ImagePicker'

export const ManagePlant = ({ route, navigation }) => {
  const queryClient = useQueryClient()
  const { currentUser } = useContext(UserContext)
  const existingPlant = route?.params?.existingPlant
  const duplicatePlant = route?.params?.duplicatePlant
  const [newImage, setNewImage] = useState(null)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: existingPlant ? 'Edit plant' : duplicatePlant ? 'Duplicate plant' : 'New plant',
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      ),
    })
  })

  const initialValues = existingPlant
    ? { ...existingPlant }
    : duplicatePlant
    ? {
        primaryName: `${duplicatePlant.primaryName} (Copy)`,
        secondaryName: duplicatePlant.secondaryName || '',
        light: duplicatePlant.light || '',
        water: duplicatePlant.water || '',
        temperature: duplicatePlant.temperature || '',
        humidity: duplicatePlant.humidity || '',
        toxic: duplicatePlant.toxic,
        origin: duplicatePlant.origin || '',
        climate: duplicatePlant.climate || '',
        rarity: duplicatePlant.rarity || '',
        sourceUrl: duplicatePlant.sourceUrl || '',
        review: 'pending',
      }
    : {
        primaryName: '',
        secondaryName: '',
        light: '',
        water: '',
        temperature: '',
        humidity: '',
        toxic: '',
        origin: '',
        climate: '',
        rarity: '',
        sourceUrl: '',
        // review: currentUser.role === 'admin' ? 'approved' : 'pending',
        review: 'pending',
      }

  const schema = yup.object().shape({
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
    review: yup.string(),
    sourceUrl: yup.string().url('Invalid URL').required('Required'),
  })

  const onSelectImage = file => {
    setNewImage(file)
  }

  const submitHandler = async (values, { setStatus, setSubmitting }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)

    if (!currentUser.emailVerified) {
      // TODO: make plant private instead of preventing submission when email not verified?
      return
    }

    if (!newImage && !existingPlant?.imageUrl) {
      setStatus('You must upload an image.')
      setSubmitting(false)
      return
    }

    try {
      if (newImage) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`

        const formData = new FormData()
        formData.append('file', newImage)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

        // upload new image to cloudinary
        const cloudinaryRes = await axios.post(cloudinaryUrl, formData)
        values.imageUrl = cloudinaryRes.data.secure_url
      }

      const data = {
        ...values,
        slug: values.primaryName.replace(/\s+/g, '-').toLowerCase(),
        contributorId: currentUser._id,
      }

      if (existingPlant) {
        // update existing plant
        axios
          .put(`${API_URL}/plants/${existingPlant._id}`, data)
          .then(() => {
            Alert.alert('Success', 'Plant updated')
            navigation.navigate('PlantProfile', { slug: data.slug })
            queryClient.invalidateQueries('plants')
            queryClient.invalidateQueries('plant')
          })
          .catch(err => {
            console.log(err)
            setStatus(err.response.data.message)
            setSubmitting(false)
          })
      } else {
        // add new plant
        axios
          .post(`${API_URL}/plants`, data)
          .then(() => {
            Alert.alert('Success', 'Plant submitted')
            navigation.navigate('PlantProfile', { slug: data.slug })
            queryClient.invalidateQueries('plants')
            queryClient.invalidateQueries('plant')
          })
          .catch(err => {
            console.log(err)
            setStatus(err.response.data.message)
            setSubmitting(false)
          })
      }
    } catch (err) {
      console.log(err)
      setStatus('Sorry, something went wrong. Please try again later.')
      setSubmitting(false)
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={submitHandler}>
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
          <ImagePicker currentImage={initialValues.imageUrl} onSelectImage={onSelectImage} />
          <View style={styles.formSectionWrapper}>
            <FormItem name='primaryName' label='Botanical name' required>
              <Input
                config={{
                  onBlur: handleBlur('primaryName'),
                  onChangeText: handleChange('primaryName'),
                  value: values.primaryName,
                  placeholder: 'e.g. Monstera deliciosa',
                }}
              />
            </FormItem>
            <FormItem name='secondaryName' label='Common name'>
              <Input
                config={{
                  onBlur: handleBlur('secondaryName'),
                  onChangeText: handleChange('secondaryName'),
                  value: values.secondaryName,
                  placeholder: 'e.g. Swiss cheese plant',
                }}
              />
            </FormItem>
          </View>

          <FormItem name='light' label='Light' labelStyle={styles.labelStyle} required>
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
          <FormItem name='water' label='Water' labelStyle={styles.labelStyle} required>
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
          <FormItem name='temperature' label='Temperature' labelStyle={styles.labelStyle} required>
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
          <FormItem name='humidity' label='Humidity' labelStyle={styles.labelStyle} required>
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
          <FormItem name='toxic' label='Toxicity' labelStyle={styles.labelStyle} required>
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
                  placeholder: 'e.g. Central America',
                }}
              />
            </FormItem>
            <FormItem name='sourceUrl' label='Source URL' required>
              <Input
                config={{
                  onBlur: handleBlur('sourceUrl'),
                  onChangeText: handleChange('sourceUrl'),
                  value: values.sourceUrl,
                  placeholder: 'e.g. https://plantpedia.com/monstera-deliciosa',
                }}
              />
            </FormItem>
          </View>

          {currentUser.role === 'admin' && existingPlant && (
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
          )}

          <View style={styles.formSectionWrapper}>
            <View style={styles.buttonWrapper}>
              {status && (
                <AlertText
                  type='error'
                  icon='error'
                  title={`Couldn't ${existingPlant ? 'update' : 'submit'} plant`}
                  subtitle={status}
                />
              )}
              <TextButton
                onPress={handleSubmit}
                disabled={isSubmitting || values === initialValues}
                loading={isSubmitting}>
                {existingPlant ? 'Update' : 'Submit'}
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

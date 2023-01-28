import { useContext, useEffect } from 'react'
import { StyleSheet, Pressable, Text, View, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Formik } from 'formik'
import { FormItem } from '../components/ui/FormItem'
import { Input } from '../components/ui/Input'
import { AlertText } from '../components/ui/AlertText'
import { TextButton } from '../components/ui/TextButton'
import * as Yup from 'yup'
import * as Haptics from 'expo-haptics'

export const Settings = ({ navigation }) => {
  // TODO: smoothly animate moving to login / welcome screen after logout and fix white flash
  const { currentUser, updateCurrentUser, handleLogout } = useContext(UserContext)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      ),
    })
  })

  // #region Initial Values
  const accountInitialValues = {
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    email: currentUser?.email,
    username: currentUser?.username,
  }

  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  // #endregion Initial Values

  // #region Schemas
  const accountSchema = Yup.object().shape({
    firstName: Yup.string().min(2, `That's too short`).required('Required'),
    lastName: Yup.string().min(2, `That's too short`).required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string()
      .min(4, `That's too short`)
      .max(20, `That's too long`)
      .required('Required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
  })

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Required'),
    newPassword: Yup.string().min(6, `That's too short`).required('Required'),
    confirmPassword: Yup.string()
      .required('You must confirm your new password')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  })
  // #endregion Schemas

  const handleAccountUpdate = async (values, { setStatus }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus('')
    const result = await updateCurrentUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      // TODO: improve success feedback (display in UI)
      Alert.alert('Success', 'Your account has been updated')
    }
  }

  const handlePasswordUpdate = async values => {}

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* TODO: profile image upload */}
      <Formik
        initialValues={accountInitialValues}
        validationSchema={accountSchema}
        onSubmit={handleAccountUpdate}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, status }) => (
          <>
            {status && (
              <AlertText
                type='error'
                icon='error'
                title={`Couldn't update account`}
                subtitle={status}
              />
            )}
            <View style={styles.formRow}>
              <FormItem name='firstName' label='First name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('firstName'),
                    onChangeText: handleChange('firstName'),
                    value: values.firstName,
                  }}
                />
              </FormItem>
              <FormItem name='lastName' label='Last name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('lastName'),
                    onChangeText: handleChange('lastName'),
                    value: values.lastName,
                  }}
                />
              </FormItem>
            </View>
            <FormItem name='username' label='Username'>
              <Input
                config={{
                  onBlur: handleBlur('username'),
                  onChangeText: handleChange('username'),
                  value: values.username,
                  autoCorrect: false,
                }}
              />
            </FormItem>
            <FormItem name='email' label='Email'>
              <Input
                config={{
                  onBlur: handleBlur('email'),
                  onChangeText: handleChange('email'),
                  value: values.email,
                  keyboardType: 'email-address',
                  autoCapitalize: 'none',
                }}
              />
            </FormItem>
            <TextButton
              onPress={handleSubmit}
              disabled={isSubmitting || values === accountInitialValues}
              loading={isSubmitting}>
              Save
            </TextButton>
          </>
        )}
      </Formik>
      <Formik initialValues={passwordInitialValues} onSubmit={handlePasswordUpdate}>
        {({ values, isSubmitting }) => (
          <>{/* TODO: password form (click 'change' to open form) */}</>
        )}
      </Formik>
      {/* TODO: update sign out button styling */}
      <TextButton
        onPress={handleLogout}
        buttonStyle={styles.flatButton}
        textStyle={styles.flatButtonText}>
        Sign Out
      </TextButton>
      {/* TODO: danger zone (delete account) */}
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  cancelButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },
  flatButton: {
    backgroundColor: 'transparent',
  },
  flatButtonText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: COLORS.primary300,
  },
})

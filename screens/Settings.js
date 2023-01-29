import { useState, useContext, useEffect } from 'react'
import { StyleSheet, Pressable, Text, View, Modal, Alert, SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Formik } from 'formik'
import { FormItem } from '../components/ui/FormItem'
import { Input } from '../components/ui/Input'
import { AlertText } from '../components/ui/AlertText'
import { TextButton } from '../components/ui/TextButton'
import * as yup from 'yup'
import * as Haptics from 'expo-haptics'

export const Settings = ({ navigation }) => {
  // TODO: smoothly animate moving to login / welcome screen after logout and fix white flash
  const { currentUser, updateCurrentUser, handleLogout } = useContext(UserContext)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

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
  const accountSchema = yup.object().shape({
    firstName: yup.string().min(2, `That's too short`).required('Required'),
    lastName: yup.string().min(2, `That's too short`).required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    username: yup
      .string()
      .min(4, `That's too short`)
      .max(20, `That's too long`)
      .required('Required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
  })

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Required'),
    newPassword: yup.string().min(6, `That's too short`).required('Required'),
    confirmPassword: yup
      .string()
      .required('You must confirm your new password')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
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

  const handlePasswordUpdate = async (values, { setStatus }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus('')
    const result = await updateCurrentUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      // TODO: improve success feedback (display in UI)
      Alert.alert('Success', 'Your password has been changed')
      setPasswordModalVisible(false)
    }
  }

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
      <Formik
        initialValues={passwordInitialValues}
        validationSchema={passwordSchema}
        onSubmit={handlePasswordUpdate}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, status }) => (
          <>
            <View style={styles.passwordSection}>
              <Text style={styles.sectionLabel}>Password</Text>
              <Pressable
                onPress={() => setPasswordModalVisible(true)}
                style={styles.changePasswordBtn}>
                <Text style={styles.buttonText}>Change</Text>
              </Pressable>
            </View>
            <Modal visible={passwordModalVisible} animationType='slide'>
              <SafeAreaView style={styles.modalWrapper}>
                <View style={styles.modalInner}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  {status && (
                    <AlertText
                      type='error'
                      icon='error'
                      title={`Couldn't change password`}
                      subtitle={status}
                    />
                  )}
                  <FormItem name='currentPassword' label='Current password'>
                    <Input
                      config={{
                        onBlur: handleBlur('currentPassword'),
                        onChangeText: handleChange('currentPassword'),
                        value: values.currentPassword,
                        secureTextEntry: !currentPasswordVisible,
                      }}
                      icon={currentPasswordVisible ? 'eye' : 'eye-off'}
                      iconOnPress={() => {
                        setCurrentPasswordVisible(!currentPasswordVisible)
                      }}
                    />
                  </FormItem>
                  <FormItem name='newPassword' label='New password'>
                    <Input
                      config={{
                        onBlur: handleBlur('newPassword'),
                        onChangeText: handleChange('newPassword'),
                        value: values.newPassword,
                        secureTextEntry: !newPasswordVisible,
                      }}
                      icon={newPasswordVisible ? 'eye' : 'eye-off'}
                      iconOnPress={() => {
                        setNewPasswordVisible(!newPasswordVisible)
                      }}
                    />
                  </FormItem>
                  <FormItem name='confirmPassword' label='Confirm password'>
                    <Input
                      config={{
                        onBlur: handleBlur('confirmPassword'),
                        onChangeText: handleChange('confirmPassword'),
                        value: values.confirmPassword,
                        secureTextEntry: !confirmPasswordVisible,
                      }}
                      icon={confirmPasswordVisible ? 'eye' : 'eye-off'}
                      iconOnPress={() => {
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }}
                    />
                  </FormItem>
                  <View style={styles.buttons}>
                    <Pressable onPress={() => setPasswordModalVisible(false)}>
                      <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                    <TextButton
                      onPress={handleSubmit}
                      loading={isSubmitting}
                      disabled={isSubmitting}>
                      Submit
                    </TextButton>
                  </View>
                </View>
              </SafeAreaView>
            </Modal>
          </>
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
  passwordSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  sectionLabel: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
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
  modalTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
})

import { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Modal,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native'
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
import { MaterialIcons } from '@expo/vector-icons'
import { ImagePicker } from '../components/ImagePicker'

export const Settings = ({ navigation }) => {
  const { currentUser, uploadProfileImage, updateCurrentUser, handleLogout, handleDeleteAccount } =
    useContext(UserContext)

  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false)

  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
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
  })
  // #endregion Schemas

  // #region Functions
  const onSelectImage = async file => {
    await uploadProfileImage(file)
  }

  const handleAccountUpdate = async (values, { setStatus }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setStatus(undefined)
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
    setStatus(undefined)
    const result = await updateCurrentUser(values)
    if (result.error) {
      setStatus(result.error)
    } else {
      // TODO: improve success feedback (display in UI)
      Alert.alert('Success', 'Your password has been changed')
      setPasswordModalVisible(false)
    }
  }
  // #endregion Functions

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}>
      <ImagePicker currentImage={currentUser?.imageUrl} onSelectImage={onSelectImage} />

      <Formik
        initialValues={accountInitialValues}
        validationSchema={accountSchema}
        onSubmit={handleAccountUpdate}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, status }) => (
          <View style={styles.formWrapper}>
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
              type='primary'
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || values === accountInitialValues}>
              Save
            </TextButton>
          </View>
        )}
      </Formik>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Change Password...</Text>
        <Pressable onPress={() => setPasswordModalVisible(true)} style={styles.changePasswordBtn}>
          <MaterialIcons name='edit' size={24} color={COLORS.primary400} />
        </Pressable>
      </View>

      <Modal visible={passwordModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordSchema}
            onSubmit={handlePasswordUpdate}>
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, status }) => (
              <View style={styles.modalInner}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Change Password</Text>
                  <Pressable onPress={() => setPasswordModalVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                </View>
                {status && (
                  <AlertText
                    type='error'
                    icon='error'
                    title={`Couldn't change password`}
                    subtitle={status}
                  />
                )}
                <View style={styles.formWrapper}>
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
                </View>
                <TextButton
                  type='primary'
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}>
                  Submit
                </TextButton>
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Sign Out</Text>
        <Pressable onPress={handleLogout}>
          <MaterialIcons name='logout' size={24} color={COLORS.warning} />
        </Pressable>
      </View>

      <View style={[styles.section, styles.dangerSection]}>
        <Text style={styles.sectionLabel}>Delete Account...</Text>
        <Pressable onPress={() => setDeleteAccountModalVisible(true)}>
          <MaterialIcons name='delete' size={24} color={COLORS.error} />
        </Pressable>
      </View>

      <Modal visible={deleteAccountModalVisible} animationType='slide'>
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <Pressable onPress={() => setDeleteAccountModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
            <Text style={styles.confirmationText}>
              Are you sure you want to delete your account on plantgeek? This action cannot be
              undone.
            </Text>
            <TextButton onPress={handleDeleteAccount} danger>
              Delete
            </TextButton>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.plantgeek.co/about')}>
          About
        </Text>
        <Text style={styles.divider}>•</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.plantgeek.co/terms')}>
          Terms of Service
        </Text>
        <Text style={styles.divider}>•</Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.plantgeek.co/privacy')}>
          Privacy Policy
        </Text>
      </View>
      <Text style={styles.logo}>plantgeek</Text>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  dangerButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.error,
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
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
    borderRadius: 10,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  dangerSection: {
    borderColor: COLORS.error,
  },
  sectionLabel: {
    fontFamily: 'Quicksand-Bold',
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
  formWrapper: {
    marginBottom: 20,
  },
  confirmationText: {
    marginVertical: 30,
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
  },
  divider: {
    marginHorizontal: 10,
    opacity: 0.5,
  },
  logo: {
    fontFamily: 'LobsterTwo-Bold',
    fontSize: 40,
    opacity: 0.5,
    textAlign: 'center',
    marginVertical: 10,
  },
})

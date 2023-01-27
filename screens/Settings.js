import { useContext } from 'react'
import { StyleSheet, View, Text, Icon } from 'react-native'
import { UserContext } from '../contexts/UserContext'
import { TextButton } from '../components/ui/TextButton'
import { COLORS } from '../GlobalStyles'
import { Formik } from 'formik'
import { FormItem } from '../components/ui/FormItem'
import * as Yup from 'yup'

export const Settings = () => {
  // TODO: smoothly animate moving to login / welcome screen after logout and fix white flash
  const { currentUser, handleLogout } = useContext(UserContext)

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

  const handleAccountUpdate = async values => {}

  const handlePasswordUpdate = async values => {}

  return (
    <View style={styles.screen}>
      {/* TODO: profile image upload */}
      <Formik initialValues={accountInitialValues} onSubmit={handleAccountUpdate}>
        {({ values, isSubmitting }) => <>{/* TODO: first name, last name, username, email */}</>}
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
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
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

import { useState, useContext } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Formik } from 'formik'
import * as yup from 'yup'
import { COLORS } from '../GlobalStyles'
import { UserContext } from '../contexts/UserContext'
import { Input } from '../components/ui/Input'
import { FormItem } from '../components/ui/FormItem'
import { TextButton } from '../components/ui/TextButton'
import { AlertText } from '../components/ui/AlertText'

export const Signup = ({ navigation }) => {
  const { handleSignup } = useContext(UserContext)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(2, `That's too short`)
      .max(30, `That's too long`)
      .required('Required'),
    lastName: yup
      .string()
      .min(2, `That's too short`)
      .max(30, `That's too long`)
      .required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    username: yup
      .string()
      .min(4, `That's too short`)
      .max(20, `That's too long`)
      .required('Required')
      .matches(/^[a-zA-Z0-9]+$/, 'No special characters or spaces allowed'),
    password: yup.string().min(6, `That's too short`).required('Required'),
  })

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  }

  const signupHandler = async (values, { setStatus }) => {
    const result = await handleSignup(values)
    if (result.error) {
      setStatus(result.error.message)
    }
  }

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.logo}>plantgeek</Text>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={signupHandler}>
        {({ handleChange, handleBlur, handleSubmit, values, status, isSubmitting }) => (
          <>
            {status && (
              <AlertText
                type='error'
                icon='error'
                title={`Couldn't create account`}
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
                    autoComplete: 'given-name',
                    textContentType: 'givenName',
                  }}
                />
              </FormItem>
              <FormItem name='lastName' label='Last name' style={styles.rowItem}>
                <Input
                  config={{
                    onBlur: handleBlur('lastName'),
                    onChangeText: handleChange('lastName'),
                    value: values.lastName,
                    autoComplete: 'family-name',
                    textContentType: 'familyName',
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
                  autoComplete: 'off',
                  textContentType: 'username',
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
                  autoComplete: 'email',
                  textContentType: 'emailAddress',
                }}
              />
            </FormItem>
            <FormItem name='password' label='Password'>
              <Input
                config={{
                  onBlur: handleBlur('password'),
                  onChangeText: handleChange('password'),
                  value: values.password,
                  secureTextEntry: !passwordVisible,
                  autoComplete: 'off',
                  textContentType: 'newPassword',
                }}
                icon={passwordVisible ? 'eye' : 'eye-off'}
                iconOnPress={() => {
                  setPasswordVisible(!passwordVisible)
                }}
              />
            </FormItem>
            <View style={styles.buttons}>
              <TextButton
                type='primary'
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}>
                Create Account
              </TextButton>
              <TextButton
                type='flat'
                onPress={() => {
                  navigation.navigate('Login')
                }}>
                Log In Instead
              </TextButton>
            </View>
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 20,
  },
  logo: {
    fontFamily: 'LobsterTwo-Bold',
    color: '#fff',
    fontSize: 40,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '48%',
  },
  buttons: {
    marginVertical: 16,
  },
})

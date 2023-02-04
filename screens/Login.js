import { useState, useContext } from 'react'
import { StyleSheet, KeyboardAvoidingView, View, Text, Alert, Platform } from 'react-native'
import * as yup from 'yup'
import { Formik } from 'formik'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { Input } from '../components/ui/Input'
import { FormItem } from '../components/ui/FormItem'
import { TextButton } from '../components/ui/TextButton'

export const Login = ({ navigation }) => {
  const { handleLogin } = useContext(UserContext)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const validationSchema = yup.object().shape({
    username: yup.string().required('Required'),
    password: yup.string().required('Required'),
  })

  const initialValues = {
    username: '',
    password: '',
  }

  const loginHandler = async values => {
    const result = await handleLogin(values)
    if (result.error) {
      Alert.alert('Invalid Credentials', result.error.message)
    } else {
      // TODO: fix button to not show text again (stay loading or change to checkmark), briefly show success status and smoothly animate moving to home screen after login
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.logo}>plantgeek</Text>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={loginHandler}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
          <>
            <FormItem name='username' label='Email or username'>
              <Input
                config={{
                  onBlur: handleBlur('username'),
                  onChangeText: handleChange('username'),
                  value: values.username,
                  autoCapitalize: 'none',
                  autoComplete: 'username',
                  textContentType: 'username',
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
                  autoComplete: 'password',
                  textContentType: 'password',
                }}
                icon={passwordVisible ? 'eye' : 'eye-off'}
                iconOnPress={() => {
                  setPasswordVisible(!passwordVisible)
                }}
              />
            </FormItem>
            <View style={styles.buttons}>
              <TextButton type='primary' onPress={handleSubmit} loading={isSubmitting}>
                Log In
              </TextButton>
              <TextButton type='flat' onPress={() => navigation.navigate('Signup')}>
                Sign Up Instead
              </TextButton>
            </View>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
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
  buttons: {
    marginVertical: 16,
  },
  signUpSuccess: {
    marginBottom: 40,
  },
})

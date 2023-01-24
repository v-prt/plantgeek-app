import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native'
import * as yup from 'yup'
import { Formik } from 'formik'
import { COLORS } from '../GlobalStyles'
import { Input } from '../components/ui/Input'
import { FormItem } from '../components/ui/FormItem'
import { TextButton } from '../components/ui/TextButton'

export const Login = ({ navigation }) => {
  const validationSchema = yup.object().shape({
    email: yup.string().required('Required'),
    password: yup.string().required('Required'),
  })

  const initialValues = {
    email: '',
    password: '',
  }

  const handleLogin = async ({ email, password }) => {
    // TODO: send login request and handle response & errors
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleLogin}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
          <>
            <FormItem name='username' label='Email or username'>
              <Input
                config={{
                  onBlur: handleBlur('username'),
                  onChangeText: handleChange('username'),
                  value: values.username,
                  autoCapitalize: 'none',
                }}
              />
            </FormItem>
            <FormItem name='password' label='Password'>
              <Input
                config={{
                  onBlur: handleBlur('password'),
                  onChangeText: handleChange('password'),
                  value: values.password,
                  secureTextEntry: true,
                }}
              />
            </FormItem>
            <View style={styles.buttons}>
              <TextButton onPress={handleSubmit} loading={isSubmitting}>
                Log In
              </TextButton>
              <TextButton
                onPress={() => navigation.navigate('Signup')}
                buttonStyle={styles.flatButton}
                textStyle={styles.flatButtonText}>
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
  buttons: {
    marginVertical: 16,
  },
  flatButton: {
    backgroundColor: 'transparent',
  },
  flatButtonText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: COLORS.primary300,
  },
  signUpSuccess: {
    marginBottom: 40,
  },
})

import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Formik } from 'formik'
import * as yup from 'yup'
import { COLORS } from '../GlobalStyles'
import { Input } from '../components/ui/Input'
import { FormItem } from '../components/ui/FormItem'
import { TextButton } from '../components/ui/TextButton'

export const Signup = ({ navigation }) => {
  const validationSchema = yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string(),
    username: yup.string().required('Required').min(4, 'Username must be at least 4 characters'),
    email: yup.string().required('Required').email('Invalid email'),
    password: yup.string().required('Required').min(6, 'Passwords must be at least 6 characters'),
  })

  const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  }

  const handleSignup = async values => {
    // TODO: send signup request and handle response & errors
  }

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSignup}>
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
          <>
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
                Create Account
              </TextButton>
              <TextButton
                onPress={() => {
                  navigation.navigate('Login')
                }}
                buttonStyle={styles.flatButton}
                textStyle={styles.flatButtonText}>
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
  flatButton: {
    backgroundColor: 'transparent',
  },
  flatButtonText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    color: COLORS.primary300,
  },
})

import { StyleSheet, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { COLORS } from '../GlobalStyles'
import { Login } from '../screens/Login'
import { Signup } from '../screens/Signup'

const Stack = createNativeStackNavigator()

export const UnauthenticatedStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary800,
        },
        headerTintColor: COLORS.primary100,
        headerShadowVisible: false,
        headerTitle: '',
        headerLeft: () => <Text style={styles.logo}>plantgeek</Text>,
      }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'LobsterTwo-Bold',
    color: '#fff',
    fontSize: 30,
  },
})

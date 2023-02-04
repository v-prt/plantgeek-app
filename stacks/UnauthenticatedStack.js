import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { COLORS } from '../GlobalStyles'
import { Welcome } from '../screens/Welcome'
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
      }}>
      <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  )
}

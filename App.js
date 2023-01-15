import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'

import { QueryClient, QueryClientProvider } from 'react-query'
import { PlantProvider } from './contexts/PlantContext'

import { COLORS } from './GlobalStyles'
import { Browse } from './screens/Browse'
import { PlantProfile } from './screens/PlantProfile'
import { UserProfile } from './screens/UserProfile'

const queryClient = new QueryClient()

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const PlantScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary800,
        },
        headerTintColor: COLORS.primary100,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary800,
          borderTopWidth: 0,
        },
        tabBarInactiveTintColor: COLORS.primary100,
        tabBarActiveTintColor: COLORS.primary400,
      }}>
      <Stack.Screen
        name='Browse'
        component={Browse}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='search' size={size} color={color} />
          ),
        }}
      />
      <Stack.Screen
        name='PlantProfile'
        component={PlantProfile}
        options={{
          title: '',
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <PlantProvider>
          <StatusBar style='light' />
          <Tab.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.primary800,
              },
              headerTintColor: COLORS.primary100,
              headerShadowVisible: false,
              tabBarStyle: {
                backgroundColor: COLORS.primary800,
                borderTopWidth: 0,
              },
              tabBarInactiveTintColor: COLORS.primary100,
              tabBarActiveTintColor: COLORS.primary400,
            }}>
            <Tab.Screen
              name='Plants'
              component={PlantScreens}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name='search' size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name='UserProfile'
              component={UserProfile}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name='account-circle' size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </PlantProvider>
      </QueryClientProvider>
    </NavigationContainer>
  )
}

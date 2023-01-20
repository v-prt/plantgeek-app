import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { setCustomText } from 'react-native-global-props'

import { QueryClient, QueryClientProvider } from 'react-query'
import { PlantProvider } from './contexts/PlantContext'

import { COLORS } from './GlobalStyles'
import { Browse } from './screens/Browse'
import { Filters } from './screens/Filters'
import { Collection } from './screens/Collection'
import { Wishlist } from './screens/Wishlist'
import { PlantProfile } from './screens/PlantProfile'
import { UserProfile } from './screens/UserProfile'

const searchIcon = require('./assets/images/search.png')
const plantIcon = require('./assets/images/plant.png')
const starIcon = require('./assets/images/star.png')
const personIcon = require('./assets/images/person.png')

const queryClient = new QueryClient()

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

SplashScreen.preventAutoHideAsync()

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
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='search' size={size} color={color} />
          ),
        }}
      />
      <Stack.Screen
        name='Filters'
        component={Filters}
        options={{
          presentation: 'modal',
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
  const [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
  })

  // app-wide font / text style
  const customTextProps = {
    style: {
      fontFamily: 'Quicksand-Regular',
    },
  }

  useEffect(() => {
    const prepare = async () => {
      // simulate longer loading by waiting 1 second
      await new Promise(resolve => setTimeout(resolve, 1000))
      await SplashScreen.hideAsync()
    }

    if (fontsLoaded) {
      prepare()
      setCustomText(customTextProps)
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

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
              tabBarLabel: () => null, // hide tab labels
            }}>
            <Tab.Screen
              name='Plants'
              component={PlantScreens}
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={searchIcon}
                    style={[styles.tabIcon, focused && styles.tabFocused]}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Collection'
              component={Collection}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={plantIcon}
                    style={[styles.tabIcon, focused && styles.tabFocused]}
                  />
                ),
              }}
            />
            <Tab.Screen
              name='Wishlist'
              component={Wishlist}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Image source={starIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
                ),
              }}
            />
            <Tab.Screen
              name='UserProfile'
              component={UserProfile}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={personIcon}
                    style={[styles.tabIcon, focused && styles.tabFocused]}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </PlantProvider>
      </QueryClientProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.primary100,
  },
  tabFocused: {
    tintColor: COLORS.primary400,
  },
})

import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Image, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { useFonts } from './hooks/useFonts'

import * as SplashScreen from 'expo-splash-screen'
import { setCustomText } from 'react-native-global-props'

import { QueryClient, QueryClientProvider } from 'react-query'
import { PlantProvider } from './contexts/PlantContext'

import { COLORS, customTextProps } from './GlobalStyles'
import { Browse } from './screens/Browse'
import { Filter } from './screens/Filter'
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
        name='Filter'
        component={Filter}
        options={{
          headerStyle: {
            backgroundColor: '#222',
          },
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
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const loadFonts = async () => {
      await useFonts()
      setAppReady(true)
    }
    loadFonts()
  }, [])

  useEffect(() => {
    const prepare = async () => {
      // simulate longer loading by waiting 1 second
      await new Promise(resolve => setTimeout(resolve, 1000))
      await SplashScreen.hideAsync()
    }

    if (appReady) {
      prepare()
      setCustomText(customTextProps)
    }
  }, [appReady])

  if (!appReady) {
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

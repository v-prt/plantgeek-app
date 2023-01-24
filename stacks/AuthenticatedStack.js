import { StyleSheet, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'

import { PlantProvider } from '../contexts/PlantContext'

import { COLORS } from '../GlobalStyles'
import { Browse } from '../screens/Browse'
import { Filter } from '../screens/Filter'
import { PlantProfile } from '../screens/PlantProfile'
import { Collection } from '../screens/Collection'
import { Wishlist } from '../screens/Wishlist'
import { UserProfile } from '../screens/UserProfile'

const searchIcon = require('../assets/images/search.png')
const plantIcon = require('../assets/images/plant.png')
const starIcon = require('../assets/images/star.png')
const personIcon = require('../assets/images/person.png')

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

export const AuthenticatedStack = () => {
  return (
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
              <Image source={searchIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
            ),
          }}
        />
        <Tab.Screen
          name='Collection'
          component={Collection}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={plantIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
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
              <Image source={personIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
            ),
          }}
        />
      </Tab.Navigator>
    </PlantProvider>
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

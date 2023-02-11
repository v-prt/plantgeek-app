import { useQuery } from 'react-query'
import axios from 'axios'
import { API_URL } from '../constants'
import { StyleSheet, Image, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { PlantProvider } from '../contexts/PlantContext'
import { COLORS } from '../GlobalStyles'
import { Browse } from '../screens/Browse'
import { Filter } from '../screens/Filter'
import { PlantProfile } from '../screens/PlantProfile'
import { ManagePlant } from '../screens/ManagePlant'
import { Collection } from '../screens/Collection'
import { Wishlist } from '../screens/Wishlist'
import { Schedule } from '../screens/Schedule'
import { Contributions } from '../screens/Contributions'
import { UserProfile } from '../screens/UserProfile'
import { Settings } from '../screens/Settings'
import { IconButton } from '../components/ui/IconButton'

const searchIcon = require('../assets/images/search.png')
const plantIcon = require('../assets/images/plant.png')
const calendarIcon = require('../assets/images/calendar.png')
const starIcon = require('../assets/images/star.png')
const personIcon = require('../assets/images/person.png')

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const stackScreenOptions = {
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
}

const BrowseStack = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
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
      <Stack.Screen
        name='ManagePlant'
        component={ManagePlant}
        options={{
          title: 'Edit Plant',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

const CollectionStack = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name='Collection'
        component={Collection}
        options={{
          headerStyle: {
            backgroundColor: '#222',
          },
          headerTitle: () => <Text style={styles.headerTitle}>My Collection</Text>,
        }}
      />
      <Stack.Screen
        name='PlantProfile'
        component={PlantProfile}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name='ManagePlant'
        component={ManagePlant}
        options={{
          title: 'Edit Plant',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

const WishlistStack = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name='Wishlist'
        component={Wishlist}
        options={{
          headerStyle: {
            backgroundColor: '#222',
          },
          headerTitle: () => <Text style={styles.headerTitle}>My Wishlist</Text>,
        }}
      />
      <Stack.Screen
        name='PlantProfile'
        component={PlantProfile}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name='ManagePlant'
        component={ManagePlant}
        options={{
          title: 'Edit Plant',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

const ContributionsStack = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name='Contributions'
        component={Contributions}
        options={{
          headerStyle: {
            backgroundColor: '#222',
          },
          headerTitle: () => <Text style={styles.headerTitle}>My Contributions</Text>,
        }}
      />
      <Stack.Screen
        name='PlantProfile'
        component={PlantProfile}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name='ManagePlant'
        component={ManagePlant}
        options={{
          title: 'Edit Plant',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name='UserProfile'
        component={UserProfile}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#222',
          },
          headerTitle: () => <Text style={styles.headerTitle}>My Profile</Text>,
          headerLeft: ({ tintColor }) => (
            <IconButton
              icon='settings'
              color={tintColor}
              onPress={() => {
                navigation.navigate('Settings')
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name='ContributionsStack'
        component={ContributionsStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Settings'
        component={Settings}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  )
}

export const AuthenticatedStack = ({ currentUser }) => {
  const { data: dueReminders } = useQuery(['due-reminders', currentUser._id], async () => {
    const { data } = await axios.get(`${API_URL}/due-reminders/${currentUser._id}`)
    return data.numDue
  })

  return (
    <PlantProvider>
      <Tab.Navigator
        screenOptions={{
          ...stackScreenOptions,
          tabBarLabel: () => null, // hide tab labels
        }}>
        <Tab.Screen
          name='Plants'
          component={BrowseStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image source={searchIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
            ),
          }}
        />
        <Tab.Screen
          name='CollectionStack'
          component={CollectionStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image source={plantIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
            ),
          }}
        />
        <Tab.Screen
          name='WishlistStack'
          component={WishlistStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image source={starIcon} style={[styles.tabIcon, focused && styles.tabFocused]} />
            ),
          }}
        />
        <Tab.Screen
          name='Schedule'
          component={Schedule}
          options={{
            headerStyle: {
              backgroundColor: '#222',
            },
            headerTitle: () => <Text style={styles.headerTitle}>Care Schedule</Text>,
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabIconWrapper}>
                <Image
                  source={calendarIcon}
                  style={[styles.tabIcon, focused && styles.tabFocused]}
                />
                {dueReminders > 0 && <View style={styles.badge} />}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='ProfileStack'
          component={ProfileStack}
          options={{
            headerShown: false,
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
  headerTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
  },
  tabIconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.primary100,
    opacity: 0.5,
  },
  tabFocused: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.warning,
    borderRadius: 5,
    height: 10,
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

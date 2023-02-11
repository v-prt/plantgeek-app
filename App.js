import { useEffect, useState, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { setCustomText } from 'react-native-global-props'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from './hooks/useFonts'
import { UserContext, UserProvider } from './contexts/UserContext'
import { AuthenticatedStack } from './stacks/AuthenticatedStack'
import { UnauthenticatedStack } from './stacks/UnauthenticatedStack'
import { COLORS, customTextProps } from './GlobalStyles'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

const Root = () => {
  const { authenticated, currentUser } = useContext(UserContext)

  return (
    <View style={styles.app}>
      <NavigationContainer
        theme={{
          colors: {
            background: COLORS.primary800,
          },
        }}>
        {authenticated && currentUser ? (
          <AuthenticatedStack currentUser={currentUser} />
        ) : (
          <UnauthenticatedStack />
        )}
      </NavigationContainer>
    </View>
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
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Root />
      </UserProvider>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: COLORS.primary800,
  },
})

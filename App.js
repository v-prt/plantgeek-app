import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { setCustomText } from 'react-native-global-props'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from './hooks/useFonts'
import { AuthenticatedStack } from './stacks/AuthenticatedStack'
import { UnauthenticatedStack } from './stacks/UnauthenticatedStack'
import { COLORS, customTextProps } from './GlobalStyles'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

export default function App() {
  // TODO: check for token and set authenticated state
  const [authenticated, setAuthenticated] = useState(false)
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
    <NavigationContainer
      theme={{
        colors: {
          background: COLORS.primary800,
        },
      }}>
      <QueryClientProvider client={queryClient}>
        {authenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
      </QueryClientProvider>
    </NavigationContainer>
  )
}

import * as Font from 'expo-font'

export const useFonts = async () => {
  await Font.loadAsync({
    'LobsterTwo-Regular': require('../assets/fonts/LobsterTwo-Regular.ttf'),
    'LobsterTwo-Bold': require('../assets/fonts/LobsterTwo-Bold.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
  })
}

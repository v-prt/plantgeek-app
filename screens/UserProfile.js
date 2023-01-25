import { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { UserContext } from '../contexts/UserContext'
import { TextButton } from '../components/ui/TextButton'

export const UserProfile = () => {
  // TODO: smoothly animate moving to login / welcome screen after logout and fix white flash
  const { handleLogout } = useContext(UserContext)

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Profile</Text>
      <TextButton onPress={handleLogout}>Log Out</TextButton>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
  },
})

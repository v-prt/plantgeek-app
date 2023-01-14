import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../GlobalStyles'

export const Profile = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Profile</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
  },
})

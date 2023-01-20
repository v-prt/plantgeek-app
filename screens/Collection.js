import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../GlobalStyles'

export const Collection = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Collection</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
  },
})

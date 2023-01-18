import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../GlobalStyles'

export const Filters = () => {
  return (
    <View style={styles.screen}>
      {/* TODO: Implement sort & filters (light, water, temperature, humidity, toxicity, climate, rarity) */}
      <Text>Filters</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 20,
  },
})

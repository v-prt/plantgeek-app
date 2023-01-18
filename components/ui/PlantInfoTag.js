import { StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const PlantInfoTag = ({ text }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'Quicksand-Bold',
    textTransform: 'uppercase',
    color: '#666',
  },
})

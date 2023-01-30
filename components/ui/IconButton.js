import { StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

export const IconButton = ({ icon, size = 24, color, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={size} color={color} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  pressed: {
    opacity: 0.7,
  },
})

import { StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const IconButton = ({ icon, color, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Ionicons name={icon} size={24} color={color} />
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

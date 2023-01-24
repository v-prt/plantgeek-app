import { Pressable, StyleSheet, ActivityIndicator, Text, View } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const TextButton = ({ children, onPress, buttonStyle, loading, textStyle }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.button, buttonStyle]}>
        {loading ? (
          <ActivityIndicator size='small' color={COLORS.primary100} />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{children}</Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 12,
    marginVertical: 8,
  },
  buttonText: {
    color: COLORS.primary800,
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: 18,
  },
  pressed: {
    opacity: 0.7,
  },
})

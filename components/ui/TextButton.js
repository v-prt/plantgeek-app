import { Pressable, StyleSheet, ActivityIndicator, Text, View } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const TextButton = ({
  children,
  onPress,
  buttonStyle,
  loading,
  textStyle,
  disabled,
  danger,
}) => {
  return (
    <Pressable
      onPress={() => {
        if (!disabled) onPress()
      }}
      style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}>
      <View style={[styles.button, buttonStyle, danger && styles.danger]}>
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
  disabled: {
    opacity: 0.5,
  },
  danger: {
    backgroundColor: COLORS.error,
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

import { Pressable, StyleSheet, ActivityIndicator, Text, View } from 'react-native'
import { COLORS } from '../../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'

export const TextButton = ({
  type,
  children,
  icon,
  iconColor,
  onPress,
  loading,
  disabled,
  danger,
}) => {
  const buttonStyle =
    type === 'primary'
      ? styles.primaryButton
      : type === 'secondary'
      ? styles.secondaryButton
      : styles.flatButton

  const textStyle =
    type === 'primary'
      ? styles.primaryText
      : type === 'secondary'
      ? styles.secondaryText
      : styles.flatText

  return (
    <Pressable
      onPress={() => {
        if (!disabled) onPress()
      }}
      style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}>
      <View style={[styles.button, buttonStyle, danger && styles.dangerButton]}>
        {loading ? (
          <ActivityIndicator size={18} color={COLORS.primary800} />
        ) : (
          <>
            {icon && (
              <MaterialIcons name={icon} color={iconColor} size={18} style={{ marginRight: 8 }} />
            )}
            <Text style={[styles.text, textStyle, danger && styles.dangerText]}>{children}</Text>
          </>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
    height: 45,
  },
  text: {
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: COLORS.primary400,
  },
  primaryText: {
    color: COLORS.primary800,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary400,
  },
  secondaryText: {
    color: COLORS.primary400,
  },
  flatButton: {
    backgroundColor: 'transparent',
  },
  flatText: {
    color: COLORS.primary400,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  dangerText: {
    color: COLORS.primary800,
  },
})

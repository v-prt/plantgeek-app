import { StyleSheet, View, Pressable, TextInput } from 'react-native'
import { COLORS } from '../../GlobalStyles'
import { Feather } from '@expo/vector-icons'

export const Input = ({ config, icon, iconOnPress }) => {
  const inputStyles = [styles.input]

  return (
    <View style={styles.inputWrapper}>
      <TextInput {...config} style={inputStyles} selectionColor={COLORS.primary400} />
      {icon && (
        <Pressable onPress={iconOnPress} style={styles.iconButton}>
          <Feather name={icon} color={COLORS.primary300} size={16} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: '#444',
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    flex: 1,
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
})

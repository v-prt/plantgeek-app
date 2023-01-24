import { StyleSheet, TextInput } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const Input = ({ config }) => {
  const inputStyles = [styles.input]

  return <TextInput {...config} style={inputStyles} selectionColor={COLORS.primary400} />
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#444',
    color: COLORS.primary100,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    opacity: 0.9,
  },
})

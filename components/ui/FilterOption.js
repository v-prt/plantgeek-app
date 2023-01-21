import { useContext, useEffect, useState } from 'react'
import { StyleSheet, Pressable, Text } from 'react-native'
import { COLORS } from '../../GlobalStyles'
import { PlantContext } from '../../contexts/PlantContext'

export const FilterOption = ({ filter, label, value, firstChild, lastChild }) => {
  const { formData, setFormData } = useContext(PlantContext)
  const [selected, setSelected] = useState(formData[filter]?.includes(value) || false)

  const handlePress = () => {
    if (selected) {
      setFormData({ ...formData, [filter]: formData[filter]?.filter(item => item !== value) })
    } else {
      setFormData({ ...formData, [filter]: [value] })
    }
  }

  useEffect(() => {
    setSelected(formData[filter]?.includes(value) || false)
  }, [formData])

  return (
    <Pressable
      style={[
        styles.button,
        firstChild && styles.firstChild,
        lastChild && styles.lastChild,
        selected && styles.selectedButton,
      ]}
      onPress={handlePress}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary800,
    borderWidth: 1,
    borderColor: COLORS.primary100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    opacity: 0.6,
  },
  firstChild: {
    marginLeft: 20,
  },
  lastChild: {
    marginRight: 20,
  },
  text: {
    fontFamily: 'Quicksand-Bold',
  },
  selectedButton: {
    backgroundColor: COLORS.primary400,
    borderColor: COLORS.primary400,
    opacity: 1,
  },
  selectedText: {
    color: COLORS.primary800,
  },
})

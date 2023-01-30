import { StyleSheet, Pressable, ScrollView, Text } from 'react-native'
import { COLORS } from '../../GlobalStyles'
import * as Haptics from 'expo-haptics'

export const SelectOptions = ({ name, options, value, setFieldValue }) => {
  const handleSelect = selectedValue => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setFieldValue(name, selectedValue)
  }

  return (
    <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          style={[
            styles.option,
            index === 0 && styles.firstChild,
            index === options.length - 1 && styles.lastChild,
            value === option.value && styles.selectedOption,
          ]}
          onPress={() => handleSelect(option.value)}>
          <Text style={[styles.text, value === option.value && styles.selectedText]}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
  },
  option: {
    backgroundColor: COLORS.primary800,
    borderWidth: 1,
    borderColor: COLORS.primary100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    opacity: 0.7,
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
  selectedOption: {
    borderColor: COLORS.primary400,
    opacity: 1,
  },
  selectedText: {
    color: COLORS.primary400,
  },
})

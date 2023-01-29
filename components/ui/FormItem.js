import { StyleSheet, View, Text } from 'react-native'
import { Field, ErrorMessage } from 'formik'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../../GlobalStyles'

export const FormItem = ({ name, label, sublabel, subtext, style, children }) => {
  return (
    <Field>
      {({ form }) => {
        const error = form.errors[name] && form.touched[name]
        return (
          <View style={[styles.wrapper, style]}>
            {label && <Text style={[styles.label, error && styles.error]}>{label}</Text>}
            {sublabel && <Text style={styles.sublabel}>{subtext}</Text>}
            {children}
            <ErrorMessage
              name={name}
              render={msg => (
                <View style={styles.errorTextWrapper}>
                  <MaterialIcons name='error-outline' size={14} color={COLORS.error} />
                  <Text style={styles.errorText}>{msg}</Text>
                </View>
              )}
            />
          </View>
        )
      }}
    </Field>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    color: COLORS.primary100,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    opacity: 0.7,
  },
  sublabel: {
    opacity: 0.5,
    fontSize: 12,
  },
  errorTextWrapper: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: COLORS.error,
    opacity: 1,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 5,
  },
})

import { StyleSheet, View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../../GlobalStyles'

export const AlertText = ({ type, icon, title, subtitle }) => {
  return (
    <View style={styles.wrapper}>
      {icon && (
        <MaterialIcons
          name={icon}
          size={18}
          color={
            type === 'error'
              ? COLORS.error
              : type === 'warning'
              ? COLORS.warning
              : type === 'success'
              ? COLORS.primary400
              : COLORS.primary100
          }
          style={styles.icon}
        />
      )}
      <View style={styles.text}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  icon: {
    marginTop: 2,
    marginRight: 12,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: '18px',
    color: COLORS.error,
    marginBottom: 5,
  },
})

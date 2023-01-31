import { StyleSheet, View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS } from '../../GlobalStyles'

export const AlertText = ({ type, icon, title, subtitle }) => {
  const color =
    type === 'error'
      ? COLORS.error
      : type === 'warning'
      ? COLORS.warning
      : type === 'success'
      ? COLORS.primary400
      : COLORS.primary100

  return (
    <View style={styles.wrapper}>
      {icon && <MaterialIcons name={icon} size={18} color={color} style={styles.icon} />}
      <View style={styles.text}>
        {title && (
          <Text
            style={[
              styles.title,
              {
                color: color,
              },
            ]}>
            {title}
          </Text>
        )}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
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
  text: {
    flex: 1,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: '18px',
    marginBottom: 5,
  },
})

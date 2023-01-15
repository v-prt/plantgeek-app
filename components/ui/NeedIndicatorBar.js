import { StyleSheet, View, Image, Text } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const NeedIndicatorBar = ({ icon, label, need, level }) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.indicatorWrapper}>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.need}>{need}</Text>
        </View>
        <View style={styles.indicator}>
          <View style={styles.indicatorFill} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  icon: {
    height: 35,
    width: 35,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    opacity: 0.5,
  },
  need: {
    marginBottom: 6,
    fontSize: 16,
  },
  indicatorWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  indicator: {
    backgroundColor: '#eee',
    height: 15,
    borderRadius: 10,
  },
  indicatorFill: {
    backgroundColor: COLORS.primary400,
    height: 15,
    borderRadius: 15,
    // TODO: set width based on level
    width: '50%',
  },
})

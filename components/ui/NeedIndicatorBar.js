import { StyleSheet, View, Image, Text } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const NeedIndicatorBar = ({ icon, label, need, indicatorWidth }) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.indicatorWrapper}>
        <View style={styles.textWrapper}>
          <Text style={styles.need}>{need}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.indicator}>
          <View style={[styles.indicatorFill, { width: indicatorWidth }]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    tintColor: COLORS.primary100,
    height: 30,
    width: 30,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  need: {
    fontFamily: 'Quicksand-Bold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  indicatorWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  indicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 15,
    borderRadius: 10,
  },
  indicatorFill: {
    backgroundColor: COLORS.primary400,
    height: 15,
    borderRadius: 15,
  },
})

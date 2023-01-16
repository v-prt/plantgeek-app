import { StyleSheet, View, Image, Text } from 'react-native'
import { COLORS } from '../../GlobalStyles'

export const NeedIndicatorBar = ({ icon, label, need, level }) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.indicatorWrapper}>
        <View style={styles.textWrapper}>
          <Text style={styles.need}>{need}</Text>
          <Text style={styles.label}>{label}</Text>
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    opacity: 0.5,
  },
  need: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    opacity: 0.5,
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

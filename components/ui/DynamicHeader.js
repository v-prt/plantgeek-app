import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'

export const DynamicHeader = ({ scrolledPastTop }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current
  const heightAnim = useRef(new Animated.Value(60)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: scrolledPastTop ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(heightAnim, {
        toValue: scrolledPastTop ? 0 : 60,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start()
  }, [scrolledPastTop])

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          height: heightAnim,
        },
        styles.header,
      ]}>
      <Text style={styles.logo}>plantgeek</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'LobsterTwo-Bold',
    color: '#fff',
    fontSize: 40,
  },
})

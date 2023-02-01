import { useEffect, useState, useRef } from 'react'
import { Animated, StyleSheet, View, Image } from 'react-native'

export const ImageLoader = ({ style, source, borderRadius }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: imageLoaded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [imageLoaded])

  return (
    <View style={style}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={source}
          style={[styles.image, { borderRadius }]}
          onLoad={() => {
            console.log('image loaded')
            setImageLoaded(true)
          }}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
})

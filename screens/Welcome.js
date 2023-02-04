import { StyleSheet, SafeAreaView, View, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { TextButton } from '../components/ui/TextButton'
import { ImageLoader } from '../components/ui/ImageLoader'
const heroImage = require('../assets/images/hero-image.png')

export const Welcome = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.screen}>
        <ImageLoader source={heroImage} style={styles.image} borderRadius={20} />
        <Text style={styles.logo}>plantgeek</Text>
        <Text style={styles.tagline}>the houseplant encyclopedia for modern plant parents.</Text>
        <TextButton type='primary' onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </TextButton>
        <TextButton type='secondary' onPress={() => navigation.navigate('Login')}>
          Log In
        </TextButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.primary700,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    padding: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  logo: {
    fontFamily: 'LobsterTwo-Bold',
    color: '#fff',
    fontSize: 50,
    marginBottom: 10,
  },
  tagline: {
    color: COLORS.primary100,
    fontSize: 25,
    marginBottom: 20,
  },
})

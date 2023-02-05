import { StyleSheet, SafeAreaView, ScrollView, Text, Linking } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { TextButton } from '../components/ui/TextButton'
import { ImageLoader } from '../components/ui/ImageLoader'
const heroImage = require('../assets/images/hero-image.png')

export const Welcome = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.screen}>
        <ImageLoader source={heroImage} style={styles.image} borderRadius={20} />
        <Text style={styles.logo}>plantgeek</Text>
        <Text style={styles.tagline}>the houseplant encyclopedia for modern plant parents.</Text>
        <TextButton type='primary' onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </TextButton>
        <TextButton type='secondary' onPress={() => navigation.navigate('Login')}>
          Log In
        </TextButton>
        <Text style={styles.footerText}>
          By continuing to use plantgeek, you agree to our{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://www.plantgeek.co/terms')}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://www.plantgeek.co/privacy')}>
            Privacy Policy
          </Text>
          .
        </Text>
      </ScrollView>
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
  footerText: {
    color: COLORS.primary100,
    marginTop: 20,
    fontSize: 13,
    opacity: 0.7,
  },
  link: {
    color: COLORS.primary400,
  },
})

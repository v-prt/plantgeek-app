import { useContext } from 'react'
import { StyleSheet, Text, View, Pressable, Image, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../GlobalStyles'
import { UserContext } from '../contexts/UserContext'
import moment from 'moment'
import { ImageLoader } from '../components/ui/ImageLoader'
const placeholder = require('../assets/images/avatar-placeholder.png')

export const UserProfile = ({ navigation }) => {
  const { currentUser } = useContext(UserContext)

  return (
    <View style={styles.screen}>
      {currentUser ? (
        <>
          <LinearGradient
            style={styles.header}
            colors={['#a4e17d', '#95d190']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View style={styles.info}>
              <Text style={styles.name}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={styles.username}>@{currentUser.username}</Text>
              <Text style={styles.dateJoined}>
                Joined {moment(currentUser.joined).format('ll')}
              </Text>
            </View>
            {currentUser.imageUrl ? (
              <ImageLoader
                style={styles.profilePic}
                source={{ uri: currentUser.imageUrl }}
                borderRadius={40}
              />
            ) : (
              <ImageLoader style={styles.profilePic} source={placeholder} borderRadius={40} />
            )}
          </LinearGradient>
          <Pressable
            style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
            onPress={() => navigation.navigate('CollectionStack', { screen: 'Collection' })}>
            <Text style={styles.label}>Collection</Text>
            <Text style={styles.num}>{currentUser.plantCollection?.length}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
            onPress={() => navigation.navigate('WishlistStack', { screen: 'Wishlist' })}>
            <Text style={styles.label}>Wishlist</Text>
            <Text style={styles.num}>{currentUser.plantWishlist?.length}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
            onPress={() => navigation.navigate('ContributionsStack', { screen: 'Contributions' })}>
            <Text style={styles.label}>Contributions</Text>
            <Text style={styles.num}>{currentUser.contributions}</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator size='large' color={COLORS.primary400} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  profilePic: {
    height: 80,
    width: 80,
  },
  name: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary800,
    fontSize: 20,
  },
  username: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: COLORS.primary500,
  },
  dateJoined: {
    color: COLORS.primary800,
    fontSize: 14,
    opacity: 0.7,
    marginTop: 10,
  },
  stat: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  pressed: {
    opacity: 0.7,
  },
  num: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
  },
  label: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
})

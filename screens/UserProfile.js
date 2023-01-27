import { useContext } from 'react'
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { UserContext } from '../contexts/UserContext'
import moment from 'moment'
const placeholder = require('../assets/images/avatar-placeholder.png')

export const UserProfile = ({ navigation }) => {
  const { currentUser } = useContext(UserContext)

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image style={styles.profilePic} source={{ uri: currentUser.imageUrl || placeholder }} />
        <View style={styles.info}>
          <Text style={styles.name}>
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text style={styles.username}>@{currentUser.username}</Text>
          <Text style={styles.dateJoined}>Joined {moment(currentUser.joined).format('ll')}</Text>
        </View>
      </View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profilePic: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  info: {
    alignItems: 'flex-end',
  },
  name: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
  },
  username: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: COLORS.primary400,
  },
  dateJoined: {
    fontSize: 14,
    opacity: 0.6,
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
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    textTransform: 'uppercase',
  },
})

import { useNavigation } from '@react-navigation/native'
import { StyleSheet, View, Pressable, Image, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

export const PlantCard = ({ plant }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate('PlantProfile', { slug: plant.slug })
  }

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={handlePress}>
        <Image source={{ uri: plant.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{plant.primaryName}</Text>
          {plant.secondaryName && <Text style={styles.subtitle}>{plant.secondaryName}</Text>}
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',

    // android shadow
    elevation: 4,
    // ios shadow
    shadowColor: COLORS.primary400,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    maxWidth: '60%',
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 8,
  },
})

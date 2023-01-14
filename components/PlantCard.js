import { StyleSheet, View, Image, Text } from 'react-native'
import { COLORS } from '../GlobalStyles'

export const PlantCard = ({ plant }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image source={{ uri: plant.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{plant.primaryName.toLowerCase()}</Text>
          <Text style={styles.subtitle}>{plant.secondaryName?.toLowerCase()}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 8,
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: COLORS.primary800,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.primary700,
    opacity: 0.7,
    fontStyle: 'italic',
  },
})

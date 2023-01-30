import { useState, useEffect, useContext } from 'react'
import { useQuery } from 'react-query'
import { StyleSheet, ScrollView, View, Text, Image, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../GlobalStyles'
import { API_URL } from '../constants'
import axios from 'axios'
import { NeedIndicatorBar } from '../components/ui/NeedIndicatorBar'
import { PlantInfoTag } from '../components/ui/PlantInfoTag'
import { PlantActions } from '../components/PlantActions'
import { IconButton } from '../components/ui/IconButton'
import { UserContext } from '../contexts/UserContext'

export const PlantProfile = ({ route, navigation }) => {
  const { slug } = route.params
  const { currentUser } = useContext(UserContext)
  const [difficulty, setDifficulty] = useState()
  const [toxicity, setToxicity] = useState()
  const [climate, setClimate] = useState()
  const [rarity, setRarity] = useState()
  // TODO: add delete plant confirmation modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    if (currentUser.role === 'admin') {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon='edit'
              size={20}
              color={COLORS.primary100}
              onPress={() => {
                navigation.navigate('ManagePlant', { plant })
              }}
            />
            <IconButton
              icon='delete'
              size={20}
              color={COLORS.error}
              onPress={() => {
                setDeleteModalVisible(true)
              }}
            />
          </View>
        ),
      })
    }
  })

  const { data: plant, status } = useQuery(['plant', slug], async () => {
    try {
      const { data } = await axios.get(`${API_URL}/plant/${slug}`)
      return data.plant
    } catch (err) {
      if (err.response.status === 404) return null
    }
  })

  const getIndicatorWidth = need => {
    // light
    if (need === 'low to bright indirect') return '10%'
    if (need === 'medium to bright indirect') return '50%'
    if (need === 'bright indirect') return '100%'

    // water/humidity
    if (need === 'low') return '10%'
    if (need === 'low to medium') return '25%'
    if (need === 'medium') return '50%'
    if (need === 'medium to high') return '75%'
    if (need === 'high') return '100%'

    // temperature
    if (need === 'average') return '40%'
    if (need === 'above average') return '60%'
  }

  // setting plant care difficulty
  useEffect(() => {
    let lightLevel = 0
    let waterLevel = 0
    let temperatureLevel = 0
    let humidityLevel = 0
    if (plant?.light === 'low to bright indirect') {
      lightLevel = 0
    } else if (plant?.light === 'medium to bright indirect') {
      lightLevel = 1
    } else if (plant?.light === 'bright indirect') {
      lightLevel = 2
    }
    if (plant?.water === 'low') {
      waterLevel = 0
    } else if (plant?.water === 'low to medium') {
      waterLevel = 1
    } else if (plant?.water === 'medium') {
      waterLevel = 2
    } else if (plant?.water === 'medium to high') {
      waterLevel = 3
    } else if (plant?.water === 'high') {
      waterLevel = 4
    }
    if (plant?.temperature === 'average') {
      temperatureLevel = 0
    } else if (plant?.temperature === 'above average') {
      temperatureLevel = 1
    }
    if (plant?.humidity === 'low') {
      humidityLevel = 1
    } else if (plant?.humidity === 'medium') {
      humidityLevel = 2
    } else if (plant?.humidity === 'high') {
      humidityLevel = 3
    }
    let total = lightLevel + waterLevel + temperatureLevel + humidityLevel
    // lowest = 0
    // highest = 12
    if (total <= 3) {
      setDifficulty({ level: 'easy', label: 'Easy care' })
    } else if (total <= 6) {
      setDifficulty({ level: 'moderate', label: 'Moderate difficulty' })
    } else if (total <= 12) {
      setDifficulty({ level: 'hard', label: 'Difficult' })
    }
  }, [plant])

  useEffect(() => {
    setToxicity(
      plant?.toxic === true ? 'Toxic' : plant?.toxic === false ? 'Non-toxic' : 'Toxicity unknown'
    )
    setClimate(plant?.climate || 'Unknown climate')
    setRarity(plant?.rarity || 'Unknown rarity')
  }, [plant])

  return (
    <>
      {status === 'loading' && (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size='large' color={COLORS.primary100} />
        </View>
      )}
      {status === 'success' && plant && (
        <ScrollView
          style={styles.screen}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 20,
          }}>
          <LinearGradient
            style={styles.header}
            colors={['#a4e17d', '#95d190']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.primaryName}>{plant.primaryName}</Text>
            {plant.secondaryName && <Text style={styles.secondaryName}>{plant.secondaryName}</Text>}
          </LinearGradient>
          <View style={styles.info}>
            <Image source={{ uri: plant.imageUrl }} style={styles.image} />
            <View style={styles.needs}>
              <NeedIndicatorBar
                icon={require('../assets/images/light.png')}
                label='Light'
                need={plant.light}
                indicatorWidth={getIndicatorWidth(plant.light)}
              />
              <NeedIndicatorBar
                icon={require('../assets/images/water.png')}
                label='Water'
                need={plant.water}
                indicatorWidth={getIndicatorWidth(plant.water)}
              />
              <NeedIndicatorBar
                icon={require('../assets/images/temperature.png')}
                label='Temperature'
                need={plant.temperature}
                indicatorWidth={getIndicatorWidth(plant.temperature)}
              />
              <NeedIndicatorBar
                icon={require('../assets/images/humidity.png')}
                label='Humidity'
                need={plant.humidity}
                indicatorWidth={getIndicatorWidth(plant.humidity)}
              />
            </View>
            <View style={styles.tags}>
              <PlantInfoTag text={difficulty?.label} />
              <PlantInfoTag text={toxicity} />
              <PlantInfoTag text={climate} />
              <PlantInfoTag text={rarity} />
            </View>
            <Text style={styles.region}>Region of origin: {plant.region || 'Unknown'}</Text>
          </View>
          <PlantActions plant={plant} />
        </ScrollView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  loadingScreen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 10,
  },
  header: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  primaryName: {
    color: COLORS.primary800,
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
  },
  secondaryName: {
    color: COLORS.primary800,
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  info: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  image: {
    width: '100%',
    borderRadius: 16,
    aspectRatio: 1,
  },
  needs: {
    marginVertical: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  region: {
    fontFamily: 'Quicksand-Bold',
    opacity: 0.7,
  },
})

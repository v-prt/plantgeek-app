import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { StyleSheet, ScrollView, View, Text, Image, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../GlobalStyles'
import { API_URL } from '../constants'
import axios from 'axios'
import { NeedIndicatorBar } from '../components/ui/NeedIndicatorBar'
import { PlantInfoTag } from '../components/ui/PlantInfoTag'

export const PlantProfile = ({ route, navigation }) => {
  const { slug, name } = route.params
  const [difficulty, setDifficulty] = useState()
  const [toxicity, setToxicity] = useState()
  const [climate, setClimate] = useState()
  const [rarity, setRarity] = useState()

  useEffect(() => {
    navigation.setOptions({ title: name })
  }, [name])

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
    if (need === 'average') return '25%'
    if (need === 'above average') return '75%'
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
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
      }}>
      {status === 'loading' && <ActivityIndicator size='large' color={COLORS.primary100} />}
      {status === 'success' && plant && (
        <>
          <LinearGradient
            style={styles.header}
            colors={['#a4e17d', '#95d190']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.primaryName}>{plant.primaryName}</Text>
            <Text style={styles.secondaryName}>{plant.secondaryName}</Text>
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
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 10,
  },
  header: {
    width: '100%',
    backgroundColor: COLORS.primary400,
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  primaryName: {
    color: COLORS.primary800,
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 6,
  },
  secondaryName: {
    color: COLORS.primary800,
    fontSize: 18,
    fontStyle: 'italic',
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
    color: COLORS.primary100,
    fontSize: 16,
  },
})
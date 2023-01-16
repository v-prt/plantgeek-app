import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { StyleSheet, ScrollView, View, Text, Image, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../GlobalStyles'
import { API_URL } from '../constants'
import axios from 'axios'
import { NeedIndicatorBar } from '../components/ui/NeedIndicatorBar'

export const PlantProfile = ({ route, navigation }) => {
  const { slug, name } = route.params

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
        // TODO: error/not found
        <>
          <LinearGradient
            style={styles.header}
            colors={['#a4e17d', '#95d190']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.primaryName}>{plant.primaryName.toLowerCase()}</Text>
            <Text style={styles.secondaryName}>{plant.secondaryName?.toLowerCase()}</Text>
          </LinearGradient>
          <View style={styles.info}>
            <Image source={{ uri: plant.imageUrl }} style={styles.image} />
            <View style={styles.needs}>
              <NeedIndicatorBar
                icon={require('../assets/images/light.png')}
                label='Light'
                need={plant.light}
                // TODO: set level based on need
                level={1}
              />
              <NeedIndicatorBar
                icon={require('../assets/images/water.png')}
                label='Water'
                need={plant.water}
                level={1}
              />
              <NeedIndicatorBar
                icon={require('../assets/images/temperature.png')}
                label='Temperature'
                need={plant.temperature}
                level={1}
              />
              <NeedIndicatorBar
                icon={require('../assets/images/humidity.png')}
                label='Humidity'
                need={plant.humidity}
                level={1}
              />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary300,
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
    backgroundColor: '#fff',
    padding: 10,
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
})

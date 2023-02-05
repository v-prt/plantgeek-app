import { useState, useContext } from 'react'
import axios from 'axios'
import { API_URL } from '../constants'
import { useQueryClient } from 'react-query'
import { UserContext } from '../contexts/UserContext'
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native'
import { Formik } from 'formik'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

export const PlantActions = ({ plant }) => {
  const plantId = plant._id
  const queryClient = new useQueryClient()
  const { currentUser } = useContext(UserContext)

  const [owned, setOwned] = useState(currentUser.plantCollection?.includes(plantId))
  const [wanted, setWanted] = useState(currentUser.plantWishlist?.includes(plantId))
  const [liked, setLiked] = useState(plant.hearts?.includes(currentUser._id))

  const actionHandler = async values => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    try {
      await axios.post(`${API_URL}/lists/${currentUser._id}`, values)
      queryClient.invalidateQueries('plant')
      queryClient.invalidateQueries('current-user')
      queryClient.invalidateQueries('collection')
      queryClient.invalidateQueries('wishlist')
    } catch (err) {
      console.log(err)
      Alert.alert('Internal Server Error', 'Something went wrong. Please try again later.')
    }
  }

  const initialValues = {
    plantId,
    // values on plant (ids of users)
    hearts: plant.hearts || [],
    owned: plant.owned || [],
    wanted: plant.wanted || [],
    // values on user (ids of plants)
    plantCollection: currentUser?.plantCollection || [],
    plantWishlist: currentUser?.plantWishlist || [],
  }

  return (
    <View style={styles.wrapper}>
      <Formik initialValues={initialValues} onSubmit={actionHandler}>
        {({ setFieldValue, handleSubmit, values }) => (
          <>
            <Pressable
              onPress={() => {
                //  TODO: if removing from collection, ask user to confirm first (will delete related reminders)
                setFieldValue(
                  'owned',
                  !owned
                    ? [...values.owned, currentUser._id]
                    : values.owned.filter(id => id !== currentUser._id)
                )
                setFieldValue(
                  'plantCollection',
                  !owned
                    ? [...values.plantCollection, plantId]
                    : values.plantCollection.filter(id => id !== plantId)
                )
                setOwned(!owned)
                handleSubmit()
              }}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Text style={styles.actionText}>{owned ? 'Remove from' : 'Add to'} collection</Text>
              <MaterialIcons
                name={owned ? 'remove' : 'add'}
                size={24}
                color={owned ? COLORS.error : COLORS.primary400}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                setFieldValue(
                  'wanted',
                  !wanted
                    ? [...values.wanted, currentUser._id]
                    : values.wanted.filter(id => id !== currentUser._id)
                )
                setFieldValue(
                  'plantWishlist',
                  !wanted
                    ? [...values.plantWishlist, plantId]
                    : values.plantWishlist.filter(id => id !== plantId)
                )
                setWanted(!wanted)
                handleSubmit()
              }}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Text style={styles.actionText}>{wanted ? 'Remove from' : 'Add to'} wishlist</Text>
              <MaterialIcons
                name={wanted ? 'remove' : 'add'}
                size={24}
                color={wanted ? COLORS.error : COLORS.primary400}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                setFieldValue(
                  'hearts',
                  !liked
                    ? [...values.hearts, currentUser._id]
                    : values.hearts.filter(id => id !== currentUser._id)
                )
                setLiked(!liked)
                handleSubmit()
              }}
              style={({ pressed }) => [
                styles.actionButton,
                styles.lastButton,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.actionText}>{liked ? `Don't love` : 'Love'} this</Text>
              <MaterialIcons
                name={liked ? 'thumb-down-off-alt' : 'favorite-border'}
                size={24}
                color={liked ? COLORS.error : COLORS.primary400}
              />
            </Pressable>
          </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
    borderRadius: 16,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary800,
  },
  lastButton: {
    borderBottomWidth: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  actionText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
})

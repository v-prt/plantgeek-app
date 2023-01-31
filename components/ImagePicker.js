import { useState } from 'react'
import { StyleSheet, Pressable, Alert, View, Text, Image } from 'react-native'
import {
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
  PermissionStatus,
} from 'expo-image-picker'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'

export const ImagePicker = ({ currentImage, onSelectImage }) => {
  const [image, setImage] = useState(currentImage)
  const [photosPermissionInfo, requestPermission] = useMediaLibraryPermissions()

  const verifyPermissions = async () => {
    if (photosPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      // hasn't asked for permission yet
      const permissionResponse = await requestPermission()
      return permissionResponse.granted // true or false
    }

    if (photosPermissionInfo.status === PermissionStatus.DENIED) {
      // user has denied permission
      Alert.alert(
        'Insufficient Permissions',
        'You need to grant permission for this app to access your media library in order to upload images.',
        [{ text: 'Okay' }]
      )
      return false
    }

    return true
  }

  const photoHandler = async () => {
    const hasPermission = await verifyPermissions()
    if (!hasPermission) return

    const result = await launchImageLibraryAsync({
      // configure photo options
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1], // only works on android, on ios it's always square
      quality: 0.5, // from 0 to 1, prevent super large images
      base64: true,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri

      // file to upload to cloudinary
      const fileType = result.assets[0].type
      const base64 = result.assets[0].base64
      const file = `data:${fileType};base64,${base64}`

      setImage(uri)
      onSelectImage(file)
    } else return
  }

  return (
    <Pressable
      onPress={photoHandler}
      style={({ pressed }) => [styles.imageContainer, pressed && styles.pressed]}>
      {image ? (
        <Image style={styles.image} source={{ uri: image }} />
      ) : (
        <View style={styles.image} />
      )}
      <View style={styles.textWrapper}>
        <Text style={styles.buttonText}>{image ? 'Change' : 'Upload'} Photo</Text>
        <MaterialIcons
          style={styles.buttonIcon}
          name='photo-library'
          size='16'
          color={COLORS.primary400}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 150,
    width: 150,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primary400,
    borderStyle: 'dashed',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
})

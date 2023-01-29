import { useState, useContext } from 'react'
import { StyleSheet, Pressable, Alert, View, Text, Image } from 'react-native'
import {
  launchImageLibraryAsync,
  // launchCameraAsync,
  useMediaLibraryPermissions,
  PermissionStatus,
} from 'expo-image-picker'
import { UserContext } from '../contexts/UserContext'
import { COLORS } from '../GlobalStyles'
import { MaterialIcons } from '@expo/vector-icons'
const placeholder = require('../assets/images/avatar-placeholder.png')

export const ImagePicker = ({ onSelectImage }) => {
  const { currentUser } = useContext(UserContext)
  const [profilePic, setProfilePic] = useState(currentUser?.imageUrl)
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
        'You need to grant permission for this app to access your media library in order to upload a profile image.',
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

      setProfilePic(uri)
      onSelectImage(file)
    } else return
  }

  return (
    <View style={styles.imageContainer}>
      {profilePic ? (
        <Image style={styles.profilePic} source={{ uri: profilePic }} />
      ) : (
        <Image style={styles.profilePic} source={placeholder} />
      )}
      <Pressable onPress={photoHandler} style={styles.button}>
        <Text style={styles.buttonText}>{profilePic ? 'Change' : 'Upload'} Photo</Text>
        <MaterialIcons
          style={styles.buttonIcon}
          name='photo-library'
          size='16'
          color={COLORS.primary400}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  button: {
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

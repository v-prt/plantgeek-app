import { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Pressable, View, Text, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../GlobalStyles'

export const SearchList = ({ searchVal, setSearchVal, formData, setFormData }) => {
  // TODO: fade in/out animation?
  // TODO: get matching plant names from backend (if longer than 2 characters) from searchVal and add to suggestedList
  const [suggestedList, setSuggestedList] = useState([])
  const [recentSearches, setRecentSearches] = useState([])

  const suggestions = [
    'Aglaonema',
    'Alocasia',
    'Aloe',
    'Anthurium',
    'Bromeliad',
    'Cactus',
    'Calathea',
    'Croton',
    'Ctenanthe',
    'Dieffenbachia',
    'Dracaena',
    'Fern',
    'Ficus',
    'Goeppertia',
    'Homalomena',
    'Hoya',
    'Ivy',
    'Maranta',
    'Monstera',
    'Palm',
    'Peperomia',
    'Philodendron',
    'Pilea',
    'Pothos',
    'Rhaphidophora',
    'Sansevieria',
    'Scindapsus',
    'Stromanthe',
    'Syngonium',
    'Tradescantia',
    'Spathiphyllum',
    'Zamioculcas',
  ]

  useEffect(() => {
    const getRecentSearches = async () => {
      const recentSearches = await AsyncStorage.getItem('recentSearches')
      setRecentSearches(recentSearches?.length > 0 ? JSON.parse(recentSearches) : [])
    }
    getRecentSearches()
  }, [formData])

  useEffect(() => {
    const filteredList = suggestions.filter(item => {
      return item.toLowerCase().includes(searchVal?.toLowerCase())
    })
    setSuggestedList(filteredList)
  }, [searchVal])

  const handleClearRecentSearches = async () => {
    await AsyncStorage.removeItem('recentSearches')
    setRecentSearches([])
  }

  const SuggestionText = ({ text }) => {
    return (
      <Text style={styles.text}>
        {text
          .toLowerCase()
          .split(searchVal.toLowerCase())
          .join(`**${searchVal.toLowerCase()}**`)
          .split('**')
          .map((item, index) => {
            return (
              <Text key={index} style={index % 2 === 1 && styles.boldText}>
                {item}
              </Text>
            )
          })}
      </Text>
    )
  }

  const SuggestionButton = ({ text, index }) => {
    return (
      <Pressable
        key={index}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => {
          // save new recent searches to local storage, limit to last 10 searches
          // FIXME: improve this to not save duplicates
          AsyncStorage.setItem(
            'recentSearches',
            JSON.stringify([text, ...recentSearches].slice(0, 10))
          )
          // submit search and close search list
          setFormData({ ...formData, search: [text] })
          setSearchVal(null)
        }}>
        <Ionicons name='search' size='16' color={COLORS.primary100} />
        <SuggestionText text={text} />
      </Pressable>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
      onScroll={Keyboard.dismiss}
      scrollEventThrottle={16}>
      {recentSearches?.length > 0 && (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listLabel}>Recent Searches</Text>
            <Pressable onPress={handleClearRecentSearches}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          </View>
          {recentSearches?.map((item, index) => {
            return <SuggestionButton text={item} key={index} />
          })}
        </>
      )}
      {suggestedList?.length > 0 && (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listLabel}>Suggested</Text>
          </View>
          {suggestedList.map((item, index) => {
            return <SuggestionButton text={item} key={index} />
          })}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  listLabel: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.8,
  },
  boldText: {
    fontFamily: 'Quicksand-Bold',
    opacity: 1,
  },
  clearButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
})

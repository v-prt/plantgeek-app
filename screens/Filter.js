import { useContext, useEffect } from 'react'
import { StyleSheet, Pressable, Text, View, ScrollView, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { FilterOption } from '../components/ui/FilterOption'
import { PlantContext } from '../contexts/PlantContext'

export const Filter = ({ navigation }) => {
  const { fetching, totalResults, setFormData } = useContext(PlantContext)

  const clearFilters = () => {
    setFormData({ sort: 'name-asc' })
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Text style={styles.results}>
          {fetching ? (
            <ActivityIndicator size='small' color={COLORS.primary100} />
          ) : (
            `${totalResults} results`
          )}
        </Text>
      ),
    })
  }, [fetching])

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.filter}>
        <Text style={styles.label}>Light</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='light' label='Low' value='low to bright indirect' firstChild />
          <FilterOption filter='light' label='Medium' value='medium to bright indirect' />
          <FilterOption filter='light' label='High' value='bright indirect' lastChild />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Water</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='water' label='Low' value='low' firstChild />
          <FilterOption filter='water' label='Low - Med' value='low to medium' />
          <FilterOption filter='water' label='Medium' value='medium' />
          <FilterOption filter='water' label='Med - High' value='medium to high' />
          <FilterOption filter='water' label='High' value='high' lastChild />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Temperature</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='temperature' label='Average' value='average' firstChild />
          <FilterOption
            filter='temperature'
            label='Above Average'
            value='above average'
            lastChild
          />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Humidity</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='humidity' label='Low' value='low' firstChild />
          <FilterOption filter='humidity' label='Medium' value='medium' />
          <FilterOption filter='humidity' label='High' value='high' lastChild />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Toxicity</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='toxicity' label='Toxic' value='toxic' firstChild />
          <FilterOption filter='toxicity' label='Non-toxic' value='nontoxic' lastChild />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Climate</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='climate' label='Tropical' value='tropical' firstChild />
          <FilterOption filter='climate' label='Subtropical' value='subtropical' />
          <FilterOption filter='climate' label='Temperate' value='temperate' />
          <FilterOption filter='climate' label='Desert' value='desert' lastChild />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Rarity</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='rarity' label='Common' value='common' firstChild />
          <FilterOption filter='rarity' label='Uncommon' value='uncommon' />
          <FilterOption filter='rarity' label='Rare' value='rare' />
          <FilterOption filter='rarity' label='Very Rare' value='very rare' />
          <FilterOption filter='rarity' label='Unicorn' value='unicorn' lastChild />
        </ScrollView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  results: {
    fontSize: 16,
  },
  clearButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  filter: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    textTransform: 'uppercase',
    marginVertical: 5,
    marginLeft: 20,
  },
  options: {
    flexDirection: 'row',
  },
})

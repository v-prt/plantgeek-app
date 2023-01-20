import { useContext } from 'react'
import { StyleSheet, Pressable, Text, View, ScrollView, ActivityIndicator } from 'react-native'
import { COLORS } from '../GlobalStyles'
import { FilterOption } from '../components/ui/FilterOption'
import { PlantContext } from '../contexts/PlantContext'

export const Filters = () => {
  const { fetching, totalResults, setFormData } = useContext(PlantContext)

  const clearFilters = () => {
    setFormData({ sort: 'name-asc' })
  }

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.results}>
          {fetching ? (
            <ActivityIndicator size='small' color={COLORS.primary100} />
          ) : (
            `${totalResults} results`
          )}
        </Text>
        <Pressable style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Light</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='light' label='Low' value='low to bright indirect' />
          <FilterOption filter='light' label='Medium' value='medium to bright indirect' />
          <FilterOption filter='light' label='High' value='bright indirect' />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Water</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='water' label='Low' value='low' />
          <FilterOption filter='water' label='Low - Med' value='low to medium' />
          <FilterOption filter='water' label='Medium' value='medium' />
          <FilterOption filter='water' label='Med - High' value='medium to high' />
          <FilterOption filter='water' label='High' value='high' />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Temperature</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='temperature' label='Average' value='average' />
          <FilterOption filter='temperature' label='Above Average' value='above average' />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Humidity</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='humidity' label='Low' value='low' />
          <FilterOption filter='humidity' label='Medium' value='medium' />
          <FilterOption filter='humidity' label='High' value='high' />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Toxicity</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='toxicity' label='Toxic' value='toxic' />
          <FilterOption filter='toxicity' label='Non-toxic' value='nontoxic' />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Climate</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='climate' label='Tropical' value='tropical' />
          <FilterOption filter='climate' label='Subtropical' value='subtropical' />
          <FilterOption filter='climate' label='Temperate' value='temperate' />
          <FilterOption filter='climate' label='Desert' value='desert' />
        </ScrollView>
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Rarity</Text>
        <ScrollView style={styles.options} horizontal={true} showsHorizontalScrollIndicator={false}>
          <FilterOption filter='rarity' label='Common' value='common' />
          <FilterOption filter='rarity' label='Uncommon' value='uncommon' />
          <FilterOption filter='rarity' label='Rare' value='rare' />
          <FilterOption filter='rarity' label='Very Rare' value='very rare' />
          <FilterOption filter='rarity' label='Unicorn' value='unicorn' />
        </ScrollView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.primary800,
    flex: 1,
    padding: 20,
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
    color: COLORS.primary100,
    fontSize: 16,
  },
  clearButton: {},
  clearText: {
    fontFamily: 'Quicksand-Bold',
    color: COLORS.primary400,
    fontSize: 16,
  },
  filter: {
    marginVertical: 10,
  },
  label: {
    color: COLORS.primary100,
    fontSize: 16,
    textTransform: 'uppercase',
    margin: 5,
  },
  // TODO: improve padding/positioning to not cut off on sides before reaching edge of screen
  options: {
    flexDirection: 'row',
  },
})

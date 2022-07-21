import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'

// COMPONENTS
import Map from './assets/components/Map'

// CONSTANTS
import COLORS from './assets/constants/Colors'

// DATA
import covidData_raw from './assets/data/who_data.json'

// FUNCTIONS
import movingAverage from './assets/functions/movingAverage'

// LIBRARIES
import * as d3 from 'd3'
import 'react-native-gesture-handler'

export default function App() {
  const dimensions = Dimensions.get('window')

  const [stat, setStat] = useState('avg_New_cases')
  const [date, setDate] = useState('2022-03-24')

  // Data Manipulation
  const covidData = useMemo(() => {
    const countriesAsArray = Object.keys(covidData_raw).map((key) => ({
      name: key,
      data: covidData_raw[key],
    }))

    const windowSize = 7

    const countriesWithAvg = countriesAsArray.map((country) => ({
      name: country.name,
      data: [...movingAverage(country.data, windowSize)],
    }))

    const onlyCountriesWithData = countriesWithAvg.filter(
      (country) => country.data.findIndex((d, _) => d[stat] >= 10) != -1,
    )

    return onlyCountriesWithData
  }, [])

  const maxY = useMemo(() => {
    return d3.max(covidData, (country) => d3.max(country.data, (d) => d[stat]))
  }, [stat])

  const colorize = useMemo(() => {
    const colorScale = d3
      .scaleSequentialSymlog(d3.interpolateReds)
      .domain([0, maxY])

    return colorScale
  }, [maxY])

  // const [data, setData] = useState({})
  // const [name, setName] = useState('')

  // useEffect(() => {
  //   const url = 'https://km28ifx4dj.execute-api.us-east-1.amazonaws.com/items'

  //   const fetchData = async () => {
  //     const response = await fetch(url)
  //     const data = await response.json()
  //     setData(data)
  //     setName(data.Items[3].first_name)
  //   }
  //   fetchData()
  // }, [])
  // console.log(data)

  return (
    <View style={styles.container}>
      <Map
        dimensions={dimensions}
        data={covidData}
        date={date}
        colorize={colorize}
        stat={stat}
      />
      {/* <Text>Hello {name}!</Text> */}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

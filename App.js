import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function App() {
  const [data, setData] = useState({})
  const [name, setName] = useState('')

  useEffect(() => {
    const url = 'https://km28ifx4dj.execute-api.us-east-1.amazonaws.com/items'

    const fetchData = async () => {
      const response = await fetch(url)
      const data = await response.json()
      setData(data)
      setName(data.Items[3].first_name)
    }
    fetchData()
  }, [])
  console.log(data)

  return (
    <View style={styles.container}>
      <Text>Hello {name}!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

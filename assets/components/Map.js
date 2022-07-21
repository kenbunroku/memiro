import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import { Dimensions, StyleSheet, View, Animated } from 'react-native'

// LIBRARIES
import Svg, { G, Path, Circle } from 'react-native-svg'
import * as d3 from 'd3'
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler'

// CONSTANTS
import { COUNTRIES } from '../constants/CountryShapes'
import COLORS from '../constants/Colors'

// COMPONENTS
import Button from './Button'

const Map = (props) => {
  const [countryList, setCountryList] = useState([])
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [lastTranlateX, setLastTranslateX] = useState(0)
  const [lastTranlateY, setLastTranslateY] = useState(0)
  const [buttonOpacity, _] = useState(new Animated.Value(0))

  const { dimensions, data, date, colorize, stat } = props

  // Gesture Handlers
  const panStateHandler = (event) => {
    if (event.nativeEvent.oldState === State.UNDETERMINED) {
      setLastTranslateX(translateX)
      setLastTranslateY(translateY)
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    }
  }

  const panGestureHandler = (event) => {
    setTranslateX(event.nativeEvent.translationX + lastTranlateX)
    setTranslateY(event.nativeEvent.translationY + lastTranlateY)
  }

  // Initialize Map Transforms
  const initializeMap = () => {
    setTranslateX(0)
    setTranslateY(0)
    Animated.timing(buttonOpacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  // Create Map Paths
  const mapExtent = useMemo(() => {
    return dimensions.width > dimensions.height / 2
      ? dimensions.height / 2
      : dimensions.width
  }, [dimensions])

  const countryPaths = useMemo(() => {
    const clipAngle = 155

    const projection = d3
      .geoAzimuthalEqualArea()
      .center([180, -180])
      .rotate([0, -90])
      .fitSize([mapExtent, mapExtent], {
        type: 'FeatureCollection',
        features: COUNTRIES,
      })
      .clipAngle(clipAngle)
      .translate([dimensions.width / 2, mapExtent / 2])

    const geoPath = d3.geoPath().projection(projection)

    const windowPaths = COUNTRIES.map(geoPath)

    return windowPaths
  })

  useEffect(() => {
    setCountryList(
      countryPaths.map((path, i) => {
        const curCountry = COUNTRIES[i].properties.name

        const isCountryNameInData = data.some(
          (country) => country.name === curCountry,
        )

        const curCountryData = isCountryNameInData
          ? data.find((country) => country.name === curCountry)['data']
          : null

        const isDataAvailable = isCountryNameInData
          ? curCountryData.some((data) => data.Date_reported === date)
          : false

        const dateIndex = isDataAvailable
          ? curCountryData.findIndex((x) => x.Date_reported === date)
          : null

        return (
          <Path
            key={COUNTRIES[i].properties.name}
            d={path}
            stroke={COLORS.greyLight}
            strokeOpacity={0.3}
            strokeWidth={0.6}
            fill={
              isDataAvailable
                ? colorize(curCountryData[dateIndex][stat])
                : COLORS.greyLight
            }
            opacity={isDataAvailable ? 1 : 0.4}
          />
        )
      }),
    )
  }, [])

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={(e) => panGestureHandler(e)}
        onHandlerStateChange={(e) => panStateHandler(e)}
      >
        <Svg
          width={dimensions.width}
          height={dimensions.height / 2}
          style={styles.svg}
        >
          <G transform={`translate(${translateX}, ${translateY})`}>
            <Circle
              cx={dimensions.width / 2}
              cy={mapExtent / 2}
              r={mapExtent / 2}
              fill={COLORS.lightPrimary}
            />
            {countryList.map((x) => x)}
          </G>
        </Svg>
      </PanGestureHandler>
      <Button
        buttonStyle={{
          opacity: buttonOpacity,
        }}
        onPress={initializeMap}
        text={<>&#x21bb;</>}
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  svg: {},
})

export default Map

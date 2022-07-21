export default (data, windowSize) => {
  let newData = []

  for (let i = windowSize - 1; i < data.length; i++) {
    const averages = {}
    for (let stat of ['New_cases', 'New_deaths']) {
      const curWindowData = data.slice(i - windowSize + 1, i + 1)

      const average =
        curWindowData.reduce((acc, cur) => cur[stat] + acc, 0) / windowSize

      const keyName = 'avg_' + stat
      averages[keyName] = Math.round(average)
    }

    newData.push({ ...data[i], ...averages })
  }
  return newData
}

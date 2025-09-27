import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UploadWork from '../components/UploadWork'

const Assignment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Submit your assignment</Text>
      <View style={styles.line} />
      <Text style={{textAlign: "left", marginTop: 5, fontSize: 16, marginHorizontal: 20, fontWeight: "semi-bold"}}>
        Due date: 30th June 2024
      </Text>
      <UploadWork />
    </View>
  )
}

export default Assignment

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    alignItems: "center",
    alignContent: "center",
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 30,
    textAlign: "center",
  },
  
    line: {
    width: '90%',     // take most of the screen width
    height: 5,        // thin line
    backgroundColor: '#000', // black color
    marginVertical: 10,
  }, 
}) 
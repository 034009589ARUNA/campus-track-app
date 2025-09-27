import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import LocationPermission from '../components/LocationPermission'

const Attendance = () => {
  return (
     <View style={styles.container}> 
      <Text style={styles.header}>Attendance Verification</Text>
      <Text style={styles.subHeader}>To make yourself present, enter the code provided by the lecturer</Text>
  <View style={styles.row}>   
      <Text style={{marginRight: 300, alignContent: "center", fontWeight: "semi-bold", fontSize: 20, marginTop: 10, textAlign: "center"}}>Code:</Text>
      <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 20, padding: 10, borderRadius: 20, marginTop: 10}} placeholder="Enter code here" />
      <Text style={{ alignContent: "center", fontWeight: "semi-bold", fontSize: 16, marginTop: 10, textAlign: "center", fontStyle: "italic", padding: 10 }} >
        To ensure you are in class, please 
          verify your location
      </Text>
      <LocationPermission />
   </View>   
   
      
      </View>
  )
}

export default Attendance



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
   
    alignItems: "center",
    alignContent: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
    textAlign: "center",
},
  subHeader: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    marginHorizontal: 20,
    fontWeight: "bold",
  },
  row: {
   
    
    marginTop: 100,
  }
});


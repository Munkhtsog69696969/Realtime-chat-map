import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button, TextInput } from 'react-native';
// import MapView from "react-native-maps"
// import {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Ably from "ably"

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

   

  const ably = new Ably.Realtime.Promise('f6Y5Hg.Zq7QBg:4a_RlG4_RzF7LfTQhy_DAOsBpEZPiLfTjcz3_IFsHDo');
  ably.connection.once('connected');
  // console.log('Connected to Ably!');

  const channel = ably.channels.get('quickstart');

  channel.subscribe('greeting', (message) => {
    // console.log(message.name)
    setMessages(messages=>[...messages , message.data])
  });

  const Send=async()=>{
    await channel.publish('greeting', {input});
  }


  return (
    <View style={styles.container}>
      {/* <MapView 
        region={{
          longitude:location ? location.coords.longitude : 0,
          latitude:location ? location.coords.latitude : 0
        }} 
        showsUserLocation={true} style={styles.map}
      >
        <Marker coordinate={{
          longitude:location ? location.coords.longitude : 0,
          latitude:location ? location.coords.latitude : 0
        }} />
      </MapView> */}
      <TextInput
       onChangeText={setInput}
       value={input}
      />
      <Button
        title='Send'
        onPress={Send}
      />
      {
        messages?.map((message,i)=>{
          return(
            <Text>
              {message.input}
            </Text>
          )
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    width:"100%",
    height:"100%"
  }
});

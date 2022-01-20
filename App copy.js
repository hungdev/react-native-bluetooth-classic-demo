import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, FlatList, TouchableOpacity } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function App() {
  const [discovering, setDiscovering] = useState();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState();
  const [connectedDevice, setConnectedDevice] = useState();

  useEffect(() => {
    getBondedDevices();
  }, []);


  const getBondedDevices = async (unloading) => {
    console.log('DeviceListScreen::getBondedDevices');
    try {
      let bonded = await RNBluetoothClassic.getBondedDevices();
      console.log('DeviceListScreen::getBondedDevices found', bonded);
      setDevices(bonded);

    } catch (error) {

    }
  };

  const onConnect = (device) => async () => {
    try {
      setSelectedDevice(device);
      let connection = await device.isConnected();
      console.log('connection', connection);
      connection = await device.connect();
      console.log('connection2', connection);
      const data = await device.read();
      console.log('data', data);
      setConnectedDevice(connection);
      // initializeRead();
    } catch (error) {

    }
  };

  const initializeRead = async () => {
    this.disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => disconnect(true));
    // const readSubscription = selectedDevice.onDataReceived(data => console.log('reading', data));
    let data = await selectedDevice.read();

    console.log(`Read data ${data}`);
    // if (this.state.polling) {
    //   this.readInterval = setInterval(() => performRead(), 5000);
    // } else {
    //   this.readSubscription = selectedDevice.onDataReceived(data =>
    //     this.onReceivedData(data)
    //   );
    // }
  };


  // const  performRead = async () => {
  //   try {
  //     console.log('Polling for available messages');
  //     let available = await selectedDevice.available();
  //     console.log(`There is data available [${available}], attempting read`);

  //     if (available > 0) {
  //       for (let i = 0; i < available; i++) {
  //         console.log(`reading ${i}th time`);
  //         let data = await selectedDevice.read();

  //         console.log(`Read data ${data}`);
  //         console.log(data);
  //         this.onReceivedData({ data });
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }


  const disconnect = () => {

  };


  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ marginTop: 20 }} onPress={onConnect(item)}>
      <Text>{item?.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text>aaa</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Touchable } from 'react-native';
import styles from './styles/Home.Styles';
import useBluetooth from './useBluetooth';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function Home() {

  const onReceivedDataScan = useCallback((data) => {
    console.tron.log('data?.data', data?.data); // 
    alert(data?.data);
  }, []);


  const { connection, setDevice, data, } = useBluetooth(onReceivedDataScan);

  useEffect(() => {
    getBondedDevices();
  }, []);

  const getBondedDevices = async () => {
    console.tron.log('-- GETTING BONDED DEVICES --');
    try {
      const listBondedDevices = await RNBluetoothClassic.getBondedDevices();
      const dv = listBondedDevices?.find(e => e.id === "F4:5E:AB:DB:1F:B9");
      setDevice(dv);
    } catch (err) {
      console.tron.log(err);
    }
  };



  return (
    <View style={styles.container}>

    </View>
  );
}

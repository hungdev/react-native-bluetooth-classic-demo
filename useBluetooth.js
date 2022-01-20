import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function BluetoothClassic(onReceivedDataScan) {
  const [device, setDevice] = useState();
  const [data, setData] = useState([]);
  const [connection, setConnection] = useState(false);

  useEffect(() => {
    device && setTimeout(() => connect(), 0);
  }, [device]);

  const addData = (message) => setData(prev => [message, ...prev]);

  const connect = async () => {
    try {
      let connection = await device.isConnected();
      if (!connection) {
        addData({
          data: `Attempting connection to ${device.address}`,
          timestamp: new Date(),
          type: 'error',
        });

        connection = await device.connect();

        addData({
          data: 'Connection successful',
          timestamp: new Date(),
          type: 'info',
        });
      } else {
        addData({
          data: `Connected to ${device.address}`,
          timestamp: new Date(),
          type: 'error',
        });
      }

      setConnection(connection);
      initializeRead();
    } catch (error) {
      addData({
        data: `Connection failed: ${error.message}`,
        timestamp: new Date(),
        type: 'error',
      });
    }
  };

  const disconnect = async (disconnected) => {
    console.tron.log('disconnected', disconnected);
    connect();
    try {
      if (!disconnected) {
        disconnected = await device.disconnect();
      }

      addData({
        data: 'Disconnected',
        timestamp: new Date(),
        type: 'info',
      });

      setConnection(!disconnected);
    } catch (error) {
      addData({
        data: `Disconnect failed: ${error.message}`,
        timestamp: new Date(),
        type: 'error',
      });
    }

    // Clear the reads, so that they don't get duplicated
    uninitializeRead();
  };



  const initializeRead = () => {
    disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => disconnect(true));

    readSubscription = device.onDataReceived(data => onReceivedData(data));
  };

  /**
 * Clear the reading functionality.
 */
  const uninitializeRead = () => {
    if (readInterval) {
      clearInterval(readInterval);
    }
    if (readSubscription) {
      readSubscription.remove();
    }
  };

  const onReceivedData = (event) => {
    event.timestamp = new Date();
    const dataReceived = {
      ...event,
      timestamp: new Date(),
      type: 'receive',
    };
    addData(dataReceived);
    onReceivedDataScan?.(dataReceived);
  };



  return { connect, disconnect, connection, setDevice, data, uninitializeRead };
}

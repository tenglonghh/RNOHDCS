import {StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {TestSuite, TestCase, Tester} from '@rnoh/testerino';

export function onErrorTest() {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const camera = useRef<Camera>(null);

  if (!device) {
    return <Text>No Devices</Text>;
  }

  if (!hasPermission) {
    requestPermission();
  }

  const [codes, setCodes] = useState('暂未扫描');
  const codeScanner = useCodeScanner({
    codeTypes: [
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'ean-13',
      'ean-8',
      'itf',
      'upc-e',
      'upc-a',
      'qr',
      'pdf-417',
      'aztec',
      'data-matrix',
    ],
    onCodeScanned: (codes: string | any[]) => {
      if (codes.length) {
        setIsActive(false);
      }
      let codeStr = JSON.stringify(codes[0].value);
      setCodes(codeStr);
    },
  });

  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<string>('');

  return (
    <Tester>
      <TestSuite name="onInitialized:">
        <TestCase itShould={`初始化成功的回调`}>
          <View>
            <Text style={styles.text}>status:{status}</Text>
            <Text style={styles.text}>codes:{codes}</Text>
          </View>
          <Camera
            style={styles.cameraPreview}
            ref={camera}
            codeScanner={codeScanner}
            device={device}
            isActive={isActive}
            preview
            onInitialized={() => {
              setStatus('我是onInitialized：初始化成功执行');
            }}
          />
        </TestCase>
      </TestSuite>
    </Tester>
  );
}

const styles = StyleSheet.create({
  cameraPreview: {
    width: 300,
    height: 400,
  },
  actionBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
});
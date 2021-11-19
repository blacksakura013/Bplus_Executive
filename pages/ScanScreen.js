import React, { useState, useEffect } from 'react';

import { StyleSheet, Platform,View, Text, Alert, TouchableOpacity } from 'react-native';

import { RNCamera } from 'react-native-camera';


import { decode } from 'jpeg-js';
import jsQR from 'jsqr';
import QRCodeScanner from 'react-native-qrcode-scanner';

 
 import * as  ImagePicker from 'react-native-image-picker';
 
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { FontSize } from '../components/FontSizeHelper';
import { Language } from '../translations/I18n';

import { QRreader } from 'react-native-qr-decode-image-camera';

const ScanScreen = ({ navigation, route }) => {
  let checkAndroidPermission = true
  useEffect(() => {
    console.log(route.params)
}, [])
 
  if (Platform.OS === 'android' && Platform.Version < 23) {
    checkAndroidPermission = false
  }
  const onSuccess = (e) => {

    if (e && e.type != 'QR_CODE' && e.type != 'org.iso.QRCode') {
      Alert.alert(Language.t('alert.errorTitle'), Language.t('selectBase.notfound'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    } else {
      if (e && e.data && e.data.indexOf('/name:') == -1) {
        Alert.alert(Language.t('alert.errorTitle'), Language.t('selectBase.invalid'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        navigation.goBack();
      } else {
        let result = e.data.split('/name:');
        let url = result[0].split('.dll')

        let newObj = { label: url[0]+'.dll', value: result[1] };
        navigation.navigate(route.params.route, { post: newObj });
      }
    }
  };

  const chooseFile = () => {
    let options = {
      title: Language.t('selectBase.SelectImg'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('response.didCancel');
      } else if (response.error) {
        console.log('response.error');
      } else {
        let path = response.assets[0].path;
        if (!path) {
          path = response.assets[0].uri;
        }
        if(Platform.OS === 'android' && path.startsWith('file://')){
          //แทนที่ (หา,ที่แทนลงไป)
          path = path.replace(/file:\/\//, ''  )
        }
        console.log('response ==>>',response.assets[0].uri)
        console.log('path ==>>',path)
        QRreader(path)
          .then((data) => {
            console.log(data)
            let result = data.split('/name:');
            let url = result[0].split('.dll')
            let newObj = {label: url[0]+'.dll', value: result[1]};
            navigation.navigate(route.params.route, {post: newObj});
          })
          .catch((error) => {
            console.log(error);
            Alert.alert(Language.t('alert.errorTitle'), Language.t('selectBase.notfound'),[{text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed')}]);
          });
      }
    });
  };

  return (
    <QRCodeScanner
    checkAndroid6Permissions={checkAndroidPermission}
      onRead={onSuccess}
      cameraType={'back'}
      fadeIn={true}
      reactivate={true}
      showMarker={true}
      topContent={

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 10,
            flex: 1,
          }}>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.buttonTouchable1}>
            <Icon name="angle-left" size={30} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={chooseFile}
            style={styles.buttonTouchable2}>
            <Text style={styles.buttonText}>
              {Language.t('selectBase.SelectImg')}
            </Text>
          </TouchableOpacity>
        </View>
      }
      topViewStyle={{

        alignItems: 'flex-start',
        flexDirection: 'row',
      }}

    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: FontSize.medium,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: FontSize.medium,
    color: 'black',

  },
  buttonTouchable1: {
    alignSelf: 'flex-start',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    //padding: 16,
  },
  buttonTouchable2: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 5,

    //flex:1
    //padding: 16,
  },
});
const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);

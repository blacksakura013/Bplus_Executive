import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Text,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker, } from '@react-native-picker/picker';
import { useStateIfMounted } from 'use-state-if-mounted';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNRestart from 'react-native-restart';
import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import DropDownPicker from 'react-native-dropdown-picker';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../src/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';
import { Language } from '../translations/I18n';
import DeviceInfo from 'react-native-device-info';

import * as loginActions from '../src/actions/loginActions';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

const SelectBase = ({ route }) => {
  const serviceID = "{167f0c96-86fd-488f-94d1-cc3169d60b1a}"
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    container2,
    container1,
    button,
    textButton,
    topImage,
    tabbar,
    buttonContainer,
  } = styles;

  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  const [selectedValue, setSelectedValue] = useState('');
  const [selectbaseValue, setSelectbaseValue] = useState(databaseReducer.Data.nameser ? databaseReducer.Data.nameser : null);
  const [basename, setBasename] = useState('');
  const [baseurl, setBsaeurl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShowDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useStateIfMounted(false);

  const [machineNo, setMachineNo] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [data, setData] = useStateIfMounted({
    secureTextEntry: true,
  });


  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  useEffect(() => {
    getMacAddress()



    console.log('/n/n/nipAddress :', loginReducer.ipAddress)


  }, []);


  useEffect(() => {
    if (route.params?.post) {
      setBasename(route.params.post.value)
      setBsaeurl(route.params.post.label)
    }
  }, [route.params?.post]);
  useEffect(() => {

    console.log('\n', registerReducer.machineNum)
    for (let i in loginReducer) {
      console.log(loginReducer[i])
    }
  }, [registerReducer.machineNum]);
  const _onPressSelected = async () => {
    setLoading(true)
    for (let i in loginReducer.ipAddress) {
      if (loginReducer.ipAddress[i].nameser == selectbaseValue) {
        dispatch(databaseActions.setData(loginReducer.ipAddress[i]));
        setTimeout(() => {
          RNRestart.Restart();
        }, 1000);
      }
    }
  }
  const _onPressEdit = () => {
    navigation.navigate('EditBase', {
      selectbaseValue: selectbaseValue,
    });
  }
  const checkValue = () => {
    let c = true
    if (basename == '') {
      Alert.alert('ข้อมูลไม่ถูกต้อง')
      c = false
    }
    else if (baseurl == '') {
      Alert.alert('ข้อมูลไม่ถูกต้อง')
      c = false
    }
    else if (username == '') {
      Alert.alert('ข้อมูลไม่ถูกต้อง')
      c = false
    }
    else if (password == '') {
      Alert.alert('ข้อมูลไม่ถูกต้อง')
      c = false
    }
    return c
  }
  const _onPressAddbase = async () => {
    setLoading(true)
    if (checkValue() == true) {
      let temp = []
      let check = false;
      console.log(checkIPAddress())
      temp = loginReducer.ipAddress;
      for (let i in loginReducer.ipAddress) {
        if (
          loginReducer.ipAddress[i].urlser == baseurl
        ) {
          setShowDialog(false);
          Alert.alert('', Language.t('selectBase.Alert'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          check = true;

          break;
        }
      }
      if (!check) {


        if (checkIPAddress() == false) {
          Alert.alert('', Language.t('selectBase.UnableConnec'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          setShowDialog(false);
        } else {
          await fetch(baseurl + 'DevUsers', {
            method: 'POST',
            body: JSON.stringify({
              'BPAPUS-BPAPSV': loginReducer.serviceID,
              'BPAPUS-LOGIN-GUID': '',
              'BPAPUS-FUNCTION': 'Login',
              'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "' +
                registerReducer.machineNum +
                '","BPAPUS-USERID": "' +
                username +
                '","BPAPUS-PASSWORD": "' +
                password +
                '"}',
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              if (json && json.ResponseCode == '635') {
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                console.log('NOT FOUND MEMBER');
              } else if (json && json.ResponseCode == '629') {
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                console.log('Function Parameter Required');
              } else if (json && json.ResponseCode == '609') {
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              } else if (json && json.ResponseCode == '200') {

                let newObj = {
                  nameser: basename,
                  urlser: baseurl,
                  usernameser: username,
                  passwordser: password
                }
                console.log(json.ResponseCode)
                temp.push(newObj)
                dispatch(loginActions.ipAddress(temp))
                dispatch(databaseActions.setData(newObj))
                setTimeout(() => {
                  RNRestart.Restart();
                }, 1000);
              } else {
                Alert.alert(
                  Language.t('alert.errorTitle'),
                  Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              }
            })
            .catch((error) => {
              Alert.alert(
                Language.t('alert.errorTitle'),
                Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
              console.error('_fetchGuidLogin ' + error);
            });

        }
      }

    } else {
      Alert.alert(
        Language.t('alert.errorTitle'),
        Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    }
    setLoading(false)
  }

  const getMacAddress = async () => {
    await DeviceInfo.getMacAddress().then((androidId) => {
      dispatch(registerActions.machine(androidId));
      setMachineNo(androidId);
    });
  };

  // const checkIPAddress = async (url) => {
  //   let result = false;
  //   await fetch(url + 'DevUsers', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       'BPAPUS-BPAPSV': '{167f0c96-86fd-488f-94d1-cc3169d60b1a}',
  //       'BPAPUS-LOGIN-GUID': '',
  //       'BPAPUS-FUNCTION': 'Register',
  //       'BPAPUS-PARAM':
  //         '{ "BPAPUS-MACHINE": "11111122","BPAPUS-CNTsRY-CODE": "66", "BPAPUS-MOBILE": "0828845662"}',
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
  //         result = true;
  //       } else {
  //         console.log('checkIPAddress FAILED');
  //         result = false;
  //       }
  //       console.log('checkIPAddress FAILED');
  //     })
  //     .catch((error) => {
  //       result = false;
  //       console.log('checkIPAddress', error);
  //     });
  //   return result;
  // };

  const checkIPAddress = async () => {
    console.log('baseurl : ', baseurl)
    console.log('serviceID : ', serviceID)
    console.log('registerReducer.machineNum : ', registerReducer.machineNum)
    console.log('username : ', username)
    let result = true;
    fetch(baseurl + 'DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          return true;
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          console.log('checkIPAddress FAILED');
          result = false;
        }
      })
      .catch((error) => {
        result = false;
        Alert.alert(
          Language.t('alert.errorTitle'),
          Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        console.log('checkIPAddress');
      });
    return result;
  };

  return (
    <View style={container1}>
      <View style={tabbar}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={20} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 12,
              fontSize: FontSize.medium,
              color: Colors.backgroundLoginColor,
            }}> ตั้งค่าฐานข้อมูล</Text>
        </View>
        <View>
          <Picker
            selectedValue={selectedValue}
            style={{ width: 110 }}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
            <Picker.Item label="TH" value="thai" />
            <Picker.Item label="EN" value="eng" />
          </Picker>
        </View>

      </View>

      <SafeAreaView >
        <View style={styles.body}>
          <View style={styles.body1}>
            <Text style={styles.textTitle}>
              เลือกฐานข้อมูล :
            </Text>
          </View>
          <View style={styles.body1}>
            {loginReducer.ipAddress.length > 0 ? (
              <Picker
                selectedValue={selectbaseValue}
                enabled={true}
                mode="dropdown"
                style={{ width: '100%', backgroundColor: '#fff', borderRadius: 10, }}
                onValueChange={(itemValue, itemIndex) => setSelectbaseValue(itemValue)}>
                {loginReducer.ipAddress.map((obj, index) => {
                  return (
                    <Picker.Item label={obj.nameser} value={obj.nameser} />
                  )
                })}
              </Picker>
            ) : (
              <Picker
                selectedValue={selectbaseValue}
                style={{
                  width: '100%', backgroundColor: '#fff', borderRadius: 10,
                }}
                onValueChange={(item) => {
                  setTitle(item);
                }}
                enabled={false}
                mode="dropdown"
                itemStyle={{}}>
                {
                  <Picker.Item
                    value="-1"
                    label={Language.t('selectBase.lebel')}
                  />
                }
              </Picker>
            )}
          </View>

          <View style={styles.body1e}>

            <TouchableNativeFeedback
              onPress={() => _onPressSelected()}>
              <View
                style={{
                  borderRadius: 10,
                  flexDirection: 'column',
                  marginLeft: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  width: 100,
                  backgroundColor: Colors.buttonColorPrimary,
                }}>
                <Text
                  style={{
                    color: Colors.fontColor2,
                    alignSelf: 'center',
                    fontSize: FontSize.medium,
                    fontWeight: 'bold',
                  }}>
                  เชื่อต่อ
                </Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => _onPressEdit()}>
              <View
                style={{
                  borderRadius: 10,
                  flexDirection: 'column',
                  marginLeft: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  width: 100,
                  backgroundColor: 'red',
                }}>
                <Text
                  style={{
                    color: Colors.fontColor2,
                    alignSelf: 'center',
                    fontSize: FontSize.medium,
                    fontWeight: 'bold',
                  }}>
                  แก้ไข
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.textTitle}>
              ชื่อฐานข้อมูล :
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: Colors.backgroundLoginColorSecondary,
                flexDirection: 'column',
                height: 50,
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10
              }}>
              <View style={{ height: 30, flexDirection: 'row' }}>
                <FontAwesome name="database" size={30} color={Colors.backgroundLoginColor} />
                <TextInput
                  style={{
                    flex: 8,
                    marginLeft: 10,
                    borderBottomColor: Colors.borderColor,
                    color: Colors.fontColor,
                    paddingVertical: 3,
                    fontSize: FontSize.medium,
                    borderBottomWidth: 0.7,
                  }}

                  placeholderTextColor={Colors.fontColorSecondary}

                  placeholder={'ชื่อฐานข้อมูล'}
                  value={basename}
                  onChangeText={(val) => {
                    setBasename(val);
                  }}></TextInput>
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('ScanScreen')}>

                  <FontAwesome
                    name="qrcode"
                    size={25}
                    color={Colors.buttonColorPrimary}
                  />

                </TouchableOpacity>

              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.textTitle}>
              ที่อยู่ฐานข้อมูล :
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: Colors.backgroundLoginColorSecondary,
                flexDirection: 'column',
                height: 50,
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10
              }}>
              <View style={{ height: 30, flexDirection: 'row' }}>
                <FontAwesome name="refresh" size={30} color={Colors.backgroundLoginColor} />
                <TextInput
                  style={{
                    flex: 8,
                    marginLeft: 10,
                    borderBottomColor: Colors.borderColor,
                    color: Colors.fontColor,
                    paddingVertical: 3,
                    fontSize: FontSize.medium,
                    borderBottomWidth: 0.7,
                  }}

                  placeholderTextColor={Colors.fontColorSecondary}

                  value={baseurl}
                  placeholder={'ที่อยู่ฐานข้อมูล'}
                  onChangeText={(val) => {
                    setBsaeurl(val);
                  }}></TextInput>

              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.textTitle}>
              ชื่อผู้ใช้ :
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: Colors.backgroundLoginColorSecondary,
                flexDirection: 'column',
                height: 50,
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10
              }}>
              <View style={{ height: 30, flexDirection: 'row' }}>
                <FontAwesome name="user" size={30} color={Colors.backgroundLoginColor} />
                <TextInput
                  style={{
                    flex: 8,
                    marginLeft: 5,
                    borderBottomColor: Colors.borderColor,
                    color: Colors.fontColor,
                    paddingVertical: 3,
                    fontSize: FontSize.medium,
                    borderBottomWidth: 0.7,
                  }}

                  placeholderTextColor={Colors.fontColorSecondary}

                  value={username}
                  placeholder={'ชื่อผู้ใช้'}
                  onChangeText={(val) => {
                    setUsername(val);
                  }}></TextInput>

              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.textTitle}>
              รหัสผ่าน :
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: Colors.backgroundLoginColorSecondary,
                flexDirection: 'column',
                height: 50,
                borderRadius: 10,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10
              }}>
              <View style={{ height: 30, flexDirection: 'row' }}>
                <FontAwesome name="lock" size={30} color={Colors.backgroundLoginColor} />
                <TextInput
                  style={{
                    flex: 8,
                    marginLeft: 5,
                    color: Colors.fontColor,
                    paddingVertical: 3,
                    fontSize: FontSize.medium,
                    borderBottomColor: Colors.borderColor,
                    borderBottomWidth: 0.7,
                  }}
                  secureTextEntry={data.secureTextEntry ? true : false}
                  keyboardType="default"

                  placeholderTextColor={Colors.fontColorSecondary}
                  placeholder={'รหัสผ่าน'}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                  }}
                />

                <TouchableOpacity style={{ marginLeft: 10 }} onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <FontAwesome
                      name="eye-slash"
                      size={25}
                      color={Colors.buttonColorPrimary}
                    />
                  ) : (
                    <FontAwesome
                      name="eye"
                      size={25}
                      color={Colors.buttonColorPrimary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableNativeFeedback
              onPress={() => _onPressAddbase()}>
              <View
                style={{
                  borderRadius: 10,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: 50,
                  backgroundColor: Colors.buttonColorPrimary,
                }}>
                <Text
                  style={{
                    color: Colors.fontColor2,
                    alignSelf: 'center',
                    fontSize: FontSize.medium,
                    fontWeight: 'bold',
                  }}>
                  เชื่อต่อ
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>

        </View>
        {loading && (
          <View
            style={{
              width: deviceWidth,
              height: deviceHeight,
              opacity: 0.5,
              backgroundColor: 'black',
              alignSelf: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              position: 'absolute',
            }}>
            <ActivityIndicator
              style={{
                borderRadius: 15,
                backgroundColor: null,
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
              animating={loading}
              size="large"
              color={Colors.lightPrimiryColor}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundLoginColor,
    flex: 1,
    flexDirection: 'column',
  },
  body: {
    margin: 10
  },
  body1e: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: 'flex-end'
  },
  body1: {
    marginTop: 20,
    flexDirection: "row",
  },
  tabbar: {
    height: 70,
    padding: 12,
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: '#E6EBFF',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dorpdown: {
    justifyContent: 'center',
    fontSize: FontSize.medium,
  },
  dorpdownTop: {
    justifyContent: 'flex-end',
    fontSize: FontSize.medium,
  },
  textTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#ffff',
  },
  imageIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textButton: {
    fontSize: FontSize.large,
    color: Colors.fontColor2,
  },
  buttonContainer: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
    borderBottomColor: '#ffff',
    color: '#ffff',
  },
  label: {
    margin: 8,
    color: '#ffff',
  },
});
const mapStateToProps = (state) => {
  return {

    machineNum: state.registerReducer.machineNum,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    reduxMachineNum: (payload) => dispatch(registerActions.machine(payload)),

  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectBase);

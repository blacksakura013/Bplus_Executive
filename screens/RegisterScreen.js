import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import moment from 'moment';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Language } from '../translations/I18n';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { FontSize } from '../components/FontSizeHelper';

import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useStateIfMounted } from 'use-state-if-mounted';
import Colors from '../src/Colors';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import * as loginActions from '../src/actions/loginActions';
import * as registerActions from '../src/actions/registerActions';
import * as databaseActions from '../src/actions/databaseActions';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
const RegisterScreen = () => {
  const [loading, setLoading] = useStateIfMounted(false);
  const navigation = useNavigation();
  const [date, setDate] = useState(moment().format('YYYYMMDD'));
  const [rePass, setRePass] = useState('');
  const [resultJson, setResultJson] = useState('');
  const [GUID, setGUID] = useState('');
  const [machineNo, setMachineNo] = useState('');


  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);

  const [userIndex, setUserIndex] = useState(loginReducer.index);
  const dispatch = useDispatch();
  const [title, setTitle] = useState(Language.t('register.select'));

  const [data, setData] = useState({
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const [data2, setdata2] = useState(false);
  const [data3, setdata3] = useState(false);

  const [newData, setNewData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    password: '',
    birthDate: moment().format('YYYYMMDD'),
    phoneNum: '',
    idCard: '',

  });
  var ser_die = true
  const textInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const regisMacAdd = async () => {
    console.log('REGIS MAC ADDRESS' + loginReducer.serviceID);
    await fetch(databaseReducer.Data.urlser + 'DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Register',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE":"' +
          registerReducer.machineNum +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "0828845662"}',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
          await _fetchGuidLogin();
        } else {
          console.log('REGISTER MAC FAILED');
        }
      })
      .catch((error) => {
        console.log('ERROR at regisMacAdd ' + error);

        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      });
  };

  const _fetchGuidLogin = async () => {
    console.log('FETCH GUID LOGIN');
    let GUID = '';
    await fetch(databaseReducer.Data.urlser + 'DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'Login',
        'BPAPUS-PARAM':
        '{"BPAPUS-MACHINE": "' +
        registerReducer.machineNum +
        '","BPAPUS-USERID": "' +
        loginReducer.userNameED +
        '","BPAPUS-PASSWORD": "' +
        loginReducer.passwordED +
        '"}',
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let responseData = JSON.parse(json.ResponseData);
        dispatch(loginActions.userName(newData.phoneNum))
        dispatch(loginActions.password(newData.password))
        navigation.navigate('Login')
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (databaseReducer.Data.urlser == '') {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
            Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
        }
        setLoading(false)
      });

  };

  const fetchUserData = async (GUID) => {
    console.log('FETCH LookupErp');
    let xresult = '';

    await fetch(databaseReducer.Data.urlser + 'LookupErp', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': GUID,
        'BPAPUS-FUNCTION': 'Mb000130',
        'BPAPUS-PARAM': '',
        'BPAPUS-FILTER': '',
        'BPAPUS-ORDERBY': '',
        'BPAPUS-OFFSET': '0',
        'BPAPUS-FETCH': '0',
      }),
    })
      .then((response) => response.json())
      .then(async (json) => {
        let responseData = JSON.parse(json.ResponseData);
        let c = false;
        for (let i in responseData.Mb000130) {
          if (
            // Check User ID Card & Phone Number
            responseData.Mb000130[i].MB_I_CARD == newData.idCard &&
            responseData.Mb000130[i].MB_PHONE == newData.phoneNum
          ) {
            console.log('FETCH MbUsers');
            await fetch(databaseReducer.Data.urlser + 'MbUsers', {
              method: 'POST',
              body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': GUID,
                'BPAPUS-FUNCTION': 'LoginByMobile',
                'BPAPUS-PARAM':
                  '{"MB_CNTRY_CODE": "66",    "MB_REG_MOBILE": "' +
                  newData.phoneNum +
                  '",    "MB_PW": "' +
                  '1234' +
                  '"}',
              }),
            })
              .then((response) => response.json())
              .then(async (json) => {
                if (json.ResponseCode == '635') {
                  console.log('NOT FOUND MEMBER');
                  Alert.alert('', Language.t('login.errorNotfoundUsername'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                  //_fetchNewMember(GUID);
                } else if (json.ResponseCode == '629') {
                  console.log('Function Parameter Required');
                } else if (json.ResponseCode == '200') {
                  let responseData = JSON.parse(json.ResponseData);
                  let MB_LOGIN_GUID = responseData.MB_LOGIN_GUID;
                  _onPressYes(MB_LOGIN_GUID, GUID);
                } else {
                  console.log(json.ReasonString);
                }
              })
              .catch((error) => {
                if (databaseReducer.Data.urlser == '') {
                  Alert.alert(
                    Language.t('alert.errorTitle'),
                    Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                } else {
                  Alert.alert(
                    Language.t('alert.errorTitle'),
                    Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                } console.log('ERROR FETCH LoginByMobile : ' + error)
                setLoading(false)
              }

              );
            c = false;
            break;
          } else {
            c = true;
          }
        }
        if (c) {
          Alert.alert('', Language.t('login.errorNotfoundUsername'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
          setLoading(false)
        }
      });
  };

  const getMacAddress = async () => {
    await DeviceInfo.getMacAddress().then((androidId) => {
      dispatch(registerActions.machine(androidId));
      setMachineNo(androidId);
    });
  };

  useEffect(() => {
    getMacAddress();
  }, []);

  const checKPassword = () => {
    setLoading(true)
    if (newData.password !== rePass) {
      Alert.alert('', Language.t('register.validationNotMatchPassword'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      setLoading(false)
    } else _setDispatch();
  };
  const _setDispatch = () => {
    let check = false;
    setLoading(true)

    if (newData.phoneNum == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('register.mobileNo'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      check = true
    }
    if (newData.password == '' && !check) {
      Alert.alert(
        Language.t('register.titleHeader'),
        Language.t('register.password'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
      check = true
    } else if (newData.password.length >= 1 && newData.password.length < 6) {
      check = true
      Alert.alert('', Language.t('register.validationLessPassword'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
    }
    if (!check) {
      regisMacAdd()
    } else {
      setLoading(false)
    }
  }


  return (
    <SafeAreaView style={styles.container1}>
      <View style={styles.tabbar}>
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
            }}> {Language.t('register.titleHeader')}</Text>
        </View>
        <View>

        </View>

      </View>
      <View style={{ margin: 10, marginTop: deviceHeight / 6 }} >

        <KeyboardAvoidingView keyboardVerticalOffset={-150} behavior={'position'}>
          <ScrollView>

            {Platform.OS === 'ios' ? (

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View  >
                  <Text
                    style={{
                      fontSize: FontSize.large,
                      textDecorationLine: 'underline',
                      fontWeight: 'bold',
                      color: Colors.textColor,
                    }}>
                    {Language.t('register.titleHeader')}
                  </Text>

                  <Text style={styles.textTitle}>
                    {Language.t('register.mobileNo')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 2,
                      alignItems: 'center',
                    }}>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="number-pad"
                      placeholderTextColor={Colors.fontColorSecondary}
                      maxLength={10}
                      dataDetectorTypes="phoneNumber"
                      placeholder={Language.t(
                        'register.validationEmptyPhoneNumber',
                      )}
                      onChangeText={(val) => {
                        setNewData({ ...newData, phoneNum: val });
                        setdata3(true);
                        if (val === '') {
                          setdata3(false);
                        }
                      }}
                    />
                    {data3 ? (
                      <FontAwesome
                        name="check-circle"
                        size={25}
                        color={Colors.buttonColorPrimary}></FontAwesome>
                    ) : null}
                  </View>


                  <Text style={styles.textTitle}>
                    {Language.t('register.password')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 2,
                      alignItems: 'center',
                    }}>
                    <TextInput
                      style={styles.textInput}
                      secureTextEntry={data.secureTextEntry ? true : false}
                      placeholderTextColor={Colors.fontColorSecondary}
                      keyboardType="default"
                      maxLength={8}
                      placeholder={Language.t('register.validationEmptyPassword')}
                      autoCapitalize="none"
                      onChangeText={(val) => {
                        handlePasswordChange(val);
                        setNewData({ ...newData, password: val });
                      }}
                    />
                    <TouchableOpacity onPress={updateSecureTextEntry}>
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
                          color={Colors.buttonColorPrimary}></FontAwesome>
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.textTitle}>
                    {Language.t('register.confirmPassword')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 2,
                      alignItems: 'center',
                    }}>
                    <TextInput
                      style={styles.textInput}
                      secureTextEntry={data.secureTextEntry ? true : false}
                      placeholderTextColor={Colors.fontColorSecondary}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(val) => {
                        handlePasswordChange(val);
                        setRePass(val);
                      }}
                      maxLength={8}
                      placeholder={Language.t(
                        'register.validationEmptyConfirmPassword',
                      )}
                    />
                  </View>

                  <View
                    style={{
                      marginTop: 10,

                      justifyContent: 'flex-end',
                      flexDirection: 'column',
                    }}>
                    <TouchableNativeFeedback onPress={checKPassword}>
                      <View style={styles.button}>
                        <Text style={styles.textButton}>
                          {Language.t('register.buttonRegister')}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              </TouchableWithoutFeedback>

            ) : (

              <View  >
                <Text style={styles.textTitle} >
                  {Language.t('register.mobileNo')}
                </Text>
                <View style={styles.textInput}>
                  <TextInput
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.fontColorSecondary}
                    maxLength={10}
                    width={"90%"}
                    dataDetectorTypes="phoneNumber"
                    placeholder={Language.t(
                      'register.validationEmptyPhoneNumber',
                    )}
                    onChangeText={(val) => {
                      setNewData({ ...newData, phoneNum: val });
                      setdata3(true);
                      if (val === '') {
                        setdata3(false);
                      }
                    }}
                  />
                  {data3 ? (
                    <FontAwesome
                      name="check-circle"
                      size={25}
                      style={{ alignItems: 'flex-end' }}
                      color={Colors.buttonColorPrimary}></FontAwesome>
                  ) : null}
                </View>

                <Text style={styles.textTitle}>
                  {Language.t('register.password')}
                </Text>
                <View style={styles.textInput}>
                  <TextInput
                    width={"90%"}
                    secureTextEntry={data.secureTextEntry ? true : false}
                    placeholderTextColor={Colors.fontColorSecondary}
                    keyboardType="default"
                    maxLength={8}
                    placeholder={Language.t('register.validationEmptyPassword')}
                    autoCapitalize="none"
                    onChangeText={(val) => {
                      handlePasswordChange(val);
                      setNewData({ ...newData, password: val });
                    }}
                  />

                  <TouchableOpacity onPress={updateSecureTextEntry}>
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
                        color={Colors.buttonColorPrimary}></FontAwesome>
                    )}

                  </TouchableOpacity>
                </View>
                <Text style={styles.textTitle}>
                  {Language.t('register.confirmPassword')}
                </Text>
                <View style={styles.textInput}>
                  <TextInput
                    width={"90%"}
                    secureTextEntry={data.secureTextEntry ? true : false}
                    placeholderTextColor={Colors.fontColorSecondary}
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(val) => {
                      handlePasswordChange(val);
                      setRePass(val);
                    }}
                    maxLength={8}
                    placeholder={Language.t(
                      'register.validationEmptyConfirmPassword',
                    )}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                  }}>
                  <TouchableNativeFeedback onPress={checKPassword}>
                    <View style={styles.button}>
                      <Text style={styles.textButton}>
                        {Language.t('register.buttonRegister')}
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>

              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

      </View>
      {loading && (
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            opacity: 0.5,
            backgroundColor: 'gray',
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
          }}>
          <ActivityIndicator
            style={{
              justifyContent: 'center',
              alignItems: 'center',

              backgroundColor: null
            }}
            animating={loading}
            size="large"
            color="white"
          />
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundLoginColor,
    flex: 1,

  },
  tabbar: {
    height: 70,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: Colors.fontColor2,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    marginTop: 10,
    padding: 5,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: Colors.buttonColorPrimary,
    borderRadius: 10,
  },
  textTitle: {
    marginTop: Platform.OS === 'ios' ? 15 : 7,
    fontSize: FontSize.medium,
    color: Colors.fontColor2,
    flexDirection: 'column',
    fontWeight: 'bold',

  },
  textTitle2: {
    alignSelf: 'center',
    fontSize: FontSize.medium,
    color: Colors.fontColor,
  },
  textButton: {
    color: Colors.fontColor2,
    fontSize: FontSize.medium,
    padding: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    alignItems: 'center',
    color: Colors.inputText,
    marginTop: Platform.OS === 'ios' ? 10 : 5,
    fontSize: FontSize.medium,
    borderWidth: 0.7,
    paddingVertical: Platform.OS === 'ios' ? 15 : undefined,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : undefined,
  },
});





export default RegisterScreen;

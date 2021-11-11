import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Dimensions,
    Text,
    View,
    Image,
    Button,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
    Platform,
    BackHandler,
    StatusBar,

    Modal, Pressable,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import CheckBox from '@react-native-community/checkbox';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import {
    ScrollView,
    TouchableNativeFeedback,
    TouchableOpacity,
} from 'react-native-gesture-handler';

import { SafeAreaView } from 'react-native-safe-area-context';
import { DataTable } from 'react-native-paper';

import { useStateIfMounted } from 'use-state-if-mounted';


import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import { connect } from 'react-redux';
import { useSelector } from 'react-redux';




import { Language } from '../../../translations/I18n';
import { FontSize } from '../../../components/FontSizeHelper';


import * as registerActions from '../../../src/actions/registerActions';
import * as databaseActions from '../../../src/actions/databaseActions';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../src/Colors';
import { fontSize } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const showAR = ({ route }) => {
    let arrayResult = [];

    const navigation = useNavigation();
    const {
        container2,
        container,
        button,
        textButton,
        topImage,
        tabbar,
        buttonContainer,
    } = styles;

    const registerReducer = useSelector(({ registerReducer }) => registerReducer);
    const loginReducer = useSelector(({ loginReducer }) => loginReducer);
    const databaseReducer = useSelector(({ databaseReducer }) => databaseReducer);
    const [loading, setLoading] = useStateIfMounted(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [arrayObj, setArrayObj] = useState([]);
    const [start_date, setS_date] = useState(new Date());
    const [end_date, setE_date] = useState(new Date())
    const [sum, setSum] = useState(0)
    const [textsearch, setSearch] = useState('')


    var ser_die = true
    useEffect(() => {


    }, [])

    const regisMacAdd = async () => {
        console.log('REGIS MAC ADDRESS');
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
                    await _fetchGuidLog();
                } else {
                    console.log('REGISTER MAC FAILED');
                }
            })
            .catch((error) => {
                console.log('ERROR at regisMacAdd ' + error);
                console.log('http', databaseReducer.Data.urlser);
                if (databaseReducer.Data.urlser == '') {
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t('selectBase.error'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                } else {
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t('alert.internetError'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                }

            });
    };

    const _fetchGuidLog = async () => {
        console.log('FETCH GUID LOGIN');
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
                if (json && json.ResponseCode == '635') {
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        Language.t('alert.errorDetail'), [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                    console.log('NOT FOUND MEMBER');
                } else if (json && json.ResponseCode == '629') {
                    Alert.alert(
                        Language.t('alert.errorTitle'),
                        'Function Parameter Required', [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                } else if (json && json.ResponseCode == '200') {
                    let responseData = JSON.parse(json.ResponseData);
                    dispatch(loginActions.guid(responseData.BPAPUS_GUID));

                    // navigation.navigate('MainMenu')
                } else {
                    Alert.alert(
                        Language.t('alert.errorTitle'), json.ResponseCode
                    );
                }
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
                        Language.t('alert.internetError') + "1", [{ text: Language.t('alert.ok'), onPress: () => console.log('OK Pressed') }]);
                }


            });

    };

    const InSearch = async () => {
        console.log('InSearch')
        setLoading(true)
        await fetchInSearch()

        setArrayObj(arrayResult)
    }
    const fetchInSearch = async () => {

        await fetch(databaseReducer.Data.urlser + 'LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'Ar000130',
                'BPAPUS-PARAM': 'AND (AR_NAME LIKE %' + textsearch + '%) OR (AR_CODE LIKE %' + textsearch + '%) OR (ADDB_SEARCH LIKE %' + textsearch + '%)',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                let responseData = JSON.parse(json.ResponseData);

                for (var i in responseData.Ar000130) {
                    let jsonObj = {
                        id: i,
                        name: responseData.Ar000130[i].AR_NAME,
                        key: responseData.Ar000130[i].AR_KEY,
                        code: responseData.Ar000130[i].AR_CODE,
                        phone: responseData.Ar000130[i].ADDB_PHONE,
                    };
                    arrayResult.push(jsonObj)
                }
            })
            .catch((error) => {
                if (ser_die) {
                    ser_die = false
                    regisMacAdd()
                }
                console.error('ERROR at fetchContent' + error)
            })

        setLoading(false)

    }


    return (
        <>
            <SafeAreaView style={container}>
                <View style={tabbar}>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}>
                            <FontAwesome name="arrow-left" color={Colors.buttonColorPrimary} size={20} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                marginLeft: 12,
                                fontSize: FontSize.medium,
                                color: Colors.fontColor2
                            }}>{route.params.route.title}</Text>
                    </View>



                </View>
                <View style={tabbar} >
                    <View style={{
                        backgroundColor: '#fff', padding: 10, alignSelf: 'center',
                        justifyContent: 'center', borderRadius: 20, flexDirection: 'row', marginBottom: 10
                    }}>

                        <TextInput
                            style={{
                                flex: 8,
                                marginLeft: 10,
                                borderBottomColor: Colors.borderColor,
                                color: Colors.fontColor,
                                paddingVertical: 7,
                                fontSize: FontSize.medium,
                                borderBottomWidth: 0.7,

                            }}

                            placeholderTextColor={Colors.fontColorSecondary}
                            value={textsearch}

                            placeholder={'ชื่อลูกหนี้'}
                            onChangeText={(val) => {
                                setSearch(val)
                            }} />

                        <TouchableOpacity onPress={() => InSearch()}>
                            <FontAwesome name="search" color={'black'} size={30} />
                        </TouchableOpacity>

                    </View>
                </View>
                <View>
                    <View  >
                        <DataTable style={styles.table}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title ><Text style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.fontColor2, width: '60%'
                                }}>ชื่อลูกหนี้</Text></DataTable.Title>
                                <DataTable.Title ><Text style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.fontColor2
                                }}>เบอร์โทร</Text></DataTable.Title>

                            </DataTable.Header>
                            <ScrollView>
                                <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
                                    <TouchableNativeFeedback>
                                        <View  >
                                            {arrayObj.map((item) => {
                                                return (
                                                    <>
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => navigation.navigate(route.params.route.routeName, {
                                                                    route: route.params.route, Obj: item.key
                                                                })}>
                                                                <DataTable.Row>
                                                                    <DataTable.Cell>{item.name}</DataTable.Cell>
                                                                    <DataTable.Cell >{item.phone ? item.phone : 'ไม่มีข้อมูล'}</DataTable.Cell>
                                                                </DataTable.Row>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                )
                                            })}
                                        </View>
                                    </TouchableNativeFeedback>
                                </KeyboardAvoidingView>
                            </ScrollView>
                        </DataTable>

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


        </>
    );
};

const styles = StyleSheet.create({

    table: {

    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    container2: {
        width: deviceWidth,
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        flex: 1,
    },
    tableView: {


    },
    tableHeader: {
        justifyContent: 'space-between',
        backgroundColor: Colors.buttonColorPrimary,

    },
    tabbar: {
        height: 70,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        backgroundColor: Colors.backgroundLoginColor,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    tabbuttom: {
        width: '100%',
        height: 50,
        padding: 5,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        flex: 1,
        backgroundColor: Colors.backgroundLoginColor,
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
    textTitle2: {
        alignSelf: 'center',
        flex: 2,
        fontSize: FontSize.medium,
        fontWeight: 'bold',
        color: Colors.fontColor,
    },
    imageIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topImage: {
        width: null,
        color: '#FFFFF',
        height: Platform.OS === 'ios' ? 300 : deviceWidth / 2,
        marginBottom: 50
    },
    button: {
        marginTop: 10,
        marginBottom: 25,
        padding: 5,
        paddingBottom: 10,
        paddingTop: 10,
        alignItems: 'center',
        backgroundColor: Colors.backgroundLoginColor,
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: deviceWidth,
    },
    modalView: {
        backgroundColor: Colors.backgroundLoginColor,
        borderRadius: 20,
        padding: 10,
        width: "auto",
        shadowColor: "#000",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: Colors.backgroundLoginColor,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: FontSize.mediumw,
        color: Colors.buttonColorPrimary
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: Colors.fontColor2,
        fontSize: FontSize.medium
    }
});

export default showAR;

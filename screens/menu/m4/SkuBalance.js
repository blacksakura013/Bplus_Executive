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
import {  monthFormat ,currencyFormat,setnewdateF} from '../safe_Format';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const SkuBalance = ({ route }) => {
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
    const radio_props = [
        { label: 'สิ้นเดือนก่อน', value: 'lastmonth' },
        { label: 'สิ้นปีก่อน', value: 'lastyear' },
        { label: 'เมื่อวาน', value: 'lastday' },
        { label: 'วันนี้', value: 'nowday' }
    ];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState([0]);
    var ser_die = true
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage])
    useEffect(() => {
        var newsum = 0
        for (var i in arrayObj) {
            newsum += Number(arrayObj[i].sumcost)
        }

        setSum(newsum)

    }, [arrayObj])

    const regisMacAdd = async () => {
        console.log('REGIS MAC ADDRESS');
        await fetch(databaseReducer.Data.urlser + '/DevUsers', {
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
        await fetch(databaseReducer.Data.urlser + '/DevUsers', {
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

    
    const InCome = async () => {
        console.log(route.params.Obj)
        setLoading(true)
        await fetchInCome()
        setModalVisible(!modalVisible)
        setArrayObj(arrayResult)
        for (var i in arrayResult)
            console.log(arrayResult[i])
    }
    const fetchInCome = async () => {

        setModalVisible(!modalVisible)
        var sDate = setnewdateF(start_date)
        var eDate = setnewdateF(end_date)

        await fetch(databaseReducer.Data.urlser + '/Executive', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'SHOWSKUBALANCEBYICDEPT',
                'BPAPUS-PARAM':
                    '{ "TO_DATE": "' +
                    eDate + '"}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                let responseData = JSON.parse(json.ResponseData);
                for (var i in responseData.SHOWSKUBALANCEBYICDEPT) {
                    let jsonObj = {
                        id: i,
                        code: responseData.SHOWSKUBALANCEBYICDEPT[i].ICDEPT_CODE,
                        thaidesc: responseData.SHOWSKUBALANCEBYICDEPT[i].ICDEPT_THAIDESC,
                        sumcost: responseData.SHOWSKUBALANCEBYICDEPT[i].SUMCOST,
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

    const setRadio_menu = (val) => {
        var x = new Date();
        var day = x.getDate();
        var month = x.getMonth() + 1
        var year = x.getFullYear()
        var sdate = ''
        var edate = ''

        if (val == 'lastyear') {
            year = year - 1
            sdate = new Date(year, 0, 1)
            edate = new Date(year, 12, 0)
        } else if (val == 'nowyear') {
            year = year
            sdate = new Date(year, 0, 1)
            edate = new Date(year, 12, 0)
        }
        else if (val == 'nowmonth') {
            month = month - 1
            sdate = new Date(year, month, 1)
            edate = new Date(year, month + 1, 0)
        } else if (val == 'lastmonth') {
            month = month - 2
            sdate = new Date(year, month, 1)
            edate = new Date(year, month + 1, 0)
        }
        else if (val == 'lastday') {
            sdate = new Date().setDate(x.getDate() - 1)
            edate = new Date().setDate(x.getDate() - 1)
        } else {
            sdate = new Date()
            edate = new Date()
        }

        setS_date(new Date(sdate))
        setE_date(new Date(edate))
    }
    useEffect(() => {

    }, [])

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
                    <View>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <FontAwesome name="calendar" color={Colors.fontColor2} size={20} />
                        </TouchableOpacity>
                    </View>

                </View>
                <View>
                    <View  >
                        <ScrollView>
                            <ScrollView horizontal={true}>
                                <DataTable
                                    style={styles.table}>
                                    <DataTable.Header style={styles.tableHeader}>
                                        <DataTable.Title ><Text style={{
                                            fontSize: FontSize.medium,
                                            color: Colors.fontColor2
                                        }}>รหัส</Text></DataTable.Title>
                                        <DataTable.Title ><Text style={{
                                            fontSize: FontSize.medium,
                                            color: Colors.fontColor2
                                        }}>ชื่อ</Text></DataTable.Title>
                                        <DataTable.Title numeric><Text style={{
                                            fontSize: FontSize.medium,
                                            color: Colors.fontColor2
                                        }}> ยอดคงเหลือ </Text></DataTable.Title>

                                    </DataTable.Header>

                                    <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'}>
                                        <TouchableNativeFeedback>
                                            <View marginBottom={20}>
                                                {arrayObj.map((item) => {
                                                    return (
                                                        <>
                                                            <View>
                                                                <DataTable.Row>
                                                                    <DataTable.Cell>{item.code}</DataTable.Cell>
                                                                    <DataTable.Cell >{item.thaidesc}</DataTable.Cell>
                                                                    <DataTable.Cell numeric>{currencyFormat(item.sumcost)}</DataTable.Cell>

                                                                </DataTable.Row>
                                                            </View>
                                                        </>
                                                    )
                                                })}
                                            </View>
                                        </TouchableNativeFeedback>
                                    </KeyboardAvoidingView>

                                </DataTable>
                            </ScrollView>
                        </ScrollView>
                    </View>
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}

                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}>

                            <View style={styles.centeredView}>

                                <View style={styles.modalView}>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Pressable onPress={() => setModalVisible(!modalVisible)}>
                                            <FontAwesome name="close" color={Colors.buttonColorPrimary} size={20} />
                                        </Pressable>
                                    </View>

                                    <Text style={styles.modalText}>เลือกการค้นหา</Text>
                                    <View style={{ backgroundColor: Colors.fontColor2, borderRadius: 20, padding: 10 }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 10
                                        }}>
                                            <RadioGroup

                                                onSelect={(index, value) => setRadio_menu(value)}
                                            >
                                                <RadioButton value={radio_props[0].value} >
                                                    <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>{radio_props[0].label}</Text>
                                                </RadioButton>
                                                <RadioButton value={radio_props[1].value} >
                                                    <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>{radio_props[1].label}</Text>
                                                </RadioButton>
                                                <RadioButton value={radio_props[2].value} >
                                                    <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>{radio_props[2].label}</Text>
                                                </RadioButton>

                                                <RadioButton value={radio_props[3].value} >
                                                    <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>{radio_props[3].label}</Text>
                                                </RadioButton>


                                            </RadioGroup>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row', justifyContent: 'space-between',
                                            alignItems: 'center', marginBottom: 10
                                        }}>
                                            <Text style={{ fontSize: FontSize.medium, color: 'black', marginRight: 5, fontWeight: 'bold', }}>ตั้งแต่</Text>
                                            <DatePicker
                                                style={{ width: 250 }}
                                                date={start_date} //start date
                                                mode="date"
                                                placeholder="select date"
                                                format="DD-MM-YYYY"
                                                
                                                
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: {
                                                        left: 0,
                                                        top: 4,
                                                        marginLeft: 0
                                                    },
                                                    dateInput: {


                                                    }
                                                    // ... You can check the source to find the other keys.
                                                }}
                                                onDateChange={(date) => { setS_date(date) }}
                                            />
                                        </View>

                                        <View style={{
                                            flexDirection: 'row', justifyContent: 'space-between',
                                            alignItems: 'center', marginBottom: 10
                                        }}>
                                            <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>ถึง</Text>
                                            <DatePicker
                                                style={{ width: 250, }}
                                                date={end_date} //start date
                                                mode="date"
                                                placeholder="select date"
                                                format="DD-MM-YYYY"
                                                
                                                
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: {
                                                        left: 0,
                                                        top: 4,
                                                        marginLeft: 0
                                                    },
                                                    dateInput: {

                                                    }
                                                    // ... You can check the source to find the other keys.
                                                }}
                                                onDateChange={(date) => { setE_date(date) }}
                                            />
                                        </View>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => InCome()}
                                        >
                                            <Text style={styles.textStyle}>ตกลง</Text>
                                        </Pressable>

                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>

                </View>



            </SafeAreaView>
            <View style={styles.tabbuttom}>
                <Text style={{
                    marginLeft: 12,
                    fontSize: FontSize.medium,
                    color: Colors.fontColor2
                }} >ยอดรวม</Text>
                <Text  > </Text>
                <Text style={{
                    marginLeft: 12,
                    fontSize: FontSize.medium,
                    color: Colors.fontColor2
                }} >{currencyFormat(sum)}</Text>
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
        </>
    );
};

const styles = StyleSheet.create({

    table: {
        width: deviceWidth,
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
        color: Colors.buttonColorPrimary
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: Colors.fontColor2,
        fontSize: FontSize.medium
    }
});

export default SkuBalance;
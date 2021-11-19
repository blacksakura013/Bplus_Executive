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
import { useSelector, useDispatch } from 'react-redux';




import { Language } from '../../../translations/I18n';
import { FontSize } from '../../../components/FontSizeHelper';

import * as loginActions from '../../../src/actions/loginActions';
import * as registerActions from '../../../src/actions/registerActions';
import * as databaseActions from '../../../src/actions/databaseActions';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../src/Colors';
import { fontSize, right } from 'styled-system';

import { monthFormat, currencyFormat, setnewdateF } from '../safe_Format';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ShowInCome = ({ route }) => {
    let arrayResult = [];
    const dispatch = useDispatch();
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
        { label: 'ปีก่อน', value: 'lastyear' },
        { label: 'ปีนี้', value: 'nowyear' },
        { label: 'เดือนนี้', value: 'nowmonth' },
        { label: 'เดือนก่อน', value: 'lastmonth' },
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
            newsum += Number(arrayObj[i].sellAmount)
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
        setLoading(true)
        setModalVisible(false)
        await fetchInCome()

        setArrayObj(arrayResult)
    }
    const fetchInCome = async () => {
        var sDate = setnewdateF(start_date)
        var eDate = setnewdateF(end_date)

        await fetch(databaseReducer.Data.urlser + '/Executive', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'SHOWINCOMEBYYEAR',
                'BPAPUS-PARAM':
                    '{"FROM_DATE": "' +
                    sDate +
                    '","TO_DATE": ' +
                    eDate + '}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                let responseData = JSON.parse(json.ResponseData);
                
                if(responseData.RECORD_COUNT>0){
                    for (var i in responseData.SHOWINCOMEBYYEAR) {
                        let jsonObj = {
                            id: i,
                            year: responseData.SHOWINCOMEBYYEAR[i].SHOWYEAR,
                            month: responseData.SHOWINCOMEBYYEAR[i].SHOWMONTH,
                            sellAmount: responseData.SHOWINCOMEBYYEAR[i].SHOWSELLAMOUNT,
                        };
                        arrayResult.push(jsonObj)
                    }
                }else{
                    Alert.alert("ไม่พบข้อมูล");
                }
               
                setLoading(false)
            })
            .catch((error) => {


                if (ser_die) {
                    ser_die = false
                    regisMacAdd()
                }
                console.error('ERROR at fetchContent' + error)
            })


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
                            <FontAwesome name="arrow-left" color={Colors.buttonColorPrimary} size={FontSize.large} />
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
                            <FontAwesome name="calendar" color={Colors.fontColor2} size={FontSize.large} />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={container} >

                    <DataTable
                        style={styles.table}>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={{ flex: 0.2 }} numeric >
                                <Text style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.fontColor2
                                }}> ปี</Text></DataTable.Title>
                            <DataTable.Title style={{ flex: 0.3, padding: 10 }}  >
                                <Text style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.fontColor2
                                }}>เดือน</Text></DataTable.Title>
                            <DataTable.Title style={{ flex: 0.5 }} numeric>
                                <Text style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.fontColor2
                                }}> ยอดขาย </Text></DataTable.Title>
                        </DataTable.Header>
                        <ScrollView>
                            <KeyboardAvoidingView keyboardVerticalOffset={1} behavior={'position'} >
                                <TouchableNativeFeedback>
                                    <View marginBottom={20}>
                                        {arrayObj.map((item) => {
                                            return (
                                                <>
                                                    <DataTable.Row>
                                                        <DataTable.Cell style={{ flex: 0.2 }} numeric >{item.year}</DataTable.Cell>
                                                        <DataTable.Cell style={{ flex: 0.3, padding: 10 }}   >{monthFormat(item.month)}</DataTable.Cell>
                                                        <DataTable.Cell style={{ flex: 0.5 }} numeric >{currencyFormat(item.sellAmount)}</DataTable.Cell>
                                                    </DataTable.Row>

                                                </>
                                            )
                                        })}
                                    </View>
                                </TouchableNativeFeedback>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    </DataTable>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >

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
                                        marginBottom: 10,

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
                                            <RadioButton value={radio_props[4].value} >
                                                <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>{radio_props[4].label}</Text>
                                            </RadioButton>
                                            <RadioButton value={radio_props[5].value} >
                                                <Text style={{ fontSize: FontSize.medium, color: 'black', fontWeight: 'bold', }}>{radio_props[5].label}</Text>
                                            </RadioButton>

                                        </RadioGroup>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'space-between',
                                        alignItems: 'center', marginBottom: 10
                                    }}>
                                        <Text style={{ fontSize: FontSize.medium, marginRight: 5, color: 'black', fontWeight: 'bold', }}>ตั้งแต่</Text>
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

export default ShowInCome;

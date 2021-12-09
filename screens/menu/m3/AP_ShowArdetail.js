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

import { useSelector, connect, useDispatch } from 'react-redux';




import { Language } from '../../../translations/I18n';
import { FontSize } from '../../../components/FontSizeHelper';

import * as loginActions from '../../../src/actions/loginActions';
import * as registerActions from '../../../src/actions/registerActions';
import * as databaseActions from '../../../src/actions/databaseActions';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../src/Colors';
import * as safe_Format from '../safe_Format';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const AP_ShowArdetail = ({ route }) => {
    const dispatch = useDispatch();
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
    const [radioIndex, setRadioIndex] = useState(4);
    const radio_props = [
        { label: 'สิ้นเดือนก่อน', value: 'lastmonth' },
        { label: 'สิ้นปีก่อน', value: 'lastyear' },
        { label: 'เมื่อวาน', value: 'lastday' },
        { label: 'วันนี้', value: 'nowday' },
        { label: null, value: null }
    ];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState([0]);

    const [arrayObj_apd_A_mt, apd_A_mtsetArrayObj] = useState([]);
    const [arrayObj_sumpayment, sumpaymentsetArrayObj] = useState([]);
    const [arrayObj_ard_sumpayment, ard_sumpaymentsetArrayObj] = useState([]);
    let sum_apd_A_mt = []
    let sum_sumpayment = []
    let sum_apd_sumpayment = []

    var ser_die = true
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage])
    useEffect(() => {
        var newsum = 0
        for (var i in arrayObj) {
            newsum += Number(arrayObj[i].apd_A_mt + arrayObj[i].sumpayment)
        }

        setSum(newsum)

    }, [arrayObj])

      const regisMacAdd = async () => {
        console.log('ser_die')
        dispatch(loginActions.guid(await safe_Format._fetchGuidLog(databaseReducer.Data.urlser, loginReducer.serviceID, registerReducer.machineNum, loginReducer.userNameED, loginReducer.passwordED)))
        await fetchInCome()
    };


    const InCome = async () => {

        setLoading(true)
        await fetchInCome()
        setModalVisible(!modalVisible)
        setArrayObj(arrayResult)
        apd_A_mtsetArrayObj(sum_apd_A_mt)
        sumpaymentsetArrayObj(sum_sumpayment)
        ard_sumpaymentsetArrayObj(sum_apd_sumpayment)

    }
    const fetchInCome = async () => {

        setModalVisible(!modalVisible)
        var sDate = safe_Format.setnewdateF(safe_Format.checkDate(start_date))
        var eDate = safe_Format.setnewdateF(safe_Format.checkDate(end_date))

        await fetch(databaseReducer.Data.urlser + '/Executive', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'SHOWAPBALANCEBYAPKEY',
                'BPAPUS-PARAM':
                    '{ "TO_DATE": "' +
                    eDate +
                    '","AP_KEY": ' +
                    route.params.Obj + '}',
                'BPAPUS-FILTER': '',
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {

                let responseData = JSON.parse(json.ResponseData);
                if (responseData.RECORD_COUNT > 0) {
                    for (var i in responseData.SHOWAPBALANCEBYAPKEY) {
                        let jsonObj = {
                            id: i,
                            date: responseData.SHOWAPBALANCEBYAPKEY[i].DI_DATE,
                            id_ref: responseData.SHOWAPBALANCEBYAPKEY[i].DI_REF,
                            apd_A_mt: responseData.SHOWAPBALANCEBYAPKEY[i].APD_A_AMT,
                            sumpayment: responseData.SHOWAPBALANCEBYAPKEY[i].SUMPAYMENT,
                        };
                        sum_apd_A_mt.push(jsonObj.apd_A_mt)
                        sum_sumpayment.push(jsonObj.sumpayment)
                        sum_apd_sumpayment.push(jsonObj.apd_A_mt - jsonObj.sumpayment)
                        arrayResult.push(jsonObj)
                    }
                } else {
                    Alert.alert("ไม่พบข้อมูล");
                }
            })
            .catch((error) => {
                if (ser_die) {
                    regisMacAdd()
                }
                console.error('ERROR at fetchContent >> ' + error)
            })
        setLoading(false)
    }

    const setRadio_menu = (index, val) => {
        const Radio_Obj = safe_Format.Radio_menu(index, val)
        setRadioIndex(Radio_Obj.index)
        if (val != null) {
            setS_date(new Date(Radio_Obj.sdate))
            setE_date(new Date(Radio_Obj.edate))
        }
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
                <View style={{ flex: 1 }} >
                    <View  >

                        <ScrollView horizontal={true}>
                            <DataTable
                                style={styles.table}>
                                <DataTable.Header style={styles.tableHeader}>
                                    <DataTable.Title ><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}>วันที่</Text></DataTable.Title>
                                    <DataTable.Title ><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}>เอกสาร</Text></DataTable.Title>

                                    <DataTable.Title numeric><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}> ยอดหนี้ </Text></DataTable.Title>
                                    <DataTable.Title numeric><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}> ชำระแล้ว </Text></DataTable.Title>
                                    <DataTable.Title numeric><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}> คงค้าง </Text></DataTable.Title>

                                </DataTable.Header>
                                <ScrollView>
                                    <KeyboardAvoidingView keyboardVerticalOffset={1} >
                                        <TouchableNativeFeedback>
                                            <View >
                                                {arrayObj.map((item) => {
                                                    return (
                                                        <>
                                                            <View>
                                                                <DataTable.Row>
                                                                    <DataTable.Cell>{safe_Format.dateFormat(item.date)}</DataTable.Cell>
                                                                    <DataTable.Cell >{item.id_ref}</DataTable.Cell>
                                                                    <DataTable.Cell numeric>{safe_Format.currencyFormat(item.apd_A_mt)}</DataTable.Cell>
                                                                    <DataTable.Cell numeric>{safe_Format.currencyFormat(item.sumpayment)}</DataTable.Cell>
                                                                    <DataTable.Cell numeric>{safe_Format.currencyFormat((item.apd_A_mt - item.sumpayment))}</DataTable.Cell>
                                                                </DataTable.Row>
                                                            </View>
                                                        </>
                                                    )
                                                })}
                                            </View>
                                        </TouchableNativeFeedback>
                                    </KeyboardAvoidingView>
                                </ScrollView>
                                {arrayObj.length > 0 ?
                                    <View >
                                        <DataTable.Row style={styles.tabbuttomsum}>
                                            <DataTable.Cell  ><Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} >รวม </Text> </DataTable.Cell>

                                            <DataTable.Cell numeric>   <Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} > </Text></DataTable.Cell>
                                            <DataTable.Cell numeric>   <Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} >{safe_Format.currencyFormat(safe_Format.sumTabledata(arrayObj_apd_A_mt))}</Text></DataTable.Cell>
                                            <DataTable.Cell numeric>   <Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} >{safe_Format.currencyFormat(safe_Format.sumTabledata(arrayObj_sumpayment))}</Text></DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                <Text style={{
                                                    fontSize: FontSize.medium,
                                                    color: Colors.fontColor2
                                                }} >{safe_Format.currencyFormat(safe_Format.sumTabledata(arrayObj_ard_sumpayment))}</Text></DataTable.Cell>

                                        </DataTable.Row>
                                    </View>
                                    : null}
                            </DataTable>

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
                                                selectedIndex={radioIndex}

                                                onSelect={(index, value) => setRadio_menu(index, value)}
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
                                            <Text style={{ fontSize: FontSize.medium, color: 'black', marginRight: 5, fontWeight: 'bold', }}>ถึง</Text>
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
                                                onDateChange={(date) => {
                                                    setE_date(date)
                                                    setRadio_menu(4, null)
                                                }}
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
        width: deviceWidth * 2,
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
    tabbuttomsum: {
        backgroundColor: Colors.backgroundLoginColor,
        color: Colors.fontColor2
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

export default AP_ShowArdetail;

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

    TouchableOpacity,
    Modal, Pressable,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import CheckBox from '@react-native-community/checkbox';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import {
    ScrollView,
    TouchableNativeFeedback,
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
import * as safe_Format from '../safe_Format';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ShowSellBook = ({ route }) => {
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

    const [arrayObj_last_month, last_monthsetArrayObj] = useState([]);
    const [arrayObj_this_year, this_yearsetArrayObj] = useState([]);
    const [arrayObj_last_year, last_yearsetArrayObj] = useState([]);

    let sum_last_month = []
    let sum_this_year = []
    let sum_last_year = []
    var ser_die = true
    useEffect(() => {
        setPage(0);
    }, [itemsPerPage])
    useEffect(() => {
        var newsum = 0
        // for (var i in arrayObj) {
        //     newsum += Number(arrayObj[i].sellamount)
        // }

        // setSum(newsum)

    }, [arrayObj])

    const regisMacAdd = async () => {
        let tempGuid = await safe_Format._fetchGuidLog(databaseReducer.Data.urlser, loginReducer.serviceID, registerReducer.machineNum, loginReducer.userNameED, loginReducer.passwordED)
        await dispatch(loginActions.guid(tempGuid))
        fetchInCome(tempGuid)
    };



    const InCome = async () => {
        setLoading(true)
        await fetchInCome()
        setModalVisible(!modalVisible)


        setArrayObj(arrayResult)

        last_monthsetArrayObj(sum_last_month)
        this_yearsetArrayObj(sum_this_year)
        last_yearsetArrayObj(sum_last_year)

        arrayObj.map((item) => {
            console.log("this_year >> ", item.this_year)
            console.log("last_year >> ", item.last_year)
            console.log("last_month >> ", item.last_month)
            console.log()
        })
    }
    const fetchInCome = async (tempGuid) => {
        setModalVisible(!modalVisible)
        var sDate = safe_Format.setnewdateF(safe_Format.checkDate(start_date))
        var eDate = safe_Format.setnewdateF(safe_Format.checkDate(end_date))
        await fetch(databaseReducer.Data.urlser + '/Executive', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': tempGuid ? tempGuid : loginReducer.guid,
                'BPAPUS-FUNCTION': 'SHOWFINANCERATIO',
                'BPAPUS-PARAM':
                    '{"TO_DATE": ' +
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
                if (responseData.RECORD_COUNT > 0) {
                    for (var i in responseData.SHOWFINANCERATIO) {
                        let jsonObj = {
                            id: i,
                            key: responseData.SHOWFINANCERATIO[i].TDATA_KEY,
                            type: responseData.SHOWFINANCERATIO[i].TDATA_TYPE,
                            desc: responseData.SHOWFINANCERATIO[i].TDATA_DESC,
                            last_month: responseData.SHOWFINANCERATIO[i].TDATA_LAST_MONTH,
                            this_year: responseData.SHOWFINANCERATIO[i].TDATA_THIS_YEAR,
                            last_year: responseData.SHOWFINANCERATIO[i].TDATA_LAST_YEAR,
                        };
                        sum_last_month.push(jsonObj.last_month)
                        sum_this_year.push(jsonObj.this_year)
                        sum_last_year.push(jsonObj.last_year)
                        arrayResult.push(jsonObj)
                    }
                } else {
                    Alert.alert("ไม่พบข้อมูล");
                }
                setLoading(false)
            })
            .catch((error) => {
                if (ser_die) {
                    ser_die = false
                    regisMacAdd()
                } else {
                    setLoading(false)
                }
                console.error('ERROR at fetchContent >> ' + error)
            })
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
                <StatusBar hidden={true} />
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
                <View style={{ flex: 1 }}>
                    <View  >
                        <ScrollView horizontal={true}>
                            <DataTable
                                style={styles.table}>
                                <DataTable.Header style={styles.tableHeader}>
                                    <DataTable.Title style={{}}  ><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}>รายละเอียด</Text></DataTable.Title>
                                    <DataTable.Title style={{}} numeric><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}>เดือนก่อน</Text></DataTable.Title>
                                    <DataTable.Title style={{}} numeric><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}>ปีก่อน</Text></DataTable.Title>
                                    <DataTable.Title style={{}} numeric><Text style={{
                                        fontSize: FontSize.medium,
                                        color: Colors.fontColor2
                                    }}> ปีนี้ </Text></DataTable.Title>
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
                                                                    <DataTable.Cell style={{}}  >{item.desc}</DataTable.Cell>
                                                                    <DataTable.Cell style={{}} numeric>{safe_Format.currencyFormat(item.last_month)}</DataTable.Cell>
                                                                    <DataTable.Cell style={{}} numeric >{safe_Format.currencyFormat(item.last_year)}</DataTable.Cell>
                                                                    <DataTable.Cell style={{}} numeric>{safe_Format.currencyFormat(item.this_year)}</DataTable.Cell>
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
                                            <DataTable.Cell style={{}} ><Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} >รวม </Text> </DataTable.Cell>


                                            <DataTable.Cell numeric>   <Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} >{safe_Format.currencyFormat(safe_Format.sumTabledata(arrayObj_last_month))}</Text></DataTable.Cell>
                                            <DataTable.Cell numeric>   <Text style={{
                                                fontSize: FontSize.medium,
                                                color: Colors.fontColor2
                                            }} >{safe_Format.currencyFormat(safe_Format.sumTabledata(arrayObj_this_year))}</Text></DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                <Text style={{
                                                    fontSize: FontSize.medium,
                                                    color: Colors.fontColor2
                                                }} >{safe_Format.currencyFormat(safe_Format.sumTabledata(arrayObj_last_year))}</Text></DataTable.Cell>

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
                            }}
                        >
                            < TouchableOpacity
                                onPress={() => setModalVisible(!modalVisible)}
                                style={styles.centeredView}>
                                <View>
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
                                                    onSelect={(index, value) => setRadio_menu(index, value)}>
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
                            </TouchableOpacity>
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


export default ShowSellBook;

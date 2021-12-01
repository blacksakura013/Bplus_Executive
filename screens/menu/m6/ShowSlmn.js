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

import { useSelector,connect, useDispatch } from 'react-redux';




import { Language } from '../../../translations/I18n';
import { FontSize } from '../../../components/FontSizeHelper';

import * as loginActions from '../../../src/actions/loginActions';
import * as registerActions from '../../../src/actions/registerActions';
import * as databaseActions from '../../../src/actions/databaseActions';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../src/Colors';
import { fontSize } from 'styled-system';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ShowSlmn = ({ route }) => {
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
        console.log('ser_die')
        dispatch(loginActions.guid(await safe_Format._fetchGuidLog(databaseReducer.Data.urlser, loginReducer.serviceID, registerReducer.machineNum, loginReducer.userNameED, loginReducer.passwordED)))
        await fetchInCome()
    };

    const InSearch = async () => {
        console.log('InSearch')
        setLoading(true)
        await fetchInSearch()

        setArrayObj(arrayResult)
    }
    const fetchInSearch = async () => {

        await fetch(databaseReducer.Data.urlser + '/LookupErp', {
            method: 'POST',
            body: JSON.stringify({
                'BPAPUS-BPAPSV': loginReducer.serviceID,
                'BPAPUS-LOGIN-GUID': loginReducer.guid,
                'BPAPUS-FUNCTION': 'SL000130',
                'BPAPUS-PARAM': '',
                'BPAPUS-FILTER':  "AND (SLMN_NAME LIKE '%" + textsearch + "%')",
                'BPAPUS-ORDERBY': '',
                'BPAPUS-OFFSET': '0',
                'BPAPUS-FETCH': '0',
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                let responseData = JSON.parse(json.ResponseData);
                if (responseData.RECORD_COUNT > 0) {
                    for (var i in responseData.SL000130) {
                        let jsonObj = {
                            id: i,
                            name: responseData.SL000130[i].SLMN_NAME,
                            code: responseData.SL000130[i].SLMN_CODE,
                            key: responseData.SL000130[i].SLMN_KEY,
                            slcat_name: responseData.SL000130[i].SLCAT_NAME,
                            slcat_key: responseData.SL000130[i].SLCAT_KEY,
                        };
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

                            placeholder={'ชื่อพนักงาน'}
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
                                }}>ชื่อพนักงาน</Text></DataTable.Title>
                                <DataTable.Title ><Text style={{
                                    fontSize: FontSize.medium,
                                    color: Colors.fontColor2
                                }}>รหัส</Text></DataTable.Title>

                            </DataTable.Header>
                            <ScrollView>
                                <KeyboardAvoidingView keyboardVerticalOffset={1} >
                                    <TouchableNativeFeedback>
                                        <View  >
                                            {arrayObj.map((item) => {
                                                return (
                                                    <>
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => navigation.navigate(route.params.route.routeName, {
                                                                    route: route.params.route, Obj: item.code
                                                                })}>
                                                                <DataTable.Row>
                                                                    <DataTable.Cell>{item.name}</DataTable.Cell>
                                                                    <DataTable.Cell >{item.code ? item.code : 'ไม่มีข้อมูล'}</DataTable.Cell>
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

export default ShowSlmn;

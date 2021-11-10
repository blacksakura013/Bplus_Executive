import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { store, persistor } from './src/store/store';
import { drawerItemsMain } from './drawerItemsMain';
import CustomDrawerContent from './CustomDrawerContent';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SelectBase from './pages/SelectBase';
import EditBase from './pages/EditBase';

import ScanScreen from './pages/ScanScreen';
import Topmenu from './screens/menu/Topmenu'

import ShowInCome from './screens/menu/m1/ShowInCome'
import CurrentStatus from './screens/menu/m1/CurrentStatus'
import ShowBank from './screens/menu/m1/ShowBank'
import ShowInComeTeam from './screens/menu/m1/ShowInComeTeam'
import ShowPayMentdeposit from './screens/menu/m1/ShowPayMentdeposit'
import ShowSellBook from './screens/menu/m1/ShowSellBook'

import ShowAR from './screens/menu/m2/ShowAR'
import AR_SellAmount from './screens/menu/m2/AR_SellAmount'
import AR_ShowArdetail from './screens/menu/m2/AR_ShowArdetail'
import AR_SellAmountByIcDept from './screens/menu/m2/AR_SellAmountByIcDept'
import AR_GoodsBooking from './screens/menu/m2/AR_GoodsBooking'
import AR_Address from './screens/menu/m2/AR_Address'

import ShowAP from './screens/menu/m3/ShowAP'
import AP_PurcAmount from './screens/menu/m3/AP_PurcAmount'
import AP_ShowArdetail from './screens/menu/m3/AP_ShowArdetail'
import AP_PurcAmountByIcDept from './screens/menu/m3/AP_PurcAmountByIcDept'
import AP_GoodsBooking from './screens/menu/m3/AP_GoodsBooking'
import AP_Address from './screens/menu/m3/AP_Address'

import ChequeIn from './screens/menu/m4/ChequeIn'
import ChequeBook from './screens/menu/m4/ChequeBook'
import SkuBalance from './screens/menu/m4/SkuBalance'
import SkuBalanceByWL from './screens/menu/m4/SkuBalanceByWL'

import ArDueDate from './screens/menu/m5/ArDueDate'
import Arcat from './screens/menu/m5/Arcat'
import ApDueDate from './screens/menu/m5/ApDueDate'
import Apcat from './screens/menu/m5/Apcat'

import ShowSlmn from './screens/menu/m6/ShowSlmn'
import ShowPos from './screens/menu/m6/ShowPos'
import SlmnByYearMonth from './screens/menu/m6/SlmnByYearMonth'
import PosByYearMonth from './screens/menu/m6/PosByYearMonth'
import IncomeBySlmn from './screens/menu/m6/IncomeBySlmn'
import IncomeByPos from './screens/menu/m6/IncomeByPos'

import { Language } from './translations/I18n';
import { FontSize } from './components/FontSizeHelper';
import Colors from './src/Colors';

const App = () => {


  useEffect(() => {


  }, []);

  const Drawer = createDrawerNavigator();
  const MainStack = createStackNavigator();

  const LoginStack = createStackNavigator();

  const MainMenu = () => {
    return (
      <Drawer.Navigator

        drawerContent={(props) => (
          <CustomDrawerContent drawerItems={drawerItemsMain} {...props} />
        )}>
        <Drawer.Screen

          options={{

            title: 'เกี่ยวกับ',
            headerStyle: {
              backgroundColor: Colors.backgroundLoginColor,
            },
            headerTintColor: Colors.backgroundColor,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center'
          }}
          name="Topmenu" component={Topmenu} />
      </Drawer.Navigator>
    )
  }
  const LoginStackScreen = () => {
    return (
      <LoginStack.Navigator>

        <LoginStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={RegisterScreen}
        />
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="SelectScreen"
          component={SelectBase}
        />
        <LoginStack.Screen
          options={{ title: Language.t('selectBase.scanQR'), headerShown: false }}
          name="ScanScreen"
          component={ScanScreen}
        />
        <LoginStack.Screen
          options={{ headerShown: false }}
          name="EditBase"
          component={EditBase}
        />
      </LoginStack.Navigator>
    );
  }

  return (

    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <SafeAreaView style={styles.container1}>
            <MainStack.Navigator>

              <MainStack.Screen
                options={{ headerShown: false }}
                name="LoginStackScreen"
                component={LoginStackScreen}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="MainMenu"
                component={MainMenu}
              />


              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowInCome"
                component={ShowInCome}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowInComeTeam"
                component={ShowInComeTeam}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="CurrentStatus"
                component={CurrentStatus}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowBank"
                component={ShowBank}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowPayMentdeposit"
                component={ShowPayMentdeposit}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowSellBook"
                component={ShowSellBook}
              />

              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowAR"
                component={ShowAR}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AR_SellAmount"
                component={AR_SellAmount}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AR_ShowArdetail"
                component={AR_ShowArdetail}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AR_SellAmountByIcDept"
                component={AR_SellAmountByIcDept}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AR_GoodsBooking"
                component={AR_GoodsBooking}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AR_Address"
                component={AR_Address}
              />

              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowAP"
                component={ShowAP}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AP_PurcAmount"
                component={AP_PurcAmount}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AP_ShowArdetail"
                component={AP_ShowArdetail}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AP_PurcAmountByIcDept"
                component={AP_PurcAmountByIcDept}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AP_GoodsBooking"
                component={AP_GoodsBooking}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="AP_Address"
                component={AP_Address}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ChequeIn"
                component={ChequeIn}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ChequeBook"
                component={ChequeBook}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="SkuBalance"
                component={SkuBalance}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="SkuBalanceByWL"
                component={SkuBalanceByWL}
              />

              <MainStack.Screen
                options={{ headerShown: false }}
                name="Arcat"
                component={Arcat}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ArDueDate"
                component={ArDueDate}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="Apcat"
                component={Apcat}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ApDueDate"
                component={ApDueDate}
              />

              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowSlmn"
                component={ShowSlmn}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="ShowPos"
                component={ShowPos}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="SlmnByYearMonth"
                component={SlmnByYearMonth}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="PosByYearMonth"
                component={PosByYearMonth}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="IncomeBySlmn"
                component={IncomeBySlmn}
              />
              <MainStack.Screen
                options={{ headerShown: false }}
                name="IncomeByPos"
                component={IncomeByPos}
              />
            </MainStack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </PersistGate>
    </Provider>

  );
}
const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.backgroundLoginColor,
    flex: 1,

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

export default App;

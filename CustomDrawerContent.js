import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Colors from './src/Colors';
import { FontSize } from './components/FontSizeHelper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNRestart from 'react-native-restart';
import { useSelector, useDispatch } from 'react-redux';
import { useStateIfMounted } from 'use-state-if-mounted';
import { useNavigation } from '@react-navigation/native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function CustomDrawerContent(props) {
  const [mainDrawer, setMainDrawer] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useStateIfMounted(true);
  const registerReducer = useSelector(({ registerReducer }) => registerReducer);
  const loginReducer = useSelector(({ loginReducer }) => loginReducer);
  const toggleMainDrawer = () => {
    setMainDrawer(true);
    setFilteredItems([]);
  };
  const navigation = useNavigation();
  const onItemParentPress = (key) => {
    const filteredMainDrawerRoutes = props.drawerItems.find((e) => {
      return e.key === key;
    });
    if (filteredMainDrawerRoutes.routes.length === 1) {
      const selectedRoute = filteredMainDrawerRoutes.routes[0];
      props.navigation.toggleDrawer();
      props.navigation.navigate(selectedRoute.nav, {
        screen: selectedRoute.routeName,
      });
    } else {
      setMainDrawer(false);
      setFilteredItems(filteredMainDrawerRoutes);
    }
  };

  const logOut = async () => {
    
    await fetch(loginReducer.ipAddress[0].urlser + '/DevUsers', {
      method: 'POST',
      body: JSON.stringify({
        'BPAPUS-BPAPSV': loginReducer.serviceID,
        'BPAPUS-LOGIN-GUID': '',
        'BPAPUS-FUNCTION': 'UnRegister',
        'BPAPUS-PARAM':
          '{"BPAPUS-MACHINE": "' +
          registerReducer.machineNum +
          '","BPAPUS-USERID": "' +
          loginReducer.ipAddress[0].usernameser +
          '","BPAPUS-PASSWORD": "' +
          loginReducer.ipAddress[0].passwordser +
          '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "' +
          loginReducer.userName +
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
            navigation.dispatch(
              navigation.replace('LoginStackScreen')
            )
        } else {
          Alert.alert(
            Language.t('alert.errorTitle'),
          );
        }
      })
      .catch((error) => {
        console.error('ERROR at _fetchGuidLogin' + error);
        if (loginReducer.ipAddress[0].urlser == '') {
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

  function renderMainDrawer() {
    return (
      <View backgroundColor={Colors.borderColor}>
        {props.drawerItems.map((parent) => (
          <View key={parent.key}>
            <TouchableOpacity
              key={parent.key}
              testID={parent.key}
              onPress={() => {
                onItemParentPress(parent.key);
              }}>
              <View style={styles.parentItem}>
                <View>
                  <Text style={[styles.icon, styles.title]}>{parent.title}</Text>
                </View>
                <View>
                  <FontAwesomeIcon name="chevron-right" size={FontSize.medium} color={Colors.buttonColorPrimary} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {renderLogoutBtn()}
      </View>
    );
  }

  function renderFilteredItemsDrawer() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => toggleMainDrawer()}
          style={styles.backButtonRow}>
          <View style={styles.backparentItem}>
            <View>
              <FontAwesomeIcon name="chevron-left" size={FontSize.medium} color={Colors.buttonColorPrimary} />
            </View>
            <View>
              <Text style={[styles.backButtonText, styles.title]}>{filteredItems.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {filteredItems.routes.map((route) => {
          return (
            <TouchableOpacity
              key={route.routeName}
              testID={route.routeName}
              onPress={() =>
                props.navigation.navigate(route.nav, {
                  route: route,
                })
              }
              style={styles.backButtonsubRow}>
              <View style={styles.backparentItem}>
                <View>
                  <FontAwesomeIcon name="circle" size={FontSize.medium} color={Colors.buttonColorPrimary} />
                </View>
                <View>
                  <Text style={styles.title}>{route.title}</Text>
                </View>
              </View>

            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function renderLogoutBtn() {
    return (
      <View >
        <TouchableOpacity onPress={logOut} testID="customDrawer-logout">
          <View style={styles.parentItem}>
            <Text style={styles.title}>{'ออกจากระบบ'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ backgroundColor: Colors.backgroundLoginColor }}>
        <SafeAreaView
          style={styles.container}
          forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={styles.centered}>
            <View style={{ padding: 50 }}>
              <Image
                source={require('./images/pic_logo_app_t__.png')}
                style={styles.logo}
              />
            </View>
          </View >
          <View style={{ backgroundColor: Colors.backgroundLoginColor }}>
            {mainDrawer ? renderMainDrawer() : renderFilteredItemsDrawer()}
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 100,
    flexDirection: 'row',
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 125,
    height: 125,
  },
  drawerContainer: {
    backgroundColor: Colors.backgroundLoginColor,
  },
  container: {
    flex: 1,
    zIndex: 1000,
  },
  centered: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundLoginColor
  },
  parentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    borderBottomColor: Colors.backgroundLoginColor,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backparentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: FontSize.medium,
    color: Colors.backgroundLoginColor,
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    fontSize: FontSize.medium,
    backgroundColor: Colors.borderColor,
    borderBottomColor: Colors.fontColor2,
  },
  backButtonsubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    fontSize: FontSize.small,
    borderBottomColor: Colors.borderColor,
    backgroundColor: Colors.fontColor2,

  },
  backButtonText: {

    color: Colors.fontColor2,
  },
});

export default CustomDrawerContent;
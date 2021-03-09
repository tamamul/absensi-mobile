import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Alert, Image, ImageBackground, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontsFamilys, images } from "../../theme";
import TopBar from '../../components/TopBar';
import AsyncStorage from "@react-native-community/async-storage";
import { CONSTANT } from '../../helpers/constant';
import { fetchApi, postApi, fetchCheckAccount } from '../../services/Api';
import Axios from "axios";
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

const permission = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.RECORD_AUDIO];

const Home = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [myPoin, setMyPoin] = useState(0);
  const [user, setUser] = useState({});

  const props = route.params;

  const listButton = [
    {
      title: 'Absent',
      icon: 'account-check-outline',
      onPress: () => {
        navigation.push('Absent')
      }
    },
    {
      title: 'Leave Request',
      icon: 'account-alert-outline',
      onPress: () => {
        navigation.push('LeaveRequest')
      }
    },
    {
      title: 'History Absent',
      icon: 'book-outline',
      onPress: () => {
        navigation.push('History')
      }
    }
  ]

  useEffect(() => {
    checkAccount();
    permissionCheck();
    // setIsLoading(false);
  }, [])

  const checkAccount = async () => {
    try {
      setIsLoading(true);
      let localUser = JSON.parse(await AsyncStorage.getItem(CONSTANT.KEY_USER));
      let token = await AsyncStorage.getItem(CONSTANT.KEY_TOKEN);
      console.log('localUser', localUser, token);
      setUser(localUser);
      if (localUser.nama == null || localUser.nama == '') {
        navigation.push('Register', {
          setUser, user
        })
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error check', error);
      Alert.alert('Error', 'Something went wrong!');
    }

  }

  const permissionCheck = async () => {
    for (let i = 0; i < permission.length; i++) {
      await checkPermission(permission[i]);
    }
  }

  const checkPermission = async (dt) => {
    let result = await check(dt);
    await handlePermission(result, dt);
  }

  const requestPermission = async (dt) => {
    let result = await request(dt);
    await handlePermission(result, dt);
  }

  const handlePermission = async (result, dt) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        await requestPermission(dt);
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        await requestPermission(dt);
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  }

  const ButtonHome = ({ title, icon, onPress }) => {
    return (<TouchableOpacity
      style={{
        flex: 1,
        flexDirection: 'row',
        borderColor: colors.background,
        // borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginVertical: 5,
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      onPress={() => {
        onPress();
      }}
    >
      <View style={{
        flexDirection: 'row', alignItems: 'center',
      }}>
        <Icon
          name={icon}
          size={30}
          color={colors.textReverse}
        />
        <Text style={{
          fontSize: 16,
          fontFamily: fontsFamilys.bold,
          color: colors.textReverse,
          paddingHorizontal: 16
        }}>{title}</Text>
      </View>
      <Icon
        name="chevron-right"
        size={30}
        color={colors.textReverse}
      />
    </TouchableOpacity>)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* <StatusBar
          backgroundColor={colors.background}
          barStyle="light-content"
        /> */}
        <TopBar title="Home">
          {/* <Icon
            name="account-settings"
            size={24}
            color={colors.itemInactive}
            style={{ position: "absolute", right: 10 }}
          /> */}
        </TopBar>
        <ImageBackground source={require('../../assets/images/gray-bg.jpg')} style={{ flex: 1 }}>
          <ScrollView
            style={{ width: "100%", flex: 1 }}
            contentContainerStyle={{ alignItems: 'center' }}
            showsVerticalScrollIndicator={false}>
            <Image source={user?.photo ? { uri: user.photo } : images.logo} style={{ height: 100, width: 100, resizeMode: 'contain', borderRadius: 50, marginTop: 20 }} />
            <Text style={{
              color: colors.text,
              fontSize: 21,
              paddingTop: 10,
              fontFamily: fontsFamilys.bold,
            }}>{user.nama}</Text>
            <Text style={{
              color: colors.text,
              fontSize: 14,
              paddingTop: 2,
              fontFamily: fontsFamilys.regular,
            }}>{user.nis}</Text>

            <View style={{
              padding: 16,
              alignSelf: 'stretch',
              flex: 1,
              // marginTop: 15,
              // flex: 1,
            }}>
              <Text style={{
                color: colors.text,
                fontSize: 18,
                fontFamily: fontsFamilys.semiBold,
                alignSelf: 'flex-start',
              }}>Feature</Text>
              {
                listButton.map(dt => <ButtonHome title={dt.title} onPress={dt.onPress} icon={dt.icon}/>)
              }


            </View>
          </ScrollView>
        </ImageBackground>
      </View>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size='large' color={colors.primary} />
        </View>
      }

    </SafeAreaView>
  )
}

const MARGIN_BOTTOM = 38

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(86, 101, 115, 0.7)',
  },
  rowScrollContainer: { flexDirection: "row", marginLeft: 9 },
  centeredText: {
    alignSelf: "center",
    color: colors.white,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 18.5,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginBottom: MARGIN_BOTTOM,
  },
  albumText: {
    width: "94%",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "normal",
    color: colors.grey,
    top: 10,
    fontSize: 13,
  },
})

const albumDimensions = {
  ROW_SCROLLVIEW_HEIGHT: 180,
  ALBUM_DIMEN_RECENT: 166 - MARGIN_BOTTOM,
  ALBUM_DIMEN_FEATURED: 156,
}

export default Home;

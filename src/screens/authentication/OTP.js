import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    Keyboard,
    ActivityIndicator
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontsFamilys } from "../../theme";
import TopBar from '../../components/TopBar';
import AsyncStorage from '@react-native-community/async-storage'
import { CONSTANT } from '../../helpers/constant'
import { fetchApi, postApi } from '../../services/Api';

const OTP = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');

    const props = route.params;

    useEffect(() => {
        // console.log(props)
    }, [])

    const onPressOTP = () => {
        Keyboard.dismiss();
        setIsLoading(true);
        fetchSecurity()
    }

    async function fetchSecurity() {
        try {
            const session = JSON.parse(await AsyncStorage.getItem(CONSTANT.KEY_SESSION));
            const otpCode = otp.replace(/ /g, '');
            const method = {
                method: 'security',
                security_code: otpCode
            }

            const res = await postApi(method, session);
            const result = res?.data?.result;
            console.log('res', method)
            if(res.data.sessionid)
            {
                await AsyncStorage.setItem(CONSTANT.KEY_SESSION_ID, res.data.sessionid);
                props.setIsLogin(true);
            }
            else {
                Alert.alert('Invalid', result?.challenge?.errors[0] || 'Invalid OTP code');
                setIsLoading(false);
            }
        } catch(error){
            setIsLoading(false);
            console.log('error otp', error);
            Alert.alert('Error', 'Something went wrong!')
        }
    }

    const disabled = otp == '';
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                {/* <StatusBar
                    backgroundColor={colors.background}
                    barStyle="light-content"
                /> */}
                {/* <ScrollView
                    style={{ width: "100%", flex: 1 }}
                    // contentContainerStyle={{ paddingBottom: PLAYER_HEIGHT }}
                    showsVerticalScrollIndicator={false}> */}
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 15
                }}>
                    <Image source={require('../../assets/icons/logo-black.png')}
                        style={{ height: 80, width: 250, resizeMode: 'contain', marginBottom: 15 }}
                    />
                    <Text style={{
                        color: colors.text,
                        paddingVertical: 20,
                        fontFamily: fontsFamilys.semiBold,
                    }}>Please check the code we sent you</Text>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        paddingVertical: 5
                        // flex: 1,
                    }}>
                        <TextInput
                            style={{
                                flex: 1,
                                height: 50,
                                paddingHorizontal: 15,
                                borderColor: colors.lightGrey,
                                borderWidth: 1,
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderRadius: 5,
                                // fontFamily: fontsFamilys.regular,
                            }}
                            placeholder="OTP Code"
                            placeholderTextColor={colors.lightGrey}
                            onChangeText={text => setOtp(text)}
                            value={otp}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        paddingVertical: 5
                        // flex: 1,
                    }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 50,
                                paddingHorizontal: 15,
                                marginTop: 35,
                                borderColor: colors.background,
                                // borderWidth: 1,
                                backgroundColor: disabled ? colors.inactive : colors.primary,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            disabled={disabled}
                            onPress={onPressOTP}
                        >
                            <Text style={{
                                color: colors.textReverse,
                                fontFamily: fontsFamilys.bold,
                                fontSize: 21
                            }}>VERIFY</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </ScrollView> */}
                
                {isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color={colors.primary}/>
                    </View>
                }
            </View>

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
        color: colors.text,
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

export default OTP;

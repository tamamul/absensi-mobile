import React, { useState, useEffect, useCallback } from "react";
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
    ActivityIndicator,
    Keyboard
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsFamilys, images } from "../../theme";
import TopBar from '../../components/TopBar';
import { CONSTANT } from '../../helpers/constant'
import { fetchApi, postApi } from '../../services/Api';

const Login = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState({});

    const props = route.params;

    useEffect(() => {
        // console.log(navigation, route)


    }, [])

    const handleLogin = async () => {
        try {
            Keyboard.dismiss();
            setIsLoading(true);
            const params = {
                nis: username,
                password
            }
            const response = await postApi('auth/login', params);
            const res = response.data;
            console.log('response login', response);
            if (res.code == CONSTANT.KEY_SUCCESS) {
                await AsyncStorage.multiSet([
                    [CONSTANT.KEY_TOKEN, res.data.token],
                    [CONSTANT.KEY_USER, JSON.stringify(res.data.user)],
                    [CONSTANT.KEY_SESSION_ID, JSON.stringify(params)]
                ]);
                props.setIsLogin(true);
            }
            else {
                Alert.alert('Failed', 'Incorrect username or password!');
                setIsLoading(false);
            }
        } catch (e) {
            setIsLoading(false);
            console.log('error login', e);
            Alert.alert('Error', 'Something went wrong!')
        }
    }

    async function gotoRegister() {
        try {
            navigation.push('Register');
        } catch ({ error }) {
            console.log('error gotoRegister', error);
            Alert.alert('Error', 'Something went wrong!')
        }
    }


    const disabled = username == '' || password == '';
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
                    <Image source={images.logo}
                        style={{ height: 100, width: 100, resizeMode: 'contain', marginBottom: 10 }}
                    />
                    <Text style={{
                        fontFamily: fontsFamilys.bold,
                        fontSize: 32,
                        paddingVertical: 12
                    }}>Absensi</Text>
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
                                borderRadius: 5
                            }}
                            placeholder="NIS"
                            placeholderTextColor={colors.lightGrey}
                            onChangeText={text => setUsername(text)}
                            value={username}
                        />
                    </View>
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
                                borderRadius: 5
                            }}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor={colors.lightGrey}
                            onChangeText={text => setPassword(text)}
                            value={password}
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
                            onPress={handleLogin}
                        >
                            <Text style={{
                                color: colors.textReverse,
                                fontFamily: fontsFamilys.bold,
                                fontSize: 21
                            }}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color={colors.primary} />
                    </View>
                }
                {/* </ScrollView> */}
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

export default Login;

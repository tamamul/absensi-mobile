import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, BackHandler } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontsFamilys } from "../../theme";
import TopBar from '../../components/TopBar';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from "@react-native-community/async-storage";
import { CONSTANT } from '../../helpers/constant';
import { toUcFirst } from '../../helpers';
import { fetchApi, postApi, fetchCheckAccount } from '../../services/Api';



const Register = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [nama, setNama] = useState('');
    const [idKelas, setIdKelas] = useState('');
    const [options, setOptions] = useState([]);
    const { setIsLogin, setUser, user } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: 'Form Register' });
        getKelas();

        const backAction = () => {
            return true;
        };


        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    const getKelas = async () => {
        try {
            setIsLoading(true);
            const response = await fetchApi('kelas');
            console.log('response', response)
            if (response.data.code === CONSTANT.KEY_SUCCESS) {
                setOptions(response.data.data);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log('e getKelas', error)

        }
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const params = {
                nama,
                idKelas,
                nis: user.nis
            }
            const response = await postApi('auth/update', params);
            const res = response.data;
            console.log('response regis', response);
            if (res.code === CONSTANT.KEY_SUCCESS) {
                setIsLoading(false);
                const user = JSON.parse(await AsyncStorage.getItem(CONSTANT.KEY_USER));
                const newData = { ...user, ...res.data };
                await AsyncStorage.setItem(CONSTANT.KEY_USER, JSON.stringify(newData));
                setUser(newData);
                navigation.pop();
            }
        } catch (error) {
            setIsLoading(false);
            console.log('error regis', error);
            Alert.alert('Error', 'Something went wrong!')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                {/* <StatusBar
                    backgroundColor={colors.background}
                    barStyle="light-content"
                /> */}
                <ScrollView
                    style={{ width: "100%" }}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}>

                    <View style={{ paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fontsFamilys.bold,
                            color: colors.text,
                            paddingVertical: 10
                        }}>Nama</Text>
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
                            placeholder="Nama"
                            placeholderTextColor={colors.lightGrey}
                            onChangeText={text => setNama(text)}
                            value={nama}
                        />
                    </View>

                    <View style={{ paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fontsFamilys.bold,
                            color: colors.text,
                            paddingVertical: 10
                        }}>Kelas</Text>
                        <View style={{
                            flex: 1,
                            height: 50,
                            borderColor: colors.lightGrey,
                            borderWidth: 1,
                            borderRadius: 5
                        }}>
                            <Picker
                                selectedValue={idKelas}
                                style={{
                                    flex: 1,
                                    height: 40,
                                    paddingHorizontal: 15,
                                    borderColor: colors.lightGrey,
                                    borderWidth: 1,
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderRadius: 5
                                }}
                                onValueChange={(itemValue, itemIndex) =>
                                    setIdKelas(itemValue)
                                }>
                                <Picker.Item label="Pilih Kelas" value="" />
                                {
                                    options.map(dt =>
                                        <Picker.Item value={dt.id_kelas} key={dt.id_kelas} label={dt.kelas} />)
                                }
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginTop: 25,
                            paddingVertical: 16,
                            // paddingHorizontal: 15,
                            borderColor: colors.background,
                            // borderWidth: 1,
                            backgroundColor: colors.primary,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            onSubmit();
                        }}
                        disabled={nama == '' || idKelas == ''}
                    >
                        <Text style={{
                            color: colors.textReverse,
                            fontFamily: fontsFamilys.bold,
                            fontSize: 18
                        }}>SUBMIT</Text>
                    </TouchableOpacity>
                </ScrollView>
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

export default Register;

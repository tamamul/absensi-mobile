import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, TouchableOpacity, Image, Text, ImageBackground, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontsFamilys } from "../../theme";
import TopBar from '../../components/TopBar';
import AsyncStorage from "@react-native-community/async-storage";
import { CONSTANT } from '../../helpers/constant';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { fetchApi, postApi, fetchCheckAccount } from '../../services/Api';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyD-fQ4pEHlSzYmAwLIWM7D5jj7hbg5SKYk");

const History = ({ navigation, route }) => {
    const props = route.params;
    const page = 1;
    const limit = 10;

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getHistory();
    }, [])

    useEffect(() => {
        if (data.some(dt => (dt.address == 'Loading..'))) {
            getAddress();
        }
    }, [data])

    const getHistory = async (page = 1, limit = 10) => {
        try {
            setIsLoading(true);
            const response = await fetchApi('history', { page, limit });
            console.log('response', response)
            if (response.data.code === CONSTANT.KEY_SUCCESS) {
                // setData(response.data.data);
                let temp = [];
                response.data.data.map(async dt => {
                    dt['address'] = 'Loading..';
                    temp.push(dt);
                })
                setData(temp);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log('e getHistory', error)

        }
    }

    const getAddress = () => {
        let newData = Object.assign([], data);

        data.map(async (dt, i) => {
            try {
                let getAddress = await Geocoder.from(dt.latitude, dt.longitude);
                var addressComponent = getAddress.results[0].formatted_address;
                console.log(getAddress)
                dt['address'] = addressComponent;
                // newData.push(dt);
                let temp = newData.find(fd => fd.tgl == dt.tgl);
                temp['address'] = addressComponent;
                newData[i] = temp;
            } catch (e) {
                let temp = newData.find(fd => fd.tgl == dt.tgl);
                dt['address'] = 'Gagal mendapatkan alamat..';
                // newData.push(dt);
                newData[i] = temp;
            }
        });

        setTimeout(() => {
            console.log('address', newData);
            setData(newData)
        }, 1200);

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                <ImageBackground source={require('../../assets/images/gray-bg.jpg')} style={{ flex: 1 }}>
                    <ScrollView
                        style={{ width: "100%" }}
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}>
                        {
                            data.map(dt => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            // paddingVertical: 20,
                                            // paddingHorizontal: 15,
                                            marginRight: 8,
                                            marginVertical: 5,
                                            borderColor: colors.background,
                                            // borderWidth: 1,
                                            backgroundColor: colors.primary,
                                            borderRadius: 5,
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-start',
                                            flexDirection: 'row'
                                        }}
                                        onPress={() => {
                                            // onLogout();
                                        }}
                                    >
                                        <Image
                                            source={{ uri: dt.link }}
                                            style={{
                                                width: 100,
                                                height: 110,
                                                borderRadius: 5,
                                            }} resizeMode='cover' />
                                        <View style={{ margin: 10, flex: 1 }}>
                                            <Text style={{
                                                fontSize: 19,
                                                fontFamily: fontsFamilys.bold,
                                                color: colors.textReverse,
                                            }}>{dt.tgl}</Text>
                                            <Text style={{
                                                fontSize: 14,
                                                fontFamily: fontsFamilys.bold,
                                                color: colors.textReverse,
                                            }}>{dt.address}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
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

export default History;

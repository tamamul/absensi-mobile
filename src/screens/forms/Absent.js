import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontsFamilys } from "../../theme";
import TopBar from '../../components/TopBar';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from "@react-native-community/async-storage";
import { CONSTANT } from '../../helpers/constant';
import { toUcFirst } from '../../helpers';
import { fetchApi, postApi, fetchCheckAccount } from '../../services/Api';
import { RNCamera } from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';


Geocoder.init("AIzaSyD-fQ4pEHlSzYmAwLIWM7D5jj7hbg5SKYk");

const Absent = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [photo, setPhoto] = useState('');
    const [longlat, setLonglat] = useState({});
    const [address, setAddress] = useState(null);
    const { params } = route;

    useEffect(() => {
        getLocation();
        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, [])

    const watchID = () => Geolocation.watchPosition(position => {
        const lastPosition = JSON.stringify(position);
        console.log('watch', position);
        setLonglat(position.coords);
        setIsLoading(false);
    });

    const getLocation = () => {
        setIsLoading(true);
        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = JSON.stringify(position);
                setLonglat(position.coords);
                setIsLoading(false);
                console.log('ini', position)
            },
            error => {
                console.log('error getCurrentPosition', JSON.stringify(error))
                // setIsLoading(false);
                // Alert.alert('Error', JSON.stringify(error), [{
                //     text: 'Ulangi',
                //     onPress: () => getLocation()
                // }
                // ]);
                getLocation();
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 },
        );
        watchID();
    }

    useEffect(() => {
        if ('latitude' in longlat) {
            setIsLoading(true);
            Geocoder.from(longlat.latitude, longlat.longitude)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    setAddress(addressComponent);
                    setIsLoading(false);
                    console.log('addressComponent', addressComponent, longlat.latitude, longlat.longitude);
                })
                .catch(error => {
                    setIsLoading(false);
                    setAddress(null);
                    console.warn(error)
                });
        }
    }, [longlat])

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const params = {
                latitude: longlat.latitude,
                longitude: longlat.longitude,
                alamat : address,
                status: 'hadir',
                notes: null,
                photo: photo.replace('data:image/png;base64,', ''),
            }

            if (typeof params.latitude == 'undefined' || params.longitude == null) {
                return Alert.alert('Error', 'Gagal mendapatkan alamat.', [{
                    text: 'OK',
                    onPress: () => navigation.pop()
                }])
            }
            const response = await postApi('absent/save', params);
            setIsLoading(false);
            console.log('res', response);
            if (response.data.code === CONSTANT.KEY_SUCCESS) {
                Alert.alert('Berhasil', response.data.message);
                navigation.pop();
            }
            else {
                Alert.alert('Failed', response.data.message);
            }

        } catch (error) {
            setIsLoading(false);
            console.log('error fitur', error);
            Alert.alert('Error', 'Something went wrong!')
        }
    }

    const takePicture = async (camera) => {
        if (camera) {
            const options = { quality: 0.5, base64: true };
            const data = await camera.takePictureAsync(options);
            // console.log('data:image/png;base64,' + data.base64);
            setPhoto('data:image/png;base64,' + data.base64);
        }
    };

    const Loading = () => (
        <View style={styles.loading}>
            <ActivityIndicator size='large' color={colors.primary} />
            { !('latitude' in longlat) && (
                <Text style={{
                    marginTop: 20,
                    fontSize: 19,
                    fontFamily: fontsFamilys.bold,
                    color: colors.textReverse,
                }}>Mencari alamat..</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.container}>
                {/* <StatusBar
                    backgroundColor={colors.background}
                    barStyle="light-content"
                /> */}

                {/* <View style={{ paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fontsFamilys.bold,
                            color: colors.text,
                            paddingVertical: 10
                        }}>Link</Text>
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
                            placeholder="Link"
                            placeholderTextColor={colors.lightGrey}
                            onChangeText={text => setLink(text)}
                            value={link}
                        />
                    </View>

                    <View style={{ paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fontsFamilys.bold,
                            color: colors.text,
                            paddingVertical: 10
                        }}>Jumlah</Text>
                        <View style={{
                            flex: 1,
                            height: 50,
                            borderColor: colors.lightGrey,
                            borderWidth: 1,
                            borderRadius: 5
                        }}>
                            <Picker
                                selectedValue={jumlah}
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
                                    setJumlah(itemValue)
                                }>
                                <Picker.Item label="Pilih jumlah poin" value="" />
                                {
                                    optionPoints.map(dt =>
                                        <Picker.Item value={dt} key={dt} label={dt + (params.type == 'follow' ? ' = ' + (dt * 2) + ' Followers' : ' = ' + (dt * 5) + ' Likes')} />)
                                }
                            </Picker>
                        </View>
                    </View> */}

                {photo == '' ? (
                    <RNCamera
                        style={styles.preview}
                        type={RNCamera.Constants.Type.front}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    >
                        {({ camera, status, recordAudioPermissionStatus }) => {
                            if (status !== 'READY') return <Loading />
                            return (
                                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                                        <Icon
                                            name="camera"
                                            size={30}
                                            color={colors.textReverse}
                                        />
                                        <Text style={{
                                            color: colors.textReverse,
                                            fontFamily: fontsFamilys.bold,
                                            fontSize: 18
                                        }}>Take Picture</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    </RNCamera>
                ) : (
                    <ScrollView
                        style={{ width: "100%", flex: 1 }}
                        // contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}>
                        <Image source={{ uri: photo }} style={{ height: Dimensions.get('window').height / 2, width: '100%', resizeMode: 'contain', borderRadius: 50, marginTop: 20 }} />

                        <TouchableOpacity
                            style={{
                                marginTop: 85,
                                paddingVertical: 16,
                                // paddingHorizontal: 15,
                                borderColor: colors.background,
                                // borderWidth: 1,
                                marginHorizontal: 16,
                                marginBottom: 20,
                                backgroundColor: colors.primary,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                onSubmit();
                            }}
                        >
                            <Text style={{
                                color: colors.textReverse,
                                fontFamily: fontsFamilys.bold,
                                fontSize: 18
                            }}>SUBMIT</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
            {isLoading &&
                <Loading />
            }

        </SafeAreaView>
    )
}

const MARGIN_BOTTOM = 38

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'space-between',
        flexDirection: 'column'
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
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: colors.darkerGrey,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
})

const albumDimensions = {
    ROW_SCROLLVIEW_HEIGHT: 180,
    ALBUM_DIMEN_RECENT: 166 - MARGIN_BOTTOM,
    ALBUM_DIMEN_FEATURED: 156,
}

export default Absent;

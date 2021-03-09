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
import DatePicker from 'react-native-date-picker'
import BottomSheet from "../../components/BottomSheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const LeaveRequest = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState(null);
    const [optionsType, setOptionsType] = useState([
        {
            label: 'Sakit',
            value: 'sakit'
        },
        {
            label: 'Izin',
            value: 'izin'
        },
    ]);
    const [notes, setNotes] = useState('');
    const [photo, setPhoto] = useState(null);
    const cameraOptions = {
        quality: 0.4,
        mediaType: "photo",
        includeBase64: true,
        maxHeight: 200,
        maxWidth: 200,
    };

    useEffect(() => {
    }, [])

    const handleImage = (response) => {
        if (response?.base64) {
            setPhoto('data:image/png;base64,' + response.base64);
        }

    }

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            if (type == 'sakit') {
                if (photo == null) {
                    return Alert.alert('Failed', "Doctor's note is required", [{
                        text: 'OK',
                        onPress: () =>
                            setIsLoading(false)
                    }]);
                }
            }
            else {
                if (notes == '') {
                    return Alert.alert('Failed', "Reason is required", [{
                        text: 'OK',
                        onPress: () =>
                            setIsLoading(false)
                    }]);
                }
            }

            const params = {
                latitude: null,
                longitude: null,
                alamat: null,
                status: type,
                notes: notes == '' ? null : notes,
                photo: photo ? photo.replace('data:image/png;base64,', '') : null,
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
            console.log('error leave', error);
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
                        }}>Date</Text>
                        <View style={{
                            flex: 1,
                            height: 50,
                            borderColor: colors.lightGrey,
                            borderWidth: 1,
                            borderRadius: 5
                        }}>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 10,
                                    borderColor: colors.lightGrey,
                                    borderWidth: 1,
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderRadius: 5,
                                    justifyContent: 'center'
                                }}
                                onPress={() => setIsDateOpen(true)}
                            >
                                <Text>{date.toDateString()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fontsFamilys.bold,
                            color: colors.text,
                            paddingVertical: 10
                        }}>Request Type</Text>
                        <View style={{
                            flex: 1,
                            height: 50,
                            borderColor: colors.lightGrey,
                            borderWidth: 1,
                            borderRadius: 5
                        }}>
                            <Picker
                                selectedValue={type}
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
                                    setType(itemValue)
                                }>
                                <Picker.Item label="Choose request type" value="" />
                                {
                                    optionsType.map((dt, i) =>
                                        <Picker.Item value={dt.value} key={i} label={dt.label} />)
                                }
                            </Picker>
                        </View>
                    </View>



                    {type == 'sakit' && (
                        <View style={{ paddingVertical: 5 }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: fontsFamilys.bold,
                                color: colors.text,
                                paddingVertical: 10
                            }}>Doctor's Note</Text>
                            <View style={{
                                flex: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between'
                            }}>

                                <TouchableOpacity onPress={() => launchCamera(cameraOptions, handleImage)} style={styles.capture}>
                                    <Icon
                                        name="camera"
                                        size={30}
                                        color={colors.textReverse}
                                    />
                                    <Text style={{
                                        color: colors.textReverse,
                                        fontFamily: fontsFamilys.bold,
                                        fontSize: 18
                                    }}>Open Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => launchImageLibrary(cameraOptions, handleImage)} style={styles.capture}>
                                    <Icon
                                        name="attachment"
                                        size={30}
                                        color={colors.textReverse}
                                    />
                                    <Text style={{
                                        color: colors.textReverse,
                                        fontFamily: fontsFamilys.bold,
                                        fontSize: 18
                                    }}>Open Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {photo && (
                        <Image source={{ uri: photo }} style={{ height: Dimensions.get('window').height / 3, width: '100%', resizeMode: 'contain', marginTop: 20 }} />
                    )}

                    {type != null && (<View style={{ paddingVertical: 5 }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: fontsFamilys.bold,
                            color: colors.text,
                            paddingVertical: 10
                        }}>{type == 'sakit' ? 'Notes' : 'Reason'}</Text>
                        <TextInput
                            style={{
                                flex: 1,
                                minHeight: 50,
                                paddingHorizontal: 15,
                                borderColor: colors.lightGrey,
                                borderWidth: 1,
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderRadius: 5,
                                flexWrap: 'wrap',
                                paddingBottom: 30

                            }}
                            placeholder={type == 'sakit' ? 'Notes' : 'Reason'}
                            placeholderTextColor={colors.lightGrey}
                            onChangeText={text => setNotes(text)}
                            value={notes}
                            multiline={true}
                        />
                    </View>)}


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
                            justifyContent: 'center',
                        }}
                        disabled={type == null}
                        onPress={() => {
                            onSubmit();
                        }}
                    >
                        <Text style={{
                            color: colors.textReverse,
                            fontFamily: fontsFamilys.bold,
                            fontSize: 18
                        }}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <BottomSheet
                isVisible={isDateOpen}
                onClose={() => setIsDateOpen(false)}
                onBackdropPress={() => setIsDateOpen(false)}
            >
                <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 40,
                    borderTopStartRadius: 10,
                    borderTopEndRadius: 10,
                    zIndex: 1,
                    // height: Dimensions.get('window').height - Dimensions.get('window').height * 0.2
                }}>
                    <TouchableOpacity
                        style={styles.popupClose}
                        onPress={() => setIsDateOpen(false)}
                        accessibilityLabel="btnClose">
                        <Text style={{ color: '#FFFFFF', marginTop: -5, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>x</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 16, }}>
                        <DatePicker
                            mode='date'
                            date={date}
                            onDateChange={setDate}
                        />
                    </View>
                </View>
            </BottomSheet>
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
    popupClose: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#78849E',
        width: 35,
        height: 35,
        borderRadius: 17.5,
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 2,
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
        width: '48%',
        alignSelf: 'center',
        alignItems: 'center',
    },
})

const albumDimensions = {
    ROW_SCROLLVIEW_HEIGHT: 180,
    ALBUM_DIMEN_RECENT: 166 - MARGIN_BOTTOM,
    ALBUM_DIMEN_FEATURED: 156,
}

export default LeaveRequest;

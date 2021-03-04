import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, BackHandler, Alert } from 'react-native';
import NextButton from '../../components/NextButton';
import { DotBold, DotLight } from '../../components/DotSlider';
import { colors, fontsFamilys } from "../../theme";
import SkipButton from "../../components/SkipButton"

const Onboarding = ({ navigation, route }) => {
    const [page, setPage] = useState(0);

    const backHandler = () => BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
    );

    useEffect(() => {
        backHandler();

        return () => backHandler().remove();
    }, [page]);

    const backAction = () => {
        // console.log(page)
        if (page == 0)
            Alert.alert("Hold on!", "Are you sure you want to go back?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
        else if (page == 1)
            setPage(0);
        else if (page == 2)
            setPage(1);
        else if (page == 3) {
            navigation.pop();
            setPage(2);
        }

        return true;
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                page == 0 ?
                    <One setPage={setPage} navigation={navigation} /> : page == 1 ? <Two setPage={setPage} navigation={navigation} /> : <Three setPage={setPage} navigation={navigation} />
            }
        </SafeAreaView>
    );
};

const One = ({navigation, setPage }) => (
    <View style={styles.container}>
        <SkipButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => {
            setPage(3);
            navigation.push("Login",);
        }} />
        <View style={styles.imageContainer}>
            <Image source={require('../../assets/icons/on1.png')} style={styles.image} resizeMode="stretch"
            />
        </View>
        <Text style={styles.textTitle}>Layanan Berkualitas</Text>
        <Text style={styles.textBody}>Kami akan terus memberikan layanan yang berkualitas kepada seluruh pengguna Aplikasi ini, dan menjamin bahwa setiap service yang kami berikan kepada anda adalah kualitas terbaik, baik pada fitur Followers maupun Instagram.</Text>
        <NextButton onClick={() => {
            setPage(1);
        }}>LANJUT</NextButton>
        <View style={{ flexDirection: 'row', marginVertical: 40 }}>
            <DotBold />
            <DotLight onPress={() => setPage(1)} />
            <DotLight onPress={() => setPage(2)} />
        </View>
    </View>
)

const Two = ({navigation, setPage }) => (
    <View style={styles.container}>
        <SkipButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => {
            setPage(3);
            navigation.push("Login",);
        }} />
        <View style={styles.imageContainer}>
            <Image source={require('../../assets/icons/on2.png')} style={styles.image} resizeMode="stretch"
            />
        </View>
        <Text style={styles.textTitle}>Kemudahan Penggunaan</Text>
        <Text style={styles.textBody}>Desain pada aplikasi ini telah kami buat se-simpel mungkin sehingga memudahkan Anda dalam penggunaan Aplikasi ini. Kami juga menyediakan beberapa petunjuk dalam penggunaan Aplikasi ini agar Anda dapat lebih nyaman.</Text>
        <NextButton onClick={() => {
            setPage(2);
        }}>LANJUT</NextButton>
        <View style={{ flexDirection: 'row', marginVertical: 40 }}>
            <DotLight onPress={() => setPage(0)} />
            <DotBold />
            <DotLight onPress={() => setPage(2)} />
        </View>
    </View>
)


const Three = ({ navigation, setPage }) => (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image source={require('../../assets/icons/on3.png')} style={styles.image} resizeMode="stretch"
            />
        </View>
        <Text style={styles.textTitle}>Keamanan Terjamin</Text>
        <Text style={styles.textBody}>Dengan menggunakan API Official Instagram, kami menjamin keamanan akun anda selama menggunakan aplikasi ini. Kami tidak menyimpan informasi akun anda, melainkan hanya menyimpan Cookies untuk digunakan dalam Aplikasi ini.</Text>
        <NextButton onClick={() => {
            setPage(3);
            navigation.push("Login",);
        }}>LANJUT</NextButton>
        <View style={{ flexDirection: 'row', marginVertical: 40 }}>
            <DotLight onPress={() => setPage(0)} />
            <DotLight onPress={() => setPage(1)} />
            <DotBold />
        </View>
    </View>
)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 16
    },
    imageContainer: {
        width: '50%',
        height: '35%',
        marginVertical: '5%',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    textTitle: {
        fontSize: 28,
        fontFamily: fontsFamilys.bold,
        color: colors.text,
    },
    textBody: {
        width: '75%',
        fontSize: 16,
        marginVertical: 20,
        textAlign: 'center',
        color: colors.text,
        lineHeight: 22,
        fontFamily: fontsFamilys.regular

    }
});

export default Onboarding;
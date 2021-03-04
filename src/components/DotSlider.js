import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { colors } from "../theme";

export const DotBold = () => {
    return (
        <View style={styles.dotBold}></View>
    );
};

export const DotLight = ({onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} opacity={0.4} style={styles.dotLight}></TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    dotBold: {
        width: Dimensions.get('window').width * 0.04,
        height: Dimensions.get('window').width * 0.04,
        borderRadius: Dimensions.get('window').width * 0.04 / 2,
        backgroundColor: colors.primary,
        marginHorizontal: '2%'
    },
    dotLight: {
        width: Dimensions.get('window').width * 0.03,
        height: Dimensions.get('window').width * 0.03,
        borderRadius: Dimensions.get('window').width * 0.03 / 2,
        backgroundColor: colors.primary,
        marginHorizontal: '2%',
        marginVertical: '0.5%',
        opacity:0.4
    }
});


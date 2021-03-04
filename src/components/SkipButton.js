import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import { colors, fontsFamilys } from "../theme";

const SkipButton = props => {
     return (
        <TouchableOpacity style={[styles.container, props.style]} onPress={props.onClick}>
            <Text style={styles.title}>LEWATI</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        paddingVertical: 7,
        paddingHorizontal: 14,
        marginTop: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: fontsFamilys.bold,
        color: colors.textReverse,
    }
});

export default SkipButton;
import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import { colors, fontsFamilys } from "../theme";

const Name = props => {
     return (
        <TouchableOpacity style={styles.container} onPress={props.onClick}>
            <Text style={styles.title}>{props.children}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 50,
        paddingVertical:10,
        backgroundColor: colors.primary,
        borderRadius: 50,
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 21,
        color: '#FFF',
        fontFamily: fontsFamilys.regular
    }
});

export default Name;
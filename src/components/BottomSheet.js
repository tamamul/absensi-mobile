import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Dimensions, ScrollView, Image, Text } from 'react-native';
import ReactModal from 'react-native-modal';

export default class BottomSheet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: true,
            isLoading: false,
            isChecked: false,
            isSuccesSubmit: false,
        }

    }

    render() {
        const { isVisible, onClose } = this.props;
        return (
            <ReactModal
                hasBackdrop={true}
                avoidKeyboard={true}
                backdropOpacity={0.8}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                isVisible={this.props.isVisible}
                onBackdropPress={this.props.onBackdropPress}
                onBackButtonPress={this.props.onClose}
            >
                <View
                    style={{
                        position: 'absolute',
                        bottom: -20,
                        left: -20,
                        right: -20
                    }}
                    centerContent={true}
                >

                    {this.props.children}
                </View>
            </ReactModal>
        )
    }
}

const styles = StyleSheet.create({
    buttonSubmit: {
        paddingVertical: 13,
        // paddingHorizontal: 55,
        width: Dimensions.get('window').width / 2.5,
        borderRadius: 24,
        borderColor: 'rgba(151, 152, 152, 0.5)',
        // borderWidth: 1,
    },
    buttonClose: {
        paddingVertical: 13,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: 'rgba(151, 152, 152, 0.5)',
        backgroundColor: 'rgba(120, 132, 158, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
        // borderWidth: 1,
    },
    popupButtonText: {
        textAlign: 'center',
        color: '#1D1E2C',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Nunito-Bold'
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
    checkbox: {
        paddingVertical: 20
    }
});
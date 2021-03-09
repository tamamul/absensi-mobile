import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, Platform, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets, HeaderBackButton } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { colors, fontsFamilys } from "./src/theme";
import UIHelper from "./src/helpers/UIHelper"
import { CONSTANT } from './src/helpers/constant'

import Login from './src/screens/authentication/Login';
import Register from './src/screens/authentication/Register';
import OTP from './src/screens/authentication/OTP';
import Onboarding from './src/screens/authentication/Onboarding';

import Home from './src/screens/home/Home';
import Favorite from './src/screens/favorite/Favorite';
import Settings from './src/screens/settings/Settings';
import Absent from './src/screens/forms/Absent';
import History from './src/screens/history/History';
import LeaveRequest from './src/screens/forms/LeaveRequest';

const BAR_HEIGHT = UIHelper.isIphoneX() ? 78 : 58

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Warning: Each',
    'Warning: Failed',
    'Remote debugger is in a background tab which may cause apps to perform slowly'
]);

const Navigation = () => {
    const [isLogin, setIsLogin] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    async function checkSession() {
        const sessionId = await AsyncStorage.getItem(CONSTANT.KEY_SESSION_ID);
        if (sessionId) {
            setIsLoading(false);
            setIsLogin(true);
        }
        else
            setIsLoading(false)
    }

    useEffect(() => {
        checkSession();
    }, [])

    return (
        isLoading ?
            <Loading />
            : isLogin ?
                <Main
                    isLogin={isLogin}
                    setIsLogin={setIsLogin} />
                : <Authentication
                    isLogin={isLogin}
                    setIsLogin={setIsLogin} />
    )
}

const HomeRoot = ({ route }) => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                style: {
                    backgroundColor: colors.tabBar,
                    padding: 2,
                    height: BAR_HEIGHT,
                    borderTopColor: colors.background,
                    // borderTopWidth: 0,
                    // backgroundColor: '#FCF6EE'
                },
                activeTintColor: colors.itemActive,
                inactiveTintColor: colors.itemInactive,
                labelStyle: {
                    fontSize: 12,
                    fontFamily: fontsFamilys.bold,
                    marginBottom: 5
                },
            }}
            backBehavior="initialRoute"
        >
            <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name={focused ? 'home' : 'home-outline'} size={25} color={color} />
                    ),
                }}
                initialParams={route.params}
            />
            <Tab.Screen name="Settings" component={Settings}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name={focused ? 'cog' : 'cog-outline'} size={25} color={color} />
                    ),
                }}
                initialParams={route.params}
            />
        </Tab.Navigator>
    )
}

const Main = ({ isLogin, setIsLogin }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="HomeRoot"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.tabBar,
                    },
                    headerTitleStyle: {
                        color: colors.white,
                        fontSize: 18
                    },
                    headerTintColor: colors.white
                }}
            >
                <Stack.Screen name="HomeRoot" component={HomeRoot} options={{
                    headerShown: false
                }}
                    initialParams={{ setIsLogin }} />
                <Stack.Screen name="Absent" component={Absent}
                    options={({ route }) => ({ title: 'Form Absent', headerTitleStyle: { fontFamily: fontsFamilys.bold } })} />
                <Stack.Screen name="LeaveRequest" component={LeaveRequest}
                    options={({ route }) => ({ title: 'Form Leave Request', headerTitleStyle: { fontFamily: fontsFamilys.bold } })} />
                <Stack.Screen name="History" component={History}
                    options={({ route }) => ({ title: 'History', headerTitleStyle: { fontFamily: fontsFamilys.bold } })} />

                <Stack.Screen name="Register" component={Register} options={{
                    headerShown: true,
                    headerLeft: null
                }}
                    initialParams={{ setIsLogin }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const Authentication = ({ isLogin, setIsLogin, isRegister }) => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={"Login"}
            // headerMode="none"
            >
                <Stack.Screen
                    name="OnBoarding"
                    component={Onboarding}
                    options={({ navigation }) => ({
                        headerShown: false
                    })}
                />
                <Stack.Screen name="Login" component={Login} options={{
                    headerShown: false
                }}
                    initialParams={{ setIsLogin }}
                />
                <Stack.Screen name="OTP" component={OTP} options={{
                    headerShown: false
                }}
                    initialParams={{ setIsLogin }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const Loading = ({ }) => (
    <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    }} >
        <ActivityIndicator size='large' color={colors.primary} />
    </View >
)
export default Navigation;
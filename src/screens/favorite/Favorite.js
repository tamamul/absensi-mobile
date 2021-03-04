import React from "react";
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from "../../theme";
import TopBar from '../../components/TopBar';

const Favorite = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.container}>
            {/* <StatusBar
                backgroundColor={colors.background}
                barStyle="light-content"
            /> */}
            <TopBar title="Favorite">
                {/* <Icon
                    name="account-settings"
                    size={24}
                    color={colors.itemInactive}
                    style={{ position: "absolute", right: 10 }}
                /> */}
            </TopBar>
            <ScrollView
                style={{ width: "100%" }}
                // contentContainerStyle={{ paddingBottom: PLAYER_HEIGHT }}
                showsVerticalScrollIndicator={false}>
                
            </ScrollView>
        </View>
        
    </SafeAreaView>
  )
}

const MARGIN_BOTTOM = 38

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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

export default Favorite;

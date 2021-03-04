import React from "react"
import { Text, View } from "react-native"
import { colors, fontsFamilys } from "../theme"

const TopBar = ({
  title,
  children,
}) => {
  return (
    <View
      style={{
        top: 0,
        height: 56,
        width: "100%",
        backgroundColor: colors.tabBar,
        justifyContent: "center",
      }}>
      <Text
        style={{
          color: colors.textReverse,
          alignSelf: "center",
          fontSize: 18,
          // fontWeight: "bold",
          fontFamily: fontsFamilys.bold
        }}>
        {title}
      </Text>
      {children}
    </View>
  )
}

export default TopBar

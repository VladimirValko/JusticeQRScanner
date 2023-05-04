import { Image } from "expo-image";
import { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";

const noAccessImage = require("../assets/8208952.jpg");

export const NoAccessToCamera: FC = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={noAccessImage} style={{ width: "100%", height: "50%" }} />
      <Text style={{ fontSize: 24 }}>No access to camera :(</Text>
      <View style={{ marginTop: 30 }}>
        <Button
          contentStyle={{ flexDirection: "row-reverse" }}
          labelStyle={{ fontSize: 18 }}
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{ padding: 10, backgroundColor: "#5c33d7" }}
        >
          Back to homepage
        </Button>
      </View>
    </View>
  );
};

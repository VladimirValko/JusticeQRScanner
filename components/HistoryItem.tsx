import { FC } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { checkIsValidUrl } from "../helpers/urlChecker";

type HistoryItemProps = {
  data: string;
  date: Date;
};

export const HistoryItem: FC<HistoryItemProps> = ({ data, date }) => {
  const isDataAValidURL = checkIsValidUrl(data);

  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(isDataAValidURL ? data : "");
      if (isDataAValidURL && supported) {
        await Linking.openURL(data);
      }
    } catch (error) {
      console.log(error);
    }

    !isDataAValidURL && Alert.alert("Your scanned data", `${data}`);
  };

  return (
    <TouchableOpacity
      style={styles.historyItemWrapper}
      onPress={() => handlePress()}
    >
      <View style={styles.historyItemLeftWrapper}>
        <View style={styles.historyItemTextWrapper}>
          <Text style={styles.historyItemText}>{data.slice(0, 25)}</Text>
        </View>
        <View>
          <Text style={styles.historyItemDate}>
            {moment(date).format("MMMM Do YYYY, HH:mm:ss")}
          </Text>
        </View>
      </View>
      <View style={styles.historyItemIcons}>
        {isDataAValidURL ? (
          <Feather name="external-link" size={24} color="#dda600" />
        ) : (
          <MaterialIcons name="text-fields" size={24} color="#5c33d7" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  historyItemWrapper: {
    flexDirection: "row",
    position: "relative",
    padding: 15,
    backgroundColor: "#ffffff",
    marginBottom: 15,
    minWidth: "90%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  historyItemLeftWrapper: { flexDirection: "column" },
  historyItemTextWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  historyItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#484848",
  },
  historyItemDate: {
    color: "#484848",
  },
  historyItemIcons: {
    position: "absolute",
    right: 15,
    top: 25,
  },
});

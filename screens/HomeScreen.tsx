import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Image } from "expo-image";
import { ScannedDataType, getData, storeData } from "../helpers/asyncStorage";
import { HistoryItem } from "../components/HistoryItem";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

const img = require("../assets/4148901_preview_rev_1.png");
const noHistory = require("../assets/3973481.jpg");

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const Home = ({ navigation }: Props) => {
  const [userDataFromStorage, setUserDataFromStorage] = useState<
    ScannedDataType[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const getDataFromStorage = async () => {
    const userData = await getData();
    setUserDataFromStorage(userData);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataFromStorage();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      getDataFromStorage();
    });
    return focusHandler;
  }, [navigation]);

  const handleClearHistory = async () => {
    await storeData([]);
    getDataFromStorage();
  };

  return (
    <SafeAreaView style={styles.homescreenWrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topImageWrapper}>
          <Image style={styles.topImage} source={img} contentFit="cover" />
        </View>
        <View></View>
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          <Button
            contentStyle={{ flexDirection: "row-reverse" }}
            labelStyle={{ fontSize: 18 }}
            icon="qrcode-plus"
            mode="contained"
            onPress={() => navigation.navigate("Scanner")}
            style={{ padding: 10, backgroundColor: "#5c33d7" }}
          >
            Scan QR code
          </Button>
        </View>

        <View style={styles.scanningHistoryWrapper}>
          <Text style={styles.scanningHistoryText}>Your scanning history</Text>
        </View>
        <View style={styles.scanningHistoryItemsWrapper}>
          {userDataFromStorage
            .sort((a, b) => +new Date(b.date) - +new Date(a.date))
            .map((dataItem: ScannedDataType) => (
              <View key={dataItem.id}>
                <HistoryItem data={dataItem.data} date={dataItem.date} />
              </View>
            ))}
        </View>
        {!userDataFromStorage.length && (
          <View style={styles.noHistoryWrapper}>
            <Image source={noHistory} style={styles.noHistoryImage} />
            <Text style={styles.noHistoryText}>No scanning history</Text>
          </View>
        )}
        {!!userDataFromStorage.length && (
          <Button
            textColor="red"
            icon="delete-clock-outline"
            mode="outlined"
            onPress={() => handleClearHistory()}
            contentStyle={{ flexDirection: "row-reverse" }}
            style={styles.clearHistoryButton}
          >
            Clear history
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homescreenWrapper: {
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    flex: 1,
  },
  topImageWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  topImage: {
    width: 300,
    height: 300,
  },
  scanningHistoryWrapper: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  scanningHistoryText: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 20,
    color: "#484848",
  },
  scanningHistoryItemsWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  noHistoryWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  noHistoryImage: { width: "40%", height: "40%" },
  noHistoryText: {
    marginTop: 10,
  },
  clearHistoryButton: {
    width: "50%",
    alignSelf: "center",
    borderColor: "red",
    borderRadius: 15,
    marginTop: 10,
  },
});

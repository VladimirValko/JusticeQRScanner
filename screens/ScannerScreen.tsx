import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { Image } from "expo-image";
import {
  storeData,
  getDataFromStorage,
  ScannedDataType,
} from "../helpers/asyncStorage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { NoAccessToCamera } from "../components/NoAccess";

type Props = NativeStackScreenProps<RootStackParamList, "Scanner">;
type BarcodeArgsType = {
  data: string;
};

const phoneIcon = require("../assets/4170461.jpg");

export const Scanner = ({ navigation }: Props) => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [userDataFromStorage, setUserDataFromStorage] = useState<
    ScannedDataType[]
  >([]);

  useEffect(() => {
    getDataFromStorage(setUserDataFromStorage);

    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleSubmitScannedData = async (data: string) => {
    await storeData([
      ...userDataFromStorage,
      {
        data,
        date: new Date(),
        id: `id${Math.random().toString(16).slice(2)}`,
      },
    ]);
    setScanned(false);
    navigation.navigate("Home");
  };

  const handleBarCodeScanned = ({ data }: BarcodeArgsType) => {
    setScanned(true);
    Alert.alert(
      "Scanned successfully",
      `${data},\n This data was saved to your history.`,
      [
        {
          text: "Scan again",
          onPress: () => setScanned(false),
        },
        {
          text: "Ok",
          onPress: () => handleSubmitScannedData(data),
        },
      ]
    );
  };

  if (!hasPermission) {
    return <NoAccessToCamera />;
  }

  return (
    <View style={styles.scannerScreenWrapper}>
      <Image source={phoneIcon} style={styles.topImage} />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
      >
        <View
          style={
            scanned ? styles.qrBorderWindowScanned : styles.qrBorderWindowSearch
          }
        >
          {scanned && <Feather name="check" size={104} color="green" />}
        </View>
      </BarCodeScanner>

      <View style={styles.goBackButtonWrapper}>
        <Button
          contentStyle={{ flexDirection: "row-reverse" }}
          labelStyle={{ fontSize: 18 }}
          mode="contained"
          onPress={() => navigation.navigate("Home")}
          style={styles.goBackButton}
        >
          Back to homepage
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerScreenWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  topImage: {
    height: 170,
    width: 170,
  },
  camera: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  qrBorderWindowSearch: {
    width: "60%",
    height: "60%",
    borderColor: "#ffffffaf",
    borderWidth: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  qrBorderWindowScanned: {
    width: "60%",
    height: "60%",
    borderColor: "green",
    borderWidth: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  goBackButtonWrapper: { marginTop: 30 },
  goBackButton: {
    padding: 10,
    backgroundColor: "#5c33d7",
  },
});

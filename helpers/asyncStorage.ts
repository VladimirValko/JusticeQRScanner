import AsyncStorage from "@react-native-async-storage/async-storage";

export type ScannedDataType = {
  data: string;
  date: Date;
  id: string
}

export const storeData = async (value: ScannedDataType[]) => {
  try {
    console.log(value, "Vvvvvvvvvvvvvvvvvvvv from storeData");
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("userData", jsonValue);
  } catch (error) {
    console.log(error)
  }
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(error) {
    console.log(error)
  }
}

export const getDataFromStorage = async (setDataToState: (userData: ScannedDataType[]) => void) => {
  const userData = await getData();
  setDataToState(userData);
};
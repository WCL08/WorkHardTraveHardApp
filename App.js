import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos"
const WORKING_KEY = "@Working"

export default function App() {

  const [working, setWorking] = useState(true)
  const [complete, setcomplete] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("")
  const [toDos, setTodos] = useState({})
  const [newText, setNewText] = useState("")
  const [selectedTodoKey, setSelectedTodoKey] = useState(null);

  useEffect(() => {
    loadToDos();
    loadWorking();
  }, [])

  const travel = () => setWorking(false)
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload)
  const onEditText = (payload) => setNewText(payload)
  // 저장하기
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      console.error("saveError = ,", e.message);
    }
  }
  // 데이터 받기
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY)
      setTodos(s ? JSON.parse(s) : {});
    } catch (error) {
      console.log("loadError = ", error)

    }
  }
  // work, travel 저장하기
  const saveWorking = async () => {
    try {
      setWorking(true)
      await AsyncStorage.setItem(WORKING_KEY, JSON.stringify(true))
    } catch (e) {
      console.log("saveWorkingError = ", e.message)
    }
  }
  // work, travel 저장하기
  const saveWorking2 = async () => {
    try {
      setWorking(false)
      await AsyncStorage.setItem(WORKING_KEY, JSON.stringify(false))
    } catch (e) {
      console.log("saveWorkingError = ", e.message)
    }
  }

  // work, travel 데이터 받기
  const loadWorking = async () => {
    try {
      const s = await AsyncStorage.getItem(WORKING_KEY);
      if (s !== null) {
        const workingState = JSON.parse(s);
        setWorking(workingState);
      } else {
        console.log("WORKING_KEY not found in AsyncStorage");
      }
    } catch (e) {
      console.log("loadWorkingError = ", e.message);
    }
  }
  // 만들기
  const addToDo = async () => {
    if (text === "") {
      return
    }
    const newTodos = Object.assign({}, toDos, {
      [Date.now()]: { text, working, complete },
    })
    setTodos(newTodos)
    await saveToDos(newTodos)
    setText("")
  }
  // 수정하기
const editToDo = async (key) => {
  if (newText === "") {
    return;
  }
  const updatedTodo = {
    text: newText,
    working,
    complete,
  };
  const newTodos = { ...toDos, [key]: updatedTodo };
  setTodos(newTodos);
  await saveToDos(newTodos);
  setModalVisible(false);
  setNewText("");
};
  // 삭제하기
  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do?",
      "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Sure",
        style: "destructive",
        onPress: async () => {
          const newTodos = { ...toDos }
          delete newTodos[key]
          setTodos(newTodos)
          await saveToDos(newTodos)
        }
      }])
  }
  // 완료하기
  const completeToDo = (key) => {
    Alert.alert(
      "Complete To Do?",
      "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Sure",
        style: "destructive",
        onPress: async () => {
          const newTodos = { ...toDos }
          const temp = newTodos[key].complete
          newTodos[key].complete = !temp
          setTodos(newTodos)
          await saveToDos(newTodos)
        }
      }])
  }
  const openEditModal = (key) => {
    setSelectedTodoKey(key);
    setModalVisible(true);
  };

  console.log(toDos)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={saveWorking}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveWorking2}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        // keyboardType='number-pad'
        returnKeyType='done' // 리턴 버튼
        onSubmitEditing={addToDo} // 인풋 값 
        onChangeText={onChangeText} // 인풋값 상태 저장
        value={text}
        placeholder={working ? "Add a to do" : "Where do you want to go?"}
        style={styles.input}>
      </TextInput>
      <ScrollView>
        {Object.keys(toDos).map(key => (
          toDos[key].working === working ?
            <View style={styles.toDo} key={key}>
              {toDos[key].complete === true ? <Text style={styles.DonetoDoText}>
                {toDos[key].text}
              </Text> : <Text style={styles.toDoText}>
                {toDos[key].text}
              </Text>}
              <View style={styles.viewRow}>
                <Pressable
                  style={styles.button}
                  onPress={() => openEditModal(key)}>
                  <Fontisto name="eraser" size={24} color={theme.toDobg} />
                </Pressable>
                <TouchableOpacity onPress={() => completeToDo(key)}>
                  {toDos[key].complete === true ? <Fontisto name="checkbox-active" size={18} color="#006400" /> : <Fontisto name="checkbox-passive" size={18} color={theme.toDobg} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.toDobg} />
                </TouchableOpacity>
              </View>
            </View> : null))}


        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter the text you want to replace.</Text>
                <TextInput
                  style={styles.input}
                  onSubmitEditing={addToDo} // 인풋 값 
                  onChangeText={onEditText} // 인풋값 상태 저장
                  value={newText}
                  placeholder="Here">

                </TextInput>

                <View style={styles.viewRow}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>취소</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => editToDo(selectedTodoKey)}>
                    <Text style={styles.textStyle}>변경</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>

      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 40,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  DonetoDoText: {
    color: "#006400",
    textDecorationLine: "line-through",
    fontSize: 16,
    fontWeight: "500"
  },
  viewRow: {
    flexDirection: "row",
    gap: 18
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    // padding: 5,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

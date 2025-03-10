import React, { useState } from 'react'
import { View, SafeAreaView, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import Style from './components/Style'

export default function App(){
const [task,setTask] = useState("");
const [taskList, setTaskList] = useState([])

  const addTask = () => {
   setTaskList([...taskList, { item: task, id: Date.now().toString(), valid: true }]);
   setTask("");
  }

  const delTask = (id) => {
    setTaskList(taskList.filter((task) => task.id !== id));
  }

  const toggleValid = (id) => {
  setTaskList(
    taskList.map((task) =>
      task.id === id ? { ...task, valid: !task.valid } : task
    )
  )
};

  const Render = ({ item }) => {
    return(
      <View style={item.valid ? Style.normalOpacity : Style.lowOpacity}> 
        <Text>{item.item}</Text>
        <Button 
        title="Apagar Task"
        onPress={() => delTask(item.id)}
        />
      <TouchableOpacity onPress={() => toggleValid(item.id)}>
        <Text>
          {item.valid ? "Válido" : "Inválido"}
        </Text>
      </TouchableOpacity>
      </View>
    );
  }


  return(
    <SafeAreaView style={Style.main}>
      <Text>Insira a sua task:</Text>
      <TextInput
      style={Style.input}
      onChangeText={setTask}
      value={task}
      />
      <Button
      title="Criar task"
      onPress={addTask}
      />
      <FlatList 
      data={taskList}
      renderItem={Render}
      keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

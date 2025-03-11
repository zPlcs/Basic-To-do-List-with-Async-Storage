import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './components/Style'

export default function App(){
const [task,setTask] = useState("");
const [taskList, setTaskList] = useState([])
const [savedTaskList, setSavedTaskList] = useState([])

useEffect(() => {
	const carregarTasks = async () => {
		try {
			const savedData = await AsyncStorage.getItem('@tasks');
			if (savedData !== null) {
				const parsedData = JSON.parse(savedData);
				setTaskList(parsedData);
				setSavedTaskList(parsedData);
			}
		} catch (e) {
			console.error('Erro ao carregar tasks');
		}
	};

	carregarTasks();
}, []);

const addTask = async () => {
	try {
		const newTask = { item: task, id: Date.now().toString(), valid: true };
		const updatedTasks = [...taskList, newTask];

		// Salvando no AsyncStorage (JSON)
		await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));

		// Atualizando o estado da lista
		setTaskList(updatedTasks);
		setSavedTaskList(updatedTasks);
		setTask('');
	} catch (e) {
		console.error('Deu B.O');
	}
};

const delTask = async (id) => {
	try {
		const updatedTasks = taskList.filter((task) => task.id !== id);
		
		// Atualizar o AsyncStorage
		await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));

		// Atualizar o estado
		setTaskList(updatedTasks);
		setSavedTaskList(updatedTasks);
	} catch (e) {
		console.error('Erro ao apagar task');
	}
};


const toggleValid = async (id) => {
	try {
		const updatedTasks = taskList.map((task) =>
			task.id === id ? { ...task, valid: !task.valid } : task
		);

		// Atualizar no AsyncStorage
		await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));

		// Atualizar o estado
		setTaskList(updatedTasks);
		setSavedTaskList(updatedTasks);
	} catch (e) {
		console.error('Erro ao atualizar task');
	}
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
      data={savedTaskList}
      renderItem={Render}
      keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

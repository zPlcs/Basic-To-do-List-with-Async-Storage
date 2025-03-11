//Bloco inicial onde importamos todas as bibliotecas e componentes utilizados dela
import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from './components/Style'


export default function App(){
//Definimos todos os estados de maneira dinamica para renderização
const [task,setTask] = useState("");
const [taskList, setTaskList] = useState([])
const [savedTaskList, setSavedTaskList] = useState([])

//O useEffect carrega as tarefas salvas no armazenamento local assim que o app inicia.
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

//Função princípal de inclusão de task, criamos um objeto com as caracteristicas de nossa task
//Utilizamos de uma array onde juntamos a lista de task com a nova task criada
//Setamos e salvamos os dados nas arrays de estado préviamente ciradas
const addTask = async () => {
	try {
		const newTask = { item: task, id: Date.now().toString(), valid: true };
		const updatedTasks = [...taskList, newTask];
		await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
		setTaskList(updatedTasks);
		setSavedTaskList(updatedTasks);
		setTask('');
	} catch (e) {
		console.error('Deu B.O');
	}
};

//Função de deletar tasks, buscamos/filtramos as tasks por id e assim atualizamos as listas e o asyncStorage
const delTask = async (id) => {
	try {
		const updatedTasks = taskList.filter((task) => task.id !== id);
		await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
		setTaskList(updatedTasks);
		setSavedTaskList(updatedTasks);
	} catch (e) {
		console.error('Erro ao apagar task');
	}
};

//Função para definir se a task é ou não valida (concluida ou não), apartir de um mapeamento de busca pela array, e assim atualizando o estado de concluido ou não
const toggleValid = async (id) => {
	try {
		const updatedTasks = taskList.map((task) =>
			task.id === id ? { ...task, valid: !task.valid } : task
		);
		await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
		setTaskList(updatedTasks);
		setSavedTaskList(updatedTasks);
	} catch (e) {
		console.error('Erro ao atualizar task');
	}
};

//Função de renderização utilizando de todos os dados buscados acima
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

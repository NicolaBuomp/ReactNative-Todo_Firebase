import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, FlatList, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig'

export interface TODO {
    title: string,
    done: boolean,
    id: string
}

const List = ({ navigation }: any) => {
    const [todos, setTodos] = useState<TODO[]>([])
    const [todo, setTodo] = useState('')
    const [loading, setLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')

    const textInputRef = useRef<TextInput>(null);

    const openKeyboard = () => {
        // Se il riferimento al TextInput esiste, imposta il focus
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    };
    useEffect(() => {
        const todoRef = collection(FIREBASE_DB, 'todos')

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                const todos: TODO[] = []
                snapshot.docs.forEach(doc => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    } as TODO)
                })
                setTodos(todos)
            }
        })


        return () => subscriber()
    }, [])

    const renderTodo = ({ item }: any) => {
        const onPress = (item: any) => {
            setUpdate(true)
            setTodo(item.title)
            setSelectedItem(item.id)
            openKeyboard()
        }
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => onPress(item)}>
                <Text>
                    {item.title}
                </Text>
            </TouchableOpacity>)
    }


    const addTodo = async () => {
        setLoading(true)
        if (update && selectedItem) {
            let itemRef = doc(FIREBASE_DB, 'todos', selectedItem)
            await updateDoc(itemRef, { title: todo, done: false }).then(() => {
                setTodo('')
                Keyboard.dismiss()
                setLoading(false)
                setUpdate(false)
                Alert.alert('Prova')
            })
        } else {
            await addDoc(collection(FIREBASE_DB, 'todos'), { title: todo, done: false }).then(() => {
                setTodo('')
                setLoading(false)
                Keyboard.dismiss()
            })


        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput ref={textInputRef} style={styles.input} placeholder='Aggiungi un promemoria' value={todo} onChangeText={(text: string) => setTodo(text)} />
                {loading ? <ActivityIndicator /> : <Button onPress={addTodo} title={update ? 'Aggiorna' : 'Aggiungi'} disabled={todo === ''} />}
            </View>
            {todos.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo: TODO) => todo.id}
                />
            }
        </View>
    )
}

export default List

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 5
    },
    form: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#cccccc',
        backgroundColor: '#ccccc1'
    },
    list: {
        marginTop: 10
    },
    listItem: {
        paddingHorizontal: 7,
        paddingVertical: 15,
        marginVertical: 5,
        marginHorizontal: 2,
        borderRadius: 4,
        backgroundColor: '#e3e3e3'
    },
    itemText: {}
});
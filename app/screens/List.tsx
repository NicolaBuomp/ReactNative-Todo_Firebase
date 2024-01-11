import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LoadingContext } from '../../context/LoadingContext';
import { formatMomentData } from '../../util/functions';
import { DB } from '../../firebaseConfig';
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from '@firebase/firestore';
import { Button, TextInput } from 'react-native-paper'

export interface TODO {
    title: string,
    done: boolean,
    id: string,
    date: any
}

const List = ({ navigation }: any) => {
    const [todos, setTodos] = useState<any[]>([])
    const [selectedItem, setSelectedItem] = useState('')
    const loadingCtx = useContext(LoadingContext)

    useEffect(() => {
        loadingCtx.enableLoading()
        try {
            const unsubscribe = onSnapshot(collection(DB, 'todos'), (snapshot) => {
                const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTodos(newPosts);
            });

            return () => {
                unsubscribe();
            };
        } catch (error) {

        } finally {
            loadingCtx.disableLoading()
        }


    }, []);

    const deleteTodo = async (id: string) => {
        loadingCtx.enableLoading()
        await deleteDoc(doc(DB, 'todos', id));
        loadingCtx.disableLoading()
    };

    const toggleDoneTodo = async (item: any) => {
        item.done = !item.done
        await updateDoc(doc(DB, 'todos', item.id), item);
    };

    const renderTodo = ({ item }: any) => {
        return (
            <View style={styles.listItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Pressable onPress={() => toggleDoneTodo(item)}>
                        {item.done ? <MaterialIcons name="done" size={30} color="#38b338" /> : <Entypo name="circle" size={30} color="black" />}
                    </Pressable>
                    <View>
                        <Text style={{ fontSize: 18 }}>
                            {item.title}
                        </Text>
                        {item.endDate &&
                            formatMomentData(item)
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Pressable onPress={() => setSelectedItem(item)}><MaterialIcons name="edit" size={30} color="#4848ce" /></Pressable>
                    <Pressable onPress={() => deleteTodo(item.id)}><MaterialCommunityIcons name="delete-outline" size={30} color="#e43a3a" /></Pressable>
                </View>
            </View>)
    }

    return (
        <View style={styles.container}>
            {todos.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo: TODO) => todo.id}
                />
            }
            <View style={{ marginBottom: 25 }}>
                <Button mode='contained' onPress={() => navigation.navigate('CreateToto')}>Aggiungi Promemoria</Button>
            </View>
        </View>
    )
}

export default List

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        justifyContent: 'center',
    },

    list: {
        marginVertical: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 7,
        paddingVertical: 15,
        marginVertical: 5,
        marginHorizontal: 2,
        borderRadius: 4,
        backgroundColor: '#e3e3e3'
    },
    itemText: {},
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
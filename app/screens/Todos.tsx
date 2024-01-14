import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LoadingContext } from '../../context/LoadingContext';
import { formatMomentData } from '../../util/functions';
import { AUTH, DB } from '../../firebaseConfig';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from '@firebase/firestore';
import { Button, Divider, IconButton } from 'react-native-paper'
import { useTheme } from '../../context/ThemeContext';
import { TODO } from '../interfaces/Todo';
import ModalConfirm from '../components/ModalConfirm';
import { AuthContext } from '../../context/AuthContext';

const Todos = ({ navigation }: any) => {
    const [todos, setTodos] = useState<TODO[]>([])
    const [modalDelete, setModalDelete] = useState(false)
    const [selectedItem, setSelectedItem] = useState<TODO>()

    const loadingCtx = useContext(LoadingContext)
    const user = useContext(AuthContext)
    const { theme } = useTheme()

    useEffect(() => {
        loadingCtx.enableLoading()
        const userId = AUTH.currentUser?.uid;
        try {
            if (userId) {
                const todosCollection = collection(DB, 'todos')
                const userQueryTodo = query(todosCollection, where('userId', '==', userId))
                const unsubscribe = onSnapshot(userQueryTodo, (snapshot) => {
                    const data = snapshot.docs.map((doc): any => ({ id: doc.id, ...doc.data() }));
                    setTodos(data);
                });

                return () => {
                    unsubscribe();
                };
            }
        } catch (error) {

        } finally {
            loadingCtx.disableLoading()
        }
    }, []);

    const deleteTodo = async (id: string) => {
        loadingCtx.enableLoading()
        setModalDelete(false)
        await deleteDoc(doc(DB, 'todos', id)).then(() => {

        }).catch(() => {

        }).finally(() => loadingCtx.disableLoading());

    };

    const toggleDoneTodo = async (item: any) => {
        item.done = !item.done
        await updateDoc(doc(DB, 'todos', item.id), item);
    };

    const prepareUpdateTodo = (item: TODO) => {
        navigation.navigate('formTodo', { item: item })
    }

    function openModalConfirm(item: TODO) {
        setSelectedItem(item)
        setModalDelete(true)
    }



    const renderTodo = ({ item }: any) => {
        return (
            <>
                <View style={{ ...styles.listItem }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Pressable onPress={() => toggleDoneTodo(item)}>
                            {item.done ? <MaterialIcons name="done" size={30} color="#38b338" /> : <Entypo name="circle" size={30} color="black" />}
                        </Pressable>
                        <View>
                            <Text style={{ fontSize: 18, color: theme.colors.onBackground }}>
                                {item.title}
                            </Text>
                            {item.endDate &&
                                formatMomentData(item, theme.colors.onBackground)
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Pressable onPress={() => prepareUpdateTodo(item)}><MaterialIcons name="edit" size={30} color="#4848ce" /></Pressable>
                        <Pressable onPress={() => openModalConfirm(item)}><MaterialCommunityIcons name="delete-outline" size={30} color="#e43a3a" /></Pressable>
                    </View>
                </View>
                <Divider />
            </>
        )
    }

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            {todos.length > 0 &&
                <FlatList
                    style={styles.list}
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(todo: TODO) => todo.id}
                />
            }
            {
                !todos.length && <View style={{ alignItems: 'center', marginTop: 50 }}><Text style={{ color: theme.colors.onBackground, fontSize: 20 }}>Non ci sono promemoria da mostrare</Text></View>
            }
            <View style={{ marginBottom: Platform.OS === 'ios' ? 50 : 20, alignItems: 'center' }}>
                {/* <Button mode='contained' onPress={() => navigation.navigate('formTodo')}>Aggiungi Promemoria</Button> */}
                <IconButton icon={'plus'}
                    onPress={() => navigation.navigate('formTodo')}
                    mode='contained'
                    size={55}
                    animated />
            </View>
            <ModalConfirm visible={modalDelete} onDismiss={() => setModalDelete(false)} onConfirmDelete={() => deleteTodo(selectedItem!.id)} text={`Sicuro di voler eliminare questo promemoria ?`} />
        </View>
    )
}

export default Todos

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
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
    },
    itemText: {},
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../../firebaseConfig";
import { useContext } from "react";
import { LoadingContext } from "../../context/LoadingContext";
import { TODO } from "../interfaces/Todo";

export function FirebaseService() {
  const loading = useContext(LoadingContext);

  const getData = async (
    collectionName: string,
    userId?: string
  ): Promise<TODO[]> => {
    loading.enableLoading();
    const baseCollectionRef = collection(db, collectionName);
    let finalRef;

    if (userId) {
      const filteredQuery = query(
        baseCollectionRef,
        where("userId", "==", userId)
      );
      finalRef = filteredQuery;
    } else {
      finalRef = baseCollectionRef;
    }

    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        finalRef
      );
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TODO)
      );
      return data;
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
      return [];
    } finally {
      loading.disableLoading();
    }
  };

  const postData = async (collectionName: string, data: any): Promise<void> => {
    loading.enableLoading();
    const collectionRef = collection(db, collectionName);

    try {
      await addDoc(collectionRef, data);
    } catch (error) {
      console.error("Errore durante l'aggiunta dei dati:", error);
      console.log(data);
    } finally {
      loading.disableLoading();
    }
  };

  const putData = async (
    collectionName: string,
    id: string,
    data: any
  ): Promise<void> => {
    loading.enableLoading();
    const docRef = doc(db, collectionName, id);

    try {
      await setDoc(docRef, data);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati:", error);
    } finally {
      loading.disableLoading();
    }
  };

  const deleteData = async (
    collectionName: string,
    id: string
  ): Promise<void> => {
    loading.enableLoading();
    const docRef = doc(db, collectionName, id);

    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Errore durante l'eliminazione dei dati:", error);
    } finally {
      loading.disableLoading();
    }
  };

  const subscribeData = (
    collectionName: string,
    callback: (data: TODO[]) => void,
    userId?: string
  ) => {
    const baseCollectionRef = collection(db, collectionName);
    let finalRef;

    if (userId) {
      const filteredQuery = query(
        baseCollectionRef,
        where("userId", "==", userId)
      );
      finalRef = filteredQuery;
    } else {
      finalRef = baseCollectionRef;
    }

    const unsubscribe = onSnapshot(finalRef, (querySnapshot) => {
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as TODO)
      );
      callback(data);
    });

    return () => unsubscribe();
  };

  return {
    getData,
    postData,
    putData,
    deleteData,
    subscribeData,
    // Aggiungi eventuali altre funzioni necessarie
  };
}

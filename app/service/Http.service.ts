import { useContext } from "react";
import { LoadingContext } from "../../context/LoadingContext";
import axios, { AxiosResponse } from "axios";
import { Alert } from "react-native";

export function HttpService() {
    const loadingCtx = useContext(LoadingContext);
    const URL: string = 'http://192.168.0.129:3000';

    const GET = (collection: string): Promise<any> => {
        return axios.get(`${URL}/${collection}`)
            .then(response => {
                console.log(response);
                response.data
            })
            .catch(error => {
                Alert.alert(`Errore durante la richiesta al server: ${error}`);
                console.error('Errore durante la richiesta al server:', error);
                throw error; // Rilancia l'errore per gestirlo in modo appropriato nel chiamante
            })
            .finally(() => loadingCtx.disableLoading());
    };

    const CREATE = (collection: string, data: any): Promise<AxiosResponse<any>> => {
        return axios.post(`${URL}/${collection}`, data)
            .catch(error => {
                Alert.alert(`Errore durante la richiesta al server: ${error}`);
                console.error('Errore durante la richiesta al server:', error);
                throw error;
            })
            .finally(() => loadingCtx.disableLoading());
    };

    const UPDATE = (collection: string, id: string, data: any): Promise<AxiosResponse<any>> => {
        return axios.put(`${URL}/${collection}/${id}`, data)
            .catch(error => {
                Alert.alert(`Errore durante la richiesta al server: ${error}`);
                console.error('Errore durante la richiesta al server:', error);
                throw error;
            })
            .finally(() => loadingCtx.disableLoading());
    };

    const DELETE = (url: string, id: any): Promise<AxiosResponse<any>> => {
        return axios.delete(`${URL}/${url}/${id}`)
            .then(response => {
                // Puoi gestire la risposta o restituirla al chiamante
                console.log('Risposta dalla cancellazione:', response.data);
                return response;
            })
            .catch(error => {
                if (error.response) {
                    // La richiesta è stata fatta e il server ha risposto con uno status diverso da 2xx
                    console.error('Errore nella risposta del server:', error.response.data);
                    console.error('Status Code:', error.response.status);
                } else if (error.request) {
                    // La richiesta è stata fatta ma non è stata ricevuta una risposta
                    console.error('Errore nella richiesta al server, nessuna risposta ricevuta:', error.request);
                } else {
                    // Qualcos'altro ha causato l'errore
                    console.error('Errore sconosciuto:', error.message);
                }
                Alert.alert(`Errore durante la richiesta al server: ${error.message}`);
                throw error;
            })
            .finally(() => loadingCtx.disableLoading());
    };

    return { GET, CREATE, UPDATE, DELETE };
}

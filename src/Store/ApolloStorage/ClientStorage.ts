import {action, computed, makeAutoObservable, makeObservable, observable} from "mobx";
import {setContext} from "@apollo/client/link/context";
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "apollo-link-error";
import User from "../UserStore/UserStore"
class Client{
    token = localStorage.getItem('token'); //Токен авторизации, самая важная вешь в проекте!
    // При запуски он достается из локального хранилища

    changeToken(token){ //Функция для того, чтобы при логировании можно было записать новый токен
        this.token = token
        localStorage.setItem('token', token)
        // console.log("CHANGE TOKEN")
    }

    constructor() {
        makeObservable(this, {
            token: observable,
            changeToken: action,
            AutoUpdatedApolloClient: computed({name: "UPDATE CLIENT"})
        })
    }
    get AutoUpdatedApolloClient(){ //Если токен обновился, то эта вычисляемая функция обновляется и
        //предоставляет всем элементам системы новый @client, например если пользователь залогинится,
        //все последующие запросы и мутации будут происходить от его лица(в частности запрос на
        // получение данных о пользователе), так же это позволит в будущем добавлять другие заголоки
        //для запросов, если это понадобится
        const authLink: any = setContext((_, { headers }) => {
            // процесс создания авторизационного заголовка
            return {
                headers: {
                    ...headers,
                    authorization: 'JWT '+ this.token,
                }
            }
        });
        //Ссылка на бэкенд
        const httpLink = new HttpLink({
            uri: 'https://iot-experemental.herokuapp.com/graphql/'
            // Additional options
        });
        const errorLink: any = onError(({ graphQLErrors }) => {
            if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
        })
        //Конечная сборка @client
        const client = new ApolloClient({
            link: ApolloLink.from([errorLink, authLink, httpLink]),
            cache: new InMemoryCache()
        });
        console.log("new client")
        //Новый клиент собран и расшеривается между всеми, кто его использует
        return(client)
    }

}

export default new Client
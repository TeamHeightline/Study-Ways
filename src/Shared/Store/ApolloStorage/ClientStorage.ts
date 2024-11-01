import {action, autorun, makeObservable, observable} from "mobx";
import {setContext} from "@apollo/client/link/context";
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject} from "@apollo/client";

import {onError} from "apollo-link-error";
import {SERVER_BASE_URL} from "../../../settings";

class Client {
    //Токен авторизации, самая важная вещь в проекте!
    //При запуске Auth0 проверяет залогинен ли пользователь,
    //если да, ставит токен, если нет - ''
    token = ''

    //Клиент аполло, обновляется автоматически
    client: ApolloClient<NormalizedCacheObject> = this.UpdatedApolloClient()

    //Функция для того, чтобы при логировании можно было записать новый токен
    changeToken(token) {
        this.token = token
        this.UpdatedApolloClient()
        // console.log("CHANGE TOKEN")
    }

    constructor() {
        makeObservable(this, {
            token: observable,
            client: observable,
            changeToken: action,
            UpdatedApolloClient: action,
        })
        autorun(() => this.UpdatedApolloClient())
    }


    //Если токен обновился, то эта вычисляемая функция обновляется и
    //предоставляет всем элементам системы новый @client, например если пользователь залогинится,
    //все последующие запросы и мутации будут происходить от его лица(в частности запрос на
    // получение данных о пользователе), так же это позволит в будущем добавлять другие заголоки
    //для запросов, если это понадобится


    UpdatedApolloClient() {
        const authLink: any = setContext((_, {headers}) => {
            // процесс создания авторизационного заголовка
            if (this.token !== "") {
                return {
                    headers: {
                        ...headers,
                        authorization: 'Bearer ' + this.token,
                    }
                }
            } else {
                return {
                    headers: {
                        ...headers
                    }
                }
            }
        });
        //Ссылка на бэкенд
        const httpLink = new HttpLink({
            uri: SERVER_BASE_URL + '/graphql/',

            // Additional options
        });
        const errorLink: any = onError(({graphQLErrors, networkError}) => {
            if (graphQLErrors) graphQLErrors.map(({message}) => console.log(message))
            if (networkError) console.log(networkError)
        })
        const cache = new InMemoryCache();
        //Конечная сборка @client
        const client = new ApolloClient({
            link: ApolloLink.from([errorLink, authLink, httpLink]),
            cache: cache,
            defaultOptions: {
                mutate: {errorPolicy: 'ignore'},

            },

        });
        //Новый клиент собран и расшеривается между всеми, кто его использует
        this.client = client
        return (client)
    }

}

export const ClientStorage = new Client()

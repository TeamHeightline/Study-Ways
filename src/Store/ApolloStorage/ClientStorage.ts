import {makeAutoObservable} from "mobx";
import {setContext} from "@apollo/client/link/context";
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "apollo-link-error";

class Client{
    token = localStorage.getItem('token');
    changeToken(token){
        this.token = token
        localStorage.setItem('token', token)
        // console.log("CHANGE TOKEN")
    }

    constructor() {
        makeAutoObservable(this)
    }
    get AutoUpdatedApolloClient(){
        const authLink: any = setContext((_, { headers }) => {
            const token = this.token
            // return the headers to the context so httpLink can read them
            return {
                headers: {
                    ...headers,
                    authorization: 'JWT '+ token,
                }
            }
        });
        // console.log(User.token ? User.token : localStorage.getItem('token'))
        const httpLink = new HttpLink({
            uri: 'https://iot-experemental.herokuapp.com/graphql/'
            // Additional options
        });
        const errorLink: any = onError(({ graphQLErrors }) => {
            if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
        })

        const client = new ApolloClient({
            link: ApolloLink.from([errorLink, authLink, httpLink]),
            cache: new InMemoryCache()
        });
        // console.log(this.token)
        // console.log("CHANGE CLIENT")
        return(client)
    }

}

export default new Client
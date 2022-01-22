import {makeAutoObservable, toJS} from "mobx";
import {ClientStorage} from "../../../../Store/ApolloStorage/ClientStorage";
import {Query} from "../../../../SchemaTypes";
import {GET_SELF_STATISTIC_ID} from "./query";
import { UserStorage } from "../../../../Store/UserStore/UserStore";

class SimpleSelfStatisticStorage{
    constructor() {
        makeAutoObservable(this)
    }
    clientStorage = ClientStorage
    userStorage = UserStorage
    loadSelfStatistic(){
        if (this.userStorage.isLogin){
            try{
                this.clientStorage.client.query<Query>({query: GET_SELF_STATISTIC_ID, variables:{
                    page: this.activePage
                }})
                    .then((response) =>response.data.selfStatisticIdArray)
                    .then((self_statistic) => {
                        if(self_statistic && self_statistic.IDs){
                            this.maxPages = Number(self_statistic.numPages)
                            this.activePage = Number(self_statistic.activePage)
                            this.statistic_id_array = self_statistic.IDs.map((id) => Number(id))
                        }
                    })

                }catch(e){
                    console.log(e)
            }
        }
    }
    maxPages = 1
    activePage = 1
    statistic_id_array: number[] = []

    get statisticIDForShow(){
        return(toJS(this.statistic_id_array))
    }
}

export const SSSSObject = new SimpleSelfStatisticStorage()
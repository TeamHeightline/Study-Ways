import {action, autorun, computed, makeObservable, observable, toJS} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_ALL_CARDS, GET_THEMES} from "./Struct";
import {GlobalCardThemeNode, Maybe, Query} from "../../../../SchemaTypes";
import {TreeSelect} from "antd";
import _ from "lodash";
const { SHOW_CHILD } = TreeSelect;

class CardPage{
    constructor() {
        makeObservable(this, {
            clientStorage: observable ,
            cardsData: observable,
            dataHasBeenGot: observable,
            selectedCardID: observable,
            isOpenCard: observable,
            cardsDataAfterSelectTheme: computed,
            cardsDataAfterSelectContentType: computed,
            cardsDataAfterSelectAuthor: computed,
            selectedThemes: observable,
            dataForCardSubThemeSelect: observable,
            getCardsDataFromServer: action,
            getDataForCardSubThemeSelectFromServer: action,
            cardSelectedThemeID: observable,
            tProps: computed,
            selectedContentType: observable,
            selectedAuthor: observable,
            authorsArray: computed,
        })
        autorun(() => this.getCardsDataFromServer())
    }

    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //Массив данных о всех карточках, получаемый с сервера
    cardsData = []

    //Флаг, проверяющий, были ли получены данные с сервера
    dataHasBeenGot = false

    //ID выбранной карточки, нужно для выкачивания данных с сервера по этой карточки
    selectedCardID = 0

    //Открыта ли в данный момент конкретная карточка, или мы находимся в меню карточек
    isOpenCard = false


    //-----------------------для селектора тем------------------------
    selectedThemes: any = []

    //Массив всех данных о глобальных темах, темах и под темах
    dataForCardSubThemeSelect: any = []

    getDataForCardSubThemeSelectFromServer(){
        this.clientStorage.client.query({query: GET_THEMES})
            .then((themesData: any) =>{
                //сбор массива ID подтем
                const cardsThemesIDArray: any = []
                this.cardsData.map((sameCard: any) =>{
                    sameCard.subTheme.map((sameSubTheme) =>{
                        if(cardsThemesIDArray.indexOf(sameSubTheme.id) == -1){
                            cardsThemesIDArray.push(sameSubTheme.id)
                        }
                    })
                })
                //Алгоритм -  сначала мы собираем массив айдишников нужных тем, затем в цикле проверяем,
                // совпадают ли эти айдишники с айди подтем, если да, то пушим в общй массив и разрешаем нашей
                //теме тоже пушится, это разрешает глобальной теме пушится, в результате у нас пушатся только нужные
                //подтемы, темы и глобальные темы

                const data: any = []
                themesData.data.cardGlobalTheme.map((GlobalTheme:  Maybe<GlobalCardThemeNode>) =>{
                    const ThisGlobalTheme: any = {}
                    ThisGlobalTheme.title = GlobalTheme?.name
                    ThisGlobalTheme.id = GlobalTheme?.id
                    ThisGlobalTheme.value = GlobalTheme?.id
                    ThisGlobalTheme.isLead = false
                    ThisGlobalTheme.pid = 0
                    let validGlobalThemeCounter = 0
                    GlobalTheme?.cardthemeSet.map((Theme) =>{
                        const ThisTheme: any = {}
                        ThisTheme.title = Theme?.name
                        ThisTheme.id = Number(Theme?.id) * 1000
                        ThisTheme.value = Number(Theme?.id) * 1000
                        ThisTheme.pId = ThisGlobalTheme?.id
                        ThisGlobalTheme.isLead = false
                        let validSubThemeCounter = 0
                        Theme.cardsubthemeSet.map((SubTheme) =>{
                            if(cardsThemesIDArray.indexOf(SubTheme.id) !== -1){
                                validSubThemeCounter += 1
                                const ThisSubTheme: any = {}
                                ThisSubTheme.title = SubTheme?.name
                                ThisSubTheme.id = Number(SubTheme?.id) * 1000000
                                ThisSubTheme.value = Number(SubTheme?.id) * 1000000
                                ThisSubTheme.pId = Number(Theme?.id) * 1000
                                ThisGlobalTheme.isLead = true
                                data.push(ThisSubTheme)
                            }
                        })
                        if(validSubThemeCounter !== 0){
                            data.push(ThisTheme)
                            validGlobalThemeCounter += 1
                        }
                    })
                    if(validGlobalThemeCounter !== 0){
                        data.push(ThisGlobalTheme)
                    }
                })
                this.dataForCardSubThemeSelect = data
            })
    }

    cardSelectedThemeID: any = []
    get tProps(){
        return(
            {
                treeDataSimpleMode: true,
                treeData: toJS(CardPageStorage.dataForCardSubThemeSelect),
                value: this.cardSelectedThemeID,
                onChange: (data) => {
                    CardPageStorage.selectedThemes = data
                    this.cardSelectedThemeID = data
                },
                treeCheckable: true,
                showCheckedStrategy: SHOW_CHILD,
                placeholder: 'Выбирите тему карточки',
                style: {
                    width: '100%',
                },
            }
        )
    }

    //Массив данных о карточках после фильтрации по темам
    get cardsDataAfterSelectTheme(){
        if(this.selectedThemes.length === 0){
            return (this.cardsData)
        }
        const selectedCardsArray: any = []
        toJS(this.cardsData).map((sameCard: any) =>{
            sameCard.subTheme.map((sameThemeInSameCard: any)=>{
                if(this.selectedThemes.indexOf(Number(sameThemeInSameCard?.id) * 1000000) !== -1){
                    if(selectedCardsArray.indexOf(sameCard) === -1){
                        selectedCardsArray.push(sameCard)
                    }
                }
            })
        })
        return(selectedCardsArray)
    }
    //----------------------для селектора типа контента-------------------
    selectedContentType = 1000000
    changeContentType(type){
        this.selectedContentType = type
    }
    //Массив данных о карточках после фильтрации по типу контента
    get cardsDataAfterSelectContentType(){
        if (Number(this.selectedContentType) != 1000000) {
            return(_.filter(this.cardsDataAfterSelectTheme, {'cardContentType': "A_" + this.selectedContentType}))
        } else {
            return(this.cardsDataAfterSelectTheme)
        }
    }
    //--------------------селектор автора--------------------------------
    //Выбранный автор, по умолчанию "не выбран"
    selectedAuthor = 1000000

    changeSelectedAuthor(newAuthorID){
        this.selectedAuthor = newAuthorID
    }

    get authorsArray(){
        const ConstAuthorsArray: any = []
        toJS(this.cardsDataAfterSelectContentType).map((sameCard) =>{
            sameCard.author.map((interatedAuthorInSameCard) =>{
                //Проверяем, содержится ли автор в общем массиве, невозможно сделать через indexOf,
                //потому что mobX меняет объекты
                let authorExistInArray = false
                ConstAuthorsArray.map((author) =>{
                    if(author.id === interatedAuthorInSameCard.id){
                        authorExistInArray = true
                    }
                })
                if(!authorExistInArray){
                    ConstAuthorsArray.push(interatedAuthorInSameCard)
                }
            })
        })
        return(ConstAuthorsArray)
    }

    //Массив данных о карточках после фильтрации по авторам
    get cardsDataAfterSelectAuthor(){
        if(Number(this.selectedAuthor) === 1000000){
            return(toJS(this.cardsDataAfterSelectContentType))
        }else{
            return (_.filter(toJS(this.cardsDataAfterSelectContentType), ((card) =>{
                return (_.find(card.author, (item) => {
                    return(item.id == this.selectedAuthor)
                }))
            })))
        }
    }

    //--------------------------------------------------------------


    //action для получения данных о всех карточках с сервера
    getCardsDataFromServer(){
        this.clientStorage.client.query({query: GET_ALL_CARDS})
            .then((data) => {
                //Передаем все полученные данный в cardsData
                this.cardsData = data?.data?.card
                //Устанавливаем флаг о том, что все данные получены
                this.dataHasBeenGot = true
                this.getDataForCardSubThemeSelectFromServer()
            })
    }

}
export const  CardPageStorage =  new CardPage()
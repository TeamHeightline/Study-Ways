import {makeAutoObservable, reaction, toJS} from "mobx";
import {ClientStorage} from "../../ApolloStorage/ClientStorage";
import {GET_ALL_CARDS, GET_CARDS_ID_BY_SEARCH_STRING, GET_THEMES} from "./Struct";
import {CardHardLevel, CardNode, GlobalCardThemeNode, Maybe} from "../../../SchemaTypes";
import TreeSelect from "antd/es/tree-select";
import {filter, find} from "lodash";
import {sort} from "fast-sort";
const { SHOW_CHILD } = TreeSelect;
type HardLevelWithUndefined = CardHardLevel | "undefined"

class CardPage{
    constructor() {
        makeAutoObservable(this)
        reaction(()=> this.searchString, ()=> this.startQueryTimer())
    }

    //Получаем прямой доступ и подписку на изменение в хранилище @client для Apollo (для Query и Mutation)
    clientStorage = ClientStorage

    //Массив данных о всех карточках, получаемый с сервера
    rawCardsDataWitchoutFiltering = []

    //Флаг, проверяющий, были ли получены данные с сервера
    dataHasBeenGot = false

    //ID выбранной карточки, нужно для выкачивания данных с сервера по этой карточки
    selectedCardID = 0

    //Открыта ли в данный момент конкретная карточка, или мы находимся в меню карточек
    isOpenCard = false

    //Для умного поиска -------------------------------------------
    searchString = ''

    async changeSearchString(newString){
        this.searchString = newString
    }

    lastQueryAsyncControlIndex = 0

    async loadCardsIDBySearchString(){
        if(toJS(this.searchString).length !==0){
            this.lastQueryAsyncControlIndex += 1
            const thisQueryIndex = this.lastQueryAsyncControlIndex
            this.clientStorage.client.query({query: GET_CARDS_ID_BY_SEARCH_STRING,
                variables: {searchString: toJS(this.searchString)}})
                .then(response =>{
                    if(thisQueryIndex === toJS(this.lastQueryAsyncControlIndex)){
                        this.cardsIDAfterSearch = response?.data?.ftSearchInCards
                    }})
        }
    }
    sendSearchQueryTimer: any = null

    async startQueryTimer(){
        clearTimeout(this.sendSearchQueryTimer)
        this.sendSearchQueryTimer = setTimeout(() =>{this.loadCardsIDBySearchString()}, 2500)
    }

    cardsIDAfterSearch: CardNode[] | [] = []

    get cardsDataAfterCleverSearch(){
        if(!toJS(this.searchString).length || !toJS(this.cardsIDAfterSearch).length){
            return(toJS(this.rawCardsDataWitchoutFiltering))
        }else{
            this.activeCardMicroViewPage = 1
            return(toJS(this.cardsIDAfterSearch))
        }
    }


    //--------------------------------------------------------------

    //-----------------------для селектора тем------------------------
    selectedThemes: any = []

    //Массив всех данных о глобальных темах, темах и под темах
    dataForCardSubThemeSelect: any = []

    getDataForCardSubThemeSelectFromServer(){
        this.clientStorage.client.query({query: GET_THEMES})
            .then((themesData: any) =>{
                //сбор массива ID подтем
                const cardsThemesIDArray: any = []
                this.rawCardsDataWitchoutFiltering.map((sameCard: any) =>{
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
                this.dataForCardSubThemeSelect = sort(data).asc([
                    (anyTheme: any) => anyTheme.title.replace(/\D/g,'').length != 0? Number(anyTheme.title.replace(/[^\d]/g, '')) : 10000000,
                    (anyTheme: any) => anyTheme.title
                ])
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
                placeholder: 'Выберете тему карточки',
                style: {
                    width: '100%',
                },
            }
        )
    }

    //Массив данных о карточках после фильтрации по темам
    get cardsDataAfterSelectTheme(){
        if(this.selectedThemes.length === 0){
            return (this.cardsDataAfterCleverSearch)
        }
        const selectedCardsArray: any = []
        toJS(this.cardsDataAfterCleverSearch).map((sameCard: any) =>{
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

    selectedHardLevel: HardLevelWithUndefined = "undefined"
    setSelectedHardLevel(newLevel: any){
        this.selectedHardLevel = newLevel
    }
    get cardsDataAfterSelectHardLevel() {
        if (this.selectedHardLevel === "undefined") {
            return (this.cardsDataAfterSelectTheme)
        } else{
            console.log(this.selectedHardLevel)
            return(this.cardsDataAfterSelectTheme
                .filter((theme) => theme.hardLevel == this.selectedHardLevel))
        }
    }
    //----------------------для селектора типа контента-------------------
    selectedContentType = 1000000
    changeContentType(type){
        this.selectedContentType = type
    }
    //Массив данных о карточках после фильтрации по типу контента
    get cardsDataAfterSelectContentType(){
        if (Number(this.selectedContentType) != 1000000) {
            return(filter(this.cardsDataAfterSelectHardLevel, {'cardContentType': "A_" + this.selectedContentType}))
        } else {
            return(this.cardsDataAfterSelectHardLevel)
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
            return (filter(toJS(this.cardsDataAfterSelectContentType), ((card) =>{
                return (find(card.author, (item) => {
                    return(item.id == this.selectedAuthor)
                }))
            })))
        }
    }

    get CardsAfterFiltering(){
        return(this.cardsDataAfterSelectAuthor?.filter(card => card.title != "Название карточки по умолчанию"))
    }



    get cardsDataForRender(){
        return(this.CardsAfterFiltering.slice((this.activeCardMicroViewPage-1) * this.numberOfCardsOnPage,
            this.activeCardMicroViewPage * this.numberOfCardsOnPage))
    }

    numberOfCardsOnPage = 100

    //Страница на которой пользователь находится
    activeCardMicroViewPage = 1

    get pageNumber(){
        return(this.activeCardMicroViewPage)
    }

    changeActiveCardMicroViewPage(newPageIndex: number){
        this.activeCardMicroViewPage = newPageIndex
    }
    get numberOfPages(){
        return(Math.ceil(toJS(this.CardsAfterFiltering).length / this.numberOfCardsOnPage))

    }

    //--------------------------------------------------------------

    dataHasBeenUpdated: boolean = false
    //action для получения данных о всех карточках с сервера
    getCardsDataFromServer(useCache = true){
        this.clientStorage.client.query({query: GET_ALL_CARDS, fetchPolicy: useCache? "cache-first": "network-only"})
            .then((data) => {
                //Передаем все полученные данный в cardsData
                this.rawCardsDataWitchoutFiltering = data?.data?.card
                console.log(useCache)
                this.dataHasBeenUpdated = !useCache

                //Устанавливаем флаг о том, что все данные получены
                this.dataHasBeenGot = true
                this.getDataForCardSubThemeSelectFromServer()

                if(useCache){
                    this.getCardsDataFromServer(useCache=false)
                }
            })
    }

}
export const  CardPageStorage =  new CardPage()
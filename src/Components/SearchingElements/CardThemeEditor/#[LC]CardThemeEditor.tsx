import React, {useEffect, useState} from 'react'
import {
    ALL_CARD_THEMES,
    UPDATE_CARD_SUB_THEME,
    GET_MY_SUB_THEMES,
    GET_MY_THEMES,
    GET_MY_GLOBAL_THEMES,
    UPDATE_CARD_GLOBAL_THEME,
    UPDATE_CARD_THEMES
} from './Structs'
import {useMutation, useQuery} from "@apollo/client";
import {Mutation, Query, UserNode} from "../../../../SchemaTypes";
import DCCardThemeEditor from "./##[DC]CardThemeEditor";
import {string} from "prop-types";
export default function LCCardThemeEditor(){
    const [expanded, setExpanded] = useState<string[]>([])//Это массив в котором все IDs тем подтем
    // и глобальных тем, которые нужно отобразить
    const [selected_id, set_selected_id] = useState<string>('') //Это значение будет "испорчено"
    //корректором ID для дерева, по этому нужно завести отдельно "чистые" выбранные ID
    const [selected_sub_theme_ID, set_selected_sub_theme_ID] = useState('')
    const [selected_theme_ID, set_selected_theme_ID] = useState<string| any>('')
    const [selected_global_theme_ID, set_selected_global_theme_ID] = useState('')

    const [isCreatingNowCardTheme, setIsCreatingNowCardTheme] = useState(false) //Режим создания новой темы
    const [isEditNowCardTheme, setIsEditNowCardTheme] = useState(false) //Режим редактирования темы
    const [canBeEdited, setCanBeEdited] = useState(false)//Может ли юзер редактировать тему (прописан он в created_by или нет)
    const [canAddSubItem, setCanAddSubItem] = useState(false)//Может ли юзер добавить подсущность (для темы - подтему, для глобальной темы- просто тему)
    const [all_sub_themes, set_all_sub_themes] = useState<{id: string , name: string}[] | undefined>() //Чистый массив подтем, нужен для поиска в нем
    const [all_themes, set_all_themes] = useState<{id: string, name: string}[]>() //Чистый массив тем, нужен для поиска в нем
    const [all_global_themes, set_all_global_themes] = useState<{id: string | undefined, name: string | undefined}[]>() //Чистый массив глобальных тем, нужен для поиска в нем
    const [activeEditData, setActiveEditData] = useState<string | any>('') //Текстовое поле для редактирования
    // темы/подтемы/глобальной темы
    const {data: my_sub_theme_data} = useQuery<Query, null>(GET_MY_SUB_THEMES)//Получаем подтемы карточек
    const {data: my_themes_data} = useQuery<Query, null>(GET_MY_THEMES)//Получаем наши темы
    const {data: my_global_themes_data} = useQuery<Query, null>(GET_MY_GLOBAL_THEMES)//Получаем наши глобальные темы
    const {data: all_card_themes_data, refetch: refetch_all_card_themes_data} = useQuery<Query, null>(ALL_CARD_THEMES)
    const [update_sub_theme, {loading: update_sub_theme_loading}] = useMutation<Mutation, {name: string, id: string}>(UPDATE_CARD_SUB_THEME, {
        variables:{
            name: activeEditData,
            id: selected_sub_theme_ID,
        },
        onCompleted: data => refetch_all_card_themes_data(),
        onError: error => console.log("Sub Theme Save Error: " + error)
    })
    const [update_theme, {loading: update_theme_loading}] = useMutation<Mutation, {name: string, id: string}>(UPDATE_CARD_THEMES, {
        variables:{
            name: activeEditData,
            id: selected_theme_ID
        },
        onCompleted: data => refetch_all_card_themes_data(),
        onError: error => console.log("Theme Save Error: " + error)
    })
    const [update_global_theme, {loading: update_global_theme_loading}] = useMutation<Mutation, {name: string, id: string}>(UPDATE_CARD_GLOBAL_THEME,{
        variables:{
            name: activeEditData,
            id: selected_global_theme_ID
        },
        onCompleted: data => refetch_all_card_themes_data(),
        onError: error => console.log("Global Theme Save Error: " + error)
    })
    useEffect(() =>{
        const __expanded: string[] = [] //собираем адйдишники, чтобы про появление списка он уже был
        //раскрыт на этих элементах

        const __all_sub_themes: {id: string , name: string}[] = [] //Нужно, чтобы потом можно было при клике находить эту
        const __all_themes: {id: string, name: string}[] = [] // подтему/тему/глобальную тему для того, чтобы
        const __all_global_themes: {id: string | undefined, name: string | undefined}[] = [] //редактировать, ID не
        // редактируем, на этих данных будут строяться мутации

        //Для того, чтобы элементы списка работали, у них должен быть свой уникатльный ID, проблема в том, что
        // темы/подтемы/глобальные темы имеют свои независимые айдишники, по этому они могут повторяться, чтобы этого
        //избежать мы умножаем ID глобальной темы на 10^6, а тем на 10^3, ID подтем не трогаем, таким образом, если
        // тем или подтем меньше 1000, что все работает шикарно
        if(all_card_themes_data){
            all_card_themes_data?.cardGlobalTheme?.map((sameGlobalTheme) =>{
                __all_global_themes.push({id: sameGlobalTheme?.id, name: sameGlobalTheme?.name})
                __expanded.push(String(Number(sameGlobalTheme?.id) * 1000000))
                sameGlobalTheme?.cardthemeSet.map((sameTheme) =>{
                    __all_themes.push({id: sameTheme.id, name: sameTheme.name})
                    __expanded.push(String(Number(sameTheme?.id) * 1000))
                    sameTheme?.cardsubthemeSet.map((sameSubTheme) =>{
                        __all_sub_themes.push({id: sameSubTheme.id, name: sameSubTheme.name})
                        __expanded.push(sameSubTheme.id)
                    })
                })
            })
            //После всех расчетов все данные сохраняются в стейт, вся логика работает именно с локальными переменными,
            //чтобы не было миллионов ререндеров, локальные переменные начинаются с "__"
            setExpanded(__expanded)
            set_all_global_themes(__all_global_themes)
            set_all_themes(__all_themes)
            set_all_sub_themes(__all_sub_themes)
        }
    }, [all_card_themes_data]) //подписка на любые изменения в данных о темах
    const handleSelect = (event, nodeIds) => {
        console.log(nodeIds)
        let __canBeEdited = false //Можно ли редактиовать подтему/тему/глобальную тему
        let __canAddSubItem = false
        if(nodeIds < 999){
            if(my_sub_theme_data?.me?.cardsubthemeSet?.find(obj => {
                //просто проходим по подтемат, пренадлежащим пользователю, если там
                // есть совпедение с кликнутым - редактровать можно, обязательно получать подтемы именно отдельным запросом,
                //потому что если попробовать достать подтемы из me запроса для более высокого уровня, то там будут чужие
                //варианты
                return(obj?.id == nodeIds)
            })){
                __canBeEdited = true
                // __canAddSubItem = false - потому что для подтемы нет под под темы, т.е. нельзя создать подсущность
            }
            setActiveEditData(all_sub_themes?.find(obj => {return obj?.id == nodeIds})?.name)
            set_selected_sub_theme_ID(nodeIds)
            // console.log(props.all_sub_themes.find(obj => {return obj.id == nodeIds}).name)
        }
        //Редактирование тем
        if(nodeIds > 1000 && nodeIds < 999999){
            if(my_themes_data?.me?.cardthemeSet?.find(obj =>{
                //Проверяем, есть ли в массиве моих тем тема с ID
                //как у выбранного, про этом стоит помнить, что ID для обычных тем умножаются на 10^3
                return(Number(obj?.id)*1000 == nodeIds)
            })){
                __canBeEdited = true
            }
            __canAddSubItem = true//У тем есть подтемы, по этому можно добавлять подсущность
            // console.log(props.all_themes.find(obj => {return obj.id * 1000 == nodeIds}).name)
            setActiveEditData(all_themes?.find(obj => {return Number(obj?.id) * 1000 == Number(nodeIds)})?.name)
            set_selected_theme_ID(String(Number(nodeIds) /1000))
        }
        //Редактирование глобальных тем
        if( nodeIds > 999999){
            if(my_global_themes_data?.me?.globalcardthemeSet?.find(obj =>{
                return(Number(obj?.id) * 1000000 == nodeIds)
            })){
                __canBeEdited = true
            }
            __canAddSubItem = true //У глобальных тем есть просто темы, по этому можно добавлять подсущность
            // console.log(props.all_global_themes.find(obj => {return obj.id * 1000000 == nodeIds}).name)
            setActiveEditData(all_global_themes?.find(obj => {return Number(obj?.id) * 1000000 == Number(nodeIds)})?.name)
            set_selected_global_theme_ID(String(Number(nodeIds)/1000000))
        }
        set_selected_id(nodeIds);
        setCanAddSubItem(__canAddSubItem) //записываем в стейт, что можно создать подсущность
        setCanBeEdited(__canBeEdited); //Устанавливаем уже после всех возможных проверок на то, что эта подтема или тема или глобальная тема
        //принадлежит этому пользователю
    };
    return(
        <div>
            <DCCardThemeEditor {...{selected_id, set_selected_id, all_card_themes_data, expanded,
                setExpanded, isCreatingNowCardTheme, setIsCreatingNowCardTheme,  isEditNowCardTheme,
                setIsEditNowCardTheme, all_sub_themes, all_themes, all_global_themes, setActiveEditData,
                activeEditData, selected_sub_theme_ID, set_selected_sub_theme_ID, selected_theme_ID,
                set_selected_theme_ID, selected_global_theme_ID, set_selected_global_theme_ID,
                update_sub_theme, update_sub_theme_loading, handleSelect, canBeEdited, setCanBeEdited,
                update_global_theme, update_global_theme_loading, update_theme, update_theme_loading,
                canAddSubItem
            }}/>
        </div>
    )
}
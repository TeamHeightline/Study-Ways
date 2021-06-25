import React, {useEffect, useState} from 'react'
import {
    GET_MY_CARD_THEMES,
    ALL_CARD_THEMES,
    CARD_SUB_THEMES,
} from './Structs'
import {useQuery} from "@apollo/client";
import {Query, UserNode} from "../../../../SchemaTypes";
import DCCardThemeEditor from "./##[DC]CardThemeEditor";
import {string} from "prop-types";
export default function LCCardThemeEditor(){
    const [my_card_sub_themes, set_my_card_sub_themes] = useState<CARD_SUB_THEMES>()
    const [expanded, setExpanded] = useState<string[]>([])
    const [selected_value, set_selected_value] = useState()
    const [isCreatingNowCardTheme, setIsCreatingNowCardTheme] = useState(false)
    const [isEditNowCardTheme, setIsEditNowCardTheme] = useState(false)
    const [all_sub_themes, set_all_sub_themes] = useState<{id: string , name: string}[]>()
    const [all_themes, set_all_themes] = useState<{id: string, name: string}[]>()
    const [all_global_themes, set_all_global_themes] = useState<{id: string | undefined, name: string | undefined}[]>()

    const {data: my_card_themes_data, } = useQuery<Query, null>(GET_MY_CARD_THEMES)
    const {data: all_card_themes_data, } = useQuery<Query, null>(ALL_CARD_THEMES)
    // console.log(my_card_themes_data)
    useEffect(() =>{
        //Собираем массив подтем, которые принадлежат тому, кто редактирует, понадобится потом уже для того,
        //чтобы отображать или нет кнопку редактирования для подтемы/темы/глобальной темы
        if(my_card_themes_data){
            const __my_card_sub_themes__: CARD_SUB_THEMES =[{name:'', id: "10000"}]//костыль, не знаю, как правильно
             __my_card_sub_themes__.splice(0, 1) //инициализировать пустые объекты
            my_card_themes_data?.me?.globalcardthemeSet.map((sameGlobalTheme) =>{
                sameGlobalTheme.cardthemeSet.map((sameCardTheme) =>{
                    sameCardTheme.cardsubthemeSet.map((sameSubTheme) =>{
                        __my_card_sub_themes__.push({name: sameSubTheme.name, id: sameSubTheme.id})
                    })
                })
            })
            set_my_card_sub_themes(__my_card_sub_themes__)
        }
    }, [my_card_themes_data]) // подписка на любые изменения в собственных темах
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
    return(
        <div>
            <DCCardThemeEditor {...{selected_value, set_selected_value, all_card_themes_data, expanded,
                setExpanded, isCreatingNowCardTheme, setIsCreatingNowCardTheme,  isEditNowCardTheme,
                setIsEditNowCardTheme
            }}/>
        </div>
    )
}
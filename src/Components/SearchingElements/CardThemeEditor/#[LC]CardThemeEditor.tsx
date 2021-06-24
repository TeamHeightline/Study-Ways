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
        if(all_card_themes_data){
            all_card_themes_data?.cardGlobalTheme?.map((sameGlobalTheme) =>{
                __expanded.push(String(Number(sameGlobalTheme?.id) * 1000000))
                sameGlobalTheme?.cardthemeSet.map((sameTheme) =>{
                    __expanded.push(String(Number(sameTheme?.id) * 1000))
                    sameTheme?.cardsubthemeSet.map((sameSubTheme) =>{
                        __expanded.push(sameSubTheme.id)
                    })
                })
            })
            setExpanded(__expanded)
        }
    }, [all_card_themes_data]) //подписка на любые изменения в данных о темах
    return(
        <div>
            <DCCardThemeEditor {...{selected_value, set_selected_value, all_card_themes_data, expanded,
                setExpanded}}/>
        </div>
    )
}
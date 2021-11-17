import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from "@apollo/client";
import {sortBy} from 'lodash';

import {GET_MY_USER_TEST_THEMES, CREATE_NEW_USER_TEST_THEME, UPDATE_USER_TEST_THEME,
    columnsForAuthorsDataGrid } from "./Structs";

import DCUserTestThemeEditor from "./##[DC]UserTestThemeEditor";
export default function LCUserTestThemeEditor(){
    const [rowsHasBeenCalculated, setRowsNasBeenCalculated] = useState(false) //Из-за того, что есть
    // возможноть, что у пользователя еще нет тем, то нужно завести отдельную переменную, чтобы понимать, что процесс
    // обработки данных с сервера уже прошел, иначе, если просто проверять rows, то если у пользователя нет тем, то он
    // получит бесконечную загрузку
    const [rows, setRows] = useState<any>() //строки для визуализации, структура [{name: , id: }]
    const [selectedThemeRow, setSelectedThemeRow] = useState<any>() //строка, на которую кликнули, по
    // умолчанию - первая строка,нужно, чтобы можно было редактировать тему
    const [activeEditUserTestThemeName, setActiveEditUserTestThemeName] = useState<any>() //поле для редактирования названия темы
    const [nameOfNewUserTestTheme, setNameOfNewUserTestTheme] = useState<any>() //поле для названия новой темы

    const [isEditNowUserTestTheme, setIsEditNowUserTestTheme] = useState(false) //если true -> активен режим редактирования темы
    const [isCreatingNowUserTestTheme, setIsCreatingNowUserTestTheme] = useState(false) // если true -> активер режим создания темы
    const update_row_by_data = async(data) =>{
        if(data){
            const _rows: any = []
            const sorted_questionthemesSet = sortBy(data.me.questionthemesSet, 'id');
            sorted_questionthemesSet.map((sameTheme) =>{
                _rows.push({id: sameTheme.id, name: sameTheme.name})
            })
            setRows(_rows)
            if(!selectedThemeRow){
                await setSelectedThemeRow(_rows[0])
            }
            if(!activeEditUserTestThemeName){
                await setActiveEditUserTestThemeName(_rows[0]?.name)
            }
            await setRowsNasBeenCalculated(true)
        }
    }

    const {data: user_test_themes_data, refetch: refetch_user_test_themes} = useQuery(GET_MY_USER_TEST_THEMES, {
        onCompleted: data => update_row_by_data(data)
    })

    const [update_theme, {loading: update_theme_loading}] = useMutation(UPDATE_USER_TEST_THEME, {
        variables:{
            id: selectedThemeRow?.id,
            name: activeEditUserTestThemeName
        },
        onCompleted: () => {
            refetch_user_test_themes()
            // setIsEditNowCardAuthor(false)
        },
    })
    const [create_theme, {loading: create_theme_loading}] = useMutation(CREATE_NEW_USER_TEST_THEME, {
        variables:{
            name: nameOfNewUserTestTheme
        },
        onCompleted: () => refetch_user_test_themes()
    })
    useEffect(() =>{
        update_row_by_data(user_test_themes_data)
    }, [user_test_themes_data])
    return(
        <DCUserTestThemeEditor {...{rowsHasBeenCalculated, rows, columnsForAuthorsDataGrid,
            setSelectedThemeRow, setActiveEditUserTestThemeName, isCreatingNowUserTestTheme,
            setIsCreatingNowUserTestTheme, setIsEditNowUserTestTheme, isEditNowUserTestTheme,
            activeEditUserTestThemeName, update_theme, update_theme_loading, nameOfNewUserTestTheme,
            setNameOfNewUserTestTheme, create_theme, create_theme_loading, }}/>
    )
}
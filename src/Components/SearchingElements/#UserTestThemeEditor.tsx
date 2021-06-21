import React, {useEffect, useState} from 'react'
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import {Row, Spinner} from "react-bootstrap";
import * as _ from 'lodash'
import {DataGrid} from "@material-ui/data-grid";
import {Button, Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

const  GET_MY_USER_TEST_THEMES = gql`
    query GET_MY_USER_TEST_THEMES{
        me{
            questionthemesSet{
                name
                id
            }
        }
    }
`
const UPDATE_USER_TEST_THEME = gql`
    mutation UPDATE_USER_TEST_THEME($name: String!, $id: ID!){
        updateQuestionThemes(input: {name: $name, createdBy: 0, id: $id}){
            clientMutationId
        }
    }`
const CREATE_NEW_USER_TEST_THEME = gql`
    mutation CREATE_NEW_USER_TEST_THEME($name: String!){
        createQuestionThemes(input: {name: $name, createdBy: 0}){
            clientMutationId
        }
    }`

const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Тема вопросов/тестов', width: 500},
]

export default function UserTestThemeEditor(){
    const [rowsHasBeenCalculated, setRowsNasBeenCalculated] = useState(false) //Из-за того, что есть
    // возможноть, что у пользователя еще нет тем, то нужно завести отдельную переменную, чтобы понимать, что процесс
    // обработки данных с сервера уже прошел, иначе, если просто проверять rows, то если у пользователя нет тем, то он
    // получит бесконечную загрузку
    const [rows, setRows] = useState<any>()
    const [selectedThemeRow, setSelectedThemeRow] = useState<any>()
    const [activeEditUserTestThemeName, setActiveEditUserTestThemeName] = useState<any>()
    const [nameOfNewUserTestTheme, setNameOfNewUserTestTheme] = useState<any>()

    const [isEditNowUserTestTheme, setIsEditNowUserTestTheme] = useState(false)
    const [isCreatingNowUserTestTheme, setIsCreatingNowUserTestTheme] = useState(false)
    const update_row_by_data = async(data) =>{
        if(data){
            const _rows: any = []
            const sorted_questionthemesSet = _.sortBy(data.me.questionthemesSet, 'id');
            sorted_questionthemesSet.map((sameTheme) =>{
                _rows.push({id: sameTheme.id, name: sameTheme.name})
            })
            setRows(_rows)
            if(!selectedThemeRow){
                await setSelectedThemeRow(_rows[0])
            }
            if(!activeEditUserTestThemeName){
                await setActiveEditUserTestThemeName(_rows[0].name)
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
        onCompleted: data => {
            refetch_user_test_themes()
            // setIsEditNowCardAuthor(false)
        },
    })
    const [create_theme, {loading: create_theme_loading}] = useMutation(CREATE_NEW_USER_TEST_THEME, {
        variables:{
            name: nameOfNewUserTestTheme
        },
        onCompleted: data => refetch_user_test_themes()
    })
    useEffect(() =>{
        update_row_by_data(user_test_themes_data)
    }, [user_test_themes_data])

    if(!rowsHasBeenCalculated){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <DataGrid rows={rows} columns={columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              setSelectedThemeRow(e.row)
                              setActiveEditUserTestThemeName(e.row.name)
                          }}
                />
                <Row className="col-3 offset-9 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                             if(isCreatingNowUserTestTheme){
                                 setIsCreatingNowUserTestTheme(false)
                             }
                             setIsEditNowUserTestTheme(!isEditNowUserTestTheme)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(isEditNowUserTestTheme){
                                 setIsEditNowUserTestTheme(false)
                             }
                             setIsCreatingNowUserTestTheme(!isCreatingNowUserTestTheme)
                         }}>
                        <AddIcon/>

                    </Fab>
                </Row>
                {isEditNowUserTestTheme && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={activeEditUserTestThemeName}
                        onChange={(e) =>{
                            setActiveEditUserTestThemeName(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            update_theme()}}>
                            Сохранить
                        </Button>
                        {update_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
                {isCreatingNowUserTestTheme && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя нового автора"
                        fullWidth
                        value={nameOfNewUserTestTheme}
                        onChange={(e) =>{
                            setNameOfNewUserTestTheme(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            create_theme()}}>
                            Сохранить
                        </Button>
                        {create_theme_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
            </div>
        </div>
    )
}
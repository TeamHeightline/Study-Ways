import React, {useEffect, useState} from 'react'
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {Row, Spinner} from "react-bootstrap";
import * as _ from 'lodash'
import {DataGrid} from "@material-ui/data-grid";
import {Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";

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


    const {data: user_test_themes_data} = useQuery(GET_MY_USER_TEST_THEMES, {
        onCompleted: data => update_row_by_data(data)
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
            </div>
            </div>
    )
}
import React, {useEffect, useState} from 'react'
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import {Col, Row, Spinner} from "react-bootstrap";
import {DataGrid} from "@material-ui/data-grid";
import SettingsIcon from '@material-ui/icons/Settings';
import {Button, Fab, Paper} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import * as _ from 'lodash'
import  {GET_CARD_AUTHOR, CREATE_NEW_AUTHOR, UPDATE_CARD_AUTHOR} from './Structs'
import CardAuthorEditorDumb from "./##CardAuthorEditorDumb";

const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Автор карточки', width: 500},
]
//Вся документация в UserTestThemeEditor, он идентичен этому компоненту
export default  function CardAuthorEditorLogic(){
    const [rowsHasBeenCalculated, setRowsNasBeenCalculated] = useState(false)
    const [rows, setRows] = useState<any>()
    const [selectedAuthorRow, setSelectedAuthorRow] = useState<any>()
    const [activeEditCardAuthorName, setActiveEditCardAuthorName] = useState<string>()
    const [isEditNowCardAuthor, setIsEditNowCardAuthor] = useState(false)
    const [isCreatingNowCardAuthor, setIsCreatingNowCardAuthor] = useState(false)
    const [nameOfNewAuthor, setNameOfNewAuthor] = useState<any>()

    const update_row_by_data = async (data) =>{
        if(data){
            const _rows: any = []
            const sorted_cardauthorSet = _.sortBy(data.me.cardauthorSet, 'id');
            sorted_cardauthorSet.map((sameAuthor) =>{
                _rows.push({id: sameAuthor.id, name: sameAuthor.name})
            })
            setRows(_rows)
            if(!selectedAuthorRow){
                await setSelectedAuthorRow(_rows[0])
            }
            if(!activeEditCardAuthorName){
                await setActiveEditCardAuthorName(_rows[0].name)
            }
            await setRowsNasBeenCalculated(true)
        }
    }

    const {data: card_author_data, refetch: refetch_card_author} = useQuery(GET_CARD_AUTHOR, {
        onCompleted: (data) =>{
            if(data){
                update_row_by_data(data)
            }
        },
    })
    useEffect(() =>{
        update_row_by_data(card_author_data)
    }, [card_author_data])

    const [update_author, {loading: update_author_loading}] = useMutation(UPDATE_CARD_AUTHOR, {
        variables:{
            id: selectedAuthorRow?.id,
            name: activeEditCardAuthorName
        },
        onCompleted: async  data => {
            await refetch_card_author()
            // setIsEditNowCardAuthor(false)
        },
    })
    const [create_author, {loading: create_author_loading}] = useMutation(CREATE_NEW_AUTHOR, {
        variables:{
            name: nameOfNewAuthor
        },
        onCompleted: async  data => {
            await refetch_card_author()
            // setIsCreatingNowCardAuthor(false)
        },
    })
    if(!rowsHasBeenCalculated){
        return(
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <CardAuthorEditorDumb rowsHasBeenCalculated={rowsHasBeenCalculated}
                              columnsForAuthorsDataGrid={columnsForAuthorsDataGrid}
                              setSelectedAuthorRow={setSelectedAuthorRow}
                              setActiveEditCardAuthorName={setActiveEditCardAuthorName}
                              isCreatingNowCardAuthor={isCreatingNowCardAuthor}
                              setIsCreatingNowCardAuthor={setIsCreatingNowCardAuthor}
                              setIsEditNowCardAuthor={setIsEditNowCardAuthor}
                              isEditNowCardAuthor={isEditNowCardAuthor}
                              activeEditCardAuthorName={activeEditCardAuthorName}
                              update_author={update_author}
                              setNameOfNewAuthor={setNameOfNewAuthor}
                              create_author={create_author}
                              create_author_loading={create_author_loading}
                              rows={rows}/>
    )
}
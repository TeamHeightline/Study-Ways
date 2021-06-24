import React, {useEffect, useState} from 'react'
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import * as _ from 'lodash'
import {DataGrid} from "@material-ui/data-grid";
import {Row, Spinner} from "react-bootstrap";
import {Button, Fab} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

import {GET_MY_USER_TEST_AUTHORS, columnsForAuthorsDataGrid, CREATE_NEW_USER_TEST_AUTHOR,
    UPDATE_USER_TEST_AUTHOR} from './Structs'
import DCUserTestAuthorEditor from "./##[DC]UserTestAuthorEditor";
//Вся документация в UserTestThemeEditor, он идентичен этому компоненту
export default function LCUserTestAuthorEditor(){
    const [rows, setRows] = useState<any>()
    const [rowsHasBeenCalculated, setRowsNasBeenCalculated] = useState(false)
    const [selectedAuthorRow, setSelectedAuthorRow] = useState<any>()
    const [activeEditUserTestAuthorName, setActiveEditUserTestAuthorName] = useState<string>()
    const [newUserTestAuthorName, setNewUserTestAuthorName] = useState<any>()
    const [isCreatingNowTestAuthor, setIsCreatingNowTestAuthor] = useState(false)
    const [isEditNowTestAuthor, setIsEditNowTestAuthor] = useState(false)

    const update_row_by_data = async (data) =>{
        if(data){
            const _rows: any = []
            const sorted_questionauthorSet = _.sortBy(data.me.questionauthorSet, 'id');
            sorted_questionauthorSet.map((sameAuthor) =>{
                _rows.push({id: sameAuthor.id, name: sameAuthor.name})
            })
            await setRows(_rows)
            if(!selectedAuthorRow){
                await setSelectedAuthorRow(_rows[0])
            }
            if(!activeEditUserTestAuthorName){
                await setActiveEditUserTestAuthorName(_rows[0].name)
            }
            await setRowsNasBeenCalculated(true)
        }
    }
    const {data: author_data, refetch: refetch_author_data} = useQuery(GET_MY_USER_TEST_AUTHORS, {
        onCompleted: data => {
            update_row_by_data(data)
        }
    })
    const [update_author, {loading: update_author_loading}] = useMutation(UPDATE_USER_TEST_AUTHOR,{
        variables:{
            name: activeEditUserTestAuthorName,
            id: selectedAuthorRow?.id
        },
        onCompleted: data =>{
            refetch_author_data()
        }
    })
    const [create_author, {loading: create_author_loading}] = useMutation(CREATE_NEW_USER_TEST_AUTHOR, {
        variables:{
            name: newUserTestAuthorName
        },
        onCompleted: data =>{
            refetch_author_data()
        }
    })
    useEffect(() =>{
        update_row_by_data(author_data)
    }, [author_data])

    if(!rowsHasBeenCalculated){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return (
        <DCUserTestAuthorEditor {...{rows, columnsForAuthorsDataGrid, setSelectedAuthorRow,
            setActiveEditUserTestAuthorName, isCreatingNowTestAuthor, setIsCreatingNowTestAuthor,
            setIsEditNowTestAuthor, isEditNowTestAuthor, activeEditUserTestAuthorName,
            update_author, update_author_loading, newUserTestAuthorName, setNewUserTestAuthorName,
            create_author, create_author_loading}}/>
    )
}
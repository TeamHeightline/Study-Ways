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

const GET_MY_USER_TEST_AUTHORS = gql`
    query GET_MY_USER_TEST_AUTHORS{
        me{
            questionauthorSet{
                id
                name
            }
        }
    }`

const UPDATE_USER_TEST_AUTHOR = gql`
    mutation UPDATE_USER_TEST_AUTHOR($name: String!, $id: ID!){
        updateQuestionAuthor(input: {name: $name, id: $id, createdBy: 0}){
            clientMutationId
        }
    }`

const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Автор вопросов/тестов', width: 500},
]

export default function UserTestAuthorEditor(){
    const [rows, setRows] = useState<any>()

    const [selectedAuthorRow, setSelectedAuthorRow] = useState<any>()
    const [activeEditUserTestAuthorName, setActiveEditUserTestAuthorName] = useState<string>()
    const [isCreatingNowTestAuthor, setIsCreatingNowTestAuthor] = useState(false)
    const [isEditNowTestAuthor, setIsEditNowTestAuthor] = useState(false)

    const update_row_by_data = (data) =>{
        if(data){
            const _rows: any = []
            const sorted_questionauthorSet = _.sortBy(data.me.questionauthorSet, 'id');
            sorted_questionauthorSet.map((sameAuthor) =>{
                _rows.push({id: sameAuthor.id, name: sameAuthor.name})
            })
            setRows(_rows)
            if(!selectedAuthorRow){
                setSelectedAuthorRow(_rows[0])
            }
            if(!activeEditUserTestAuthorName){
                setActiveEditUserTestAuthorName(_rows[0].name)
            }
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
    useEffect(() =>{
        update_row_by_data(author_data)
    }, [author_data])

    if(!rows){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <DataGrid rows={rows} columns={columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              setSelectedAuthorRow(e.row)
                              setActiveEditUserTestAuthorName(e.row.name)
                          }}
                />
                <Row className="col-3 offset-9 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                             if(isCreatingNowTestAuthor){
                                 setIsCreatingNowTestAuthor(false)
                             }
                             setIsEditNowTestAuthor(!isEditNowTestAuthor)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(isEditNowTestAuthor){
                                 setIsEditNowTestAuthor(false)
                             }
                             setIsCreatingNowTestAuthor(!isCreatingNowTestAuthor)
                         }}>
                        <AddIcon/>
                    </Fab>
                </Row>
                {isEditNowTestAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={activeEditUserTestAuthorName}
                        onChange={(e) =>{
                            setActiveEditUserTestAuthorName(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            update_author()}}>
                            Сохранить
                        </Button>
                        {update_author_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
            </div>
        </div>
    )
}
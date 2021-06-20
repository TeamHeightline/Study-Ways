import React, {useEffect, useState} from 'react'
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import {Col, Row, Spinner} from "react-bootstrap";
import {DataGrid} from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from '@material-ui/icons/Settings';
import {Button, Fab, Paper} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import * as _ from 'lodash'
const GET_CARD_AUTHOR= gql`
    query GET_CARD_AUTHOR{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }`
const UPDATE_CARD_AUTHOR= gql`
    mutation UPDATE_CARD_AUTHOR($name: String!, $id: ID!){
        cardAuthor(input: {name: $name, id: $id, createdBy: 0}){
            clientMutationId
        }
    }`
const CREATE_NEW_AUTHOR = gql`
    mutation CREATE_NEW_AUTHOR($name:String!){
        cardAuthor(input: {name: $name, createdBy: 0, }){
            clientMutationId
        }
    }`
const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Автор карточки', width: 500},
]

export default  function CardAuthorEditor(){
    const [rows, setRows] = useState<any>()
    const [selectedAuthorRow, setSelectedAuthorRow] = useState<any>()
    const [activeEditCardAuthorName, setActiveEditCardAuthorName] = useState<string>()
    const [isEditNowCardAuthor, setIsEditNowCardAuthor] = useState(false)
    const [isCreatingNowCardAuthor, setIsCreatingNowCardAuthor] = useState(false)
    const [nameOfNewAuthor, setNameOfNewAuthor] = useState<any>()

    const update_row_by_data = (data) =>{
        if(data){
            const _rows: any = []
            const sorted_cardauthorSet = _.sortBy(data.me.cardauthorSet, 'id');
            sorted_cardauthorSet.map((sameAuthor) =>{
                _rows.push({id: sameAuthor.id, name: sameAuthor.name})
            })
            setRows(_rows)
            if(!selectedAuthorRow){
                setSelectedAuthorRow(_rows[0])
            }
            if(!activeEditCardAuthorName){
                setActiveEditCardAuthorName(_rows[0].name)
            }
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
    if(!rows){
        return(
                <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            )
    }
    return(
        <div>
            <div style={{width: 600, height: 400}}>
                <DataGrid rows={rows} columns={columnsForAuthorsDataGrid}
                          onRowClick={(e) => {
                              setSelectedAuthorRow(e.row)
                              setActiveEditCardAuthorName(e.row.name)
                          }}
                />
                <Row className="col-3 offset-9 mt-2">
                    <Fab color="primary"

                         onClick={() =>{
                             if(isCreatingNowCardAuthor){
                                 setIsCreatingNowCardAuthor(false)
                             }
                            setIsEditNowCardAuthor(!isEditNowCardAuthor)
                         }}>
                        <SettingsIcon />
                    </Fab>
                    <Fab color="primary"
                         className="ml-2"
                         onClick={() =>{
                             if(isEditNowCardAuthor){
                                 setIsEditNowCardAuthor(false)
                             }
                             setIsCreatingNowCardAuthor(!isCreatingNowCardAuthor)
                         }}>
                        <AddIcon/>
                    </Fab>
                </Row>
                {isEditNowCardAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя автора"
                        fullWidth
                        value={activeEditCardAuthorName}
                        onChange={(e) =>{
                            setActiveEditCardAuthorName(e.target.value)}
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
                {isCreatingNowCardAuthor && <div>
                    <TextField
                        className="ml-2"
                        id="standard-multiline-flexible"
                        label="Имя нового автора"
                        fullWidth
                        value={nameOfNewAuthor}
                        onChange={(e) =>{
                            setNameOfNewAuthor(e.target.value)}
                        }
                    />
                    <Row className="mt-2 ml-2">
                        <Button variant="contained" color="primary" onClick={() =>{
                            create_author()}}>
                            Сохранить
                        </Button>
                        {create_author_loading &&
                        <Spinner animation="border" variant="success" className="ml-2 mt-2"/>}
                    </Row>
                </div>}
            </div>
        </div>
    )
}
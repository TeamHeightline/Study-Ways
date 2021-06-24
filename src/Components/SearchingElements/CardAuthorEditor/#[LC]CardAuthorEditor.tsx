import React, {useEffect, useState} from 'react'
import {useMutation, useQuery} from "@apollo/client";
import * as _ from 'lodash'
import  {GET_CARD_AUTHOR, CREATE_NEW_AUTHOR, UPDATE_CARD_AUTHOR} from './Structs'
import DCCardAuthorEditor from "./##[DC]CardAuthorEditor";

const columnsForAuthorsDataGrid = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'name', headerName: 'Автор карточки', width: 500},
]
//Вся документация в UserTestThemeEditor, он идентичен этому компоненту
export default  function LCCardAuthorEditor(){
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
    return(
        <DCCardAuthorEditor {...{rowsHasBeenCalculated, columnsForAuthorsDataGrid, setSelectedAuthorRow,
            setActiveEditCardAuthorName, isCreatingNowCardAuthor, setIsCreatingNowCardAuthor, setIsEditNowCardAuthor,
            activeEditCardAuthorName, update_author, setNameOfNewAuthor, create_author, create_author_loading,rows,
            isEditNowCardAuthor
        }}/>
    )
}
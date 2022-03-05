import React, {useEffect, useState} from 'react'
import {useMutation, useQuery} from "@apollo/client";
import {sortBy} from 'lodash'

import {
    GET_MY_USER_TEST_AUTHORS, columnsForAuthorsDataGrid, CREATE_NEW_USER_TEST_AUTHOR,
    UPDATE_USER_TEST_AUTHOR
} from './Structs'

import DCUserTestAuthorEditor from "./[DC]UserTestAuthorEditor";

//Вся документация в LCUserTestThemeEditor, он идентичен этому компоненту
export default function LCUserTestAuthorEditor() {
    const [rows, setRows] = useState<any>()
    const [rowsHasBeenCalculated, setRowsNasBeenCalculated] = useState(false)
    const [selectedAuthorRow, setSelectedAuthorRow] = useState<any>()
    const [activeEditUserTestAuthorName, setActiveEditUserTestAuthorName] = useState<string>()
    const [newUserTestAuthorName, setNewUserTestAuthorName] = useState<any>()
    const [isCreatingNowTestAuthor, setIsCreatingNowTestAuthor] = useState(false)
    const [isEditNowTestAuthor, setIsEditNowTestAuthor] = useState(false)

    const update_row_by_data = async (data) => {
        if (data) {
            const _rows: any = []
            const sorted_questionauthorSet = sortBy(data.me.questionauthorSet, 'id');
            sorted_questionauthorSet.map((sameAuthor) => {
                _rows.push({id: sameAuthor.id, name: sameAuthor.name})
            })
            await setRows(_rows)
            if (!selectedAuthorRow) {
                await setSelectedAuthorRow(_rows[0])
            }
            if (!activeEditUserTestAuthorName) {
                await setActiveEditUserTestAuthorName(_rows[0]?.name)
            }
            await setRowsNasBeenCalculated(true)
        }
    }
    const {data: author_data, refetch: refetch_author_data} = useQuery(GET_MY_USER_TEST_AUTHORS, {
        onCompleted: data => {
            update_row_by_data(data)
        }
    })
    const [update_author, {loading: update_author_loading}] = useMutation(UPDATE_USER_TEST_AUTHOR, {
        variables: {
            name: activeEditUserTestAuthorName,
            id: selectedAuthorRow?.id
        },
        onCompleted: () => {
            refetch_author_data()
        }
    })
    const [create_author, {loading: create_author_loading}] = useMutation(CREATE_NEW_USER_TEST_AUTHOR, {
        variables: {
            name: newUserTestAuthorName
        },
        onCompleted: () => {
            refetch_author_data()
        }
    })
    useEffect(() => {
        update_row_by_data(author_data)
    }, [author_data])
    return (
        <DCUserTestAuthorEditor {...{
            rows, rowsHasBeenCalculated, columnsForAuthorsDataGrid, setSelectedAuthorRow,
            setActiveEditUserTestAuthorName, isCreatingNowTestAuthor, setIsCreatingNowTestAuthor,
            setIsEditNowTestAuthor, isEditNowTestAuthor, activeEditUserTestAuthorName,
            update_author, update_author_loading, newUserTestAuthorName, setNewUserTestAuthorName,
            create_author, create_author_loading
        }}/>
    )
}
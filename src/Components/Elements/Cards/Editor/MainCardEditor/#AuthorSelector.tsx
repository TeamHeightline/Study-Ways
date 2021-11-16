import React, {useEffect, useState} from 'react'
import {Spinner} from "react-bootstrap";
import 'fontsource-roboto';
import _ from 'lodash'
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {CardNode} from "../../../../../SchemaTypes";

interface AuthorSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    cards_data?: CardNode[],
    openFromPublicView?: boolean,
    changeSelectedData?: any,
}

export const AuthorSelector = observer(({
                                            cards_data,
                                            openFromPublicView,
                                            changeSelectedData,
                                            ...props
                                        }: AuthorSelectorProps) => {
    const [selectedAuthor, setSelectedAuthor] = useState<any>(1000000)
    const [authorsArray, setAuthorsArray] = useState<any>([])
    const get_cards_data_by_author_id = (author_id) => {
        return (_.filter(cards_data, ((obj) => {
            if (obj.author.length === 0) {
                return false
            }
            return (_.find(obj.author, (item) => {
                return (item.id == author_id)
            }))
        })))
    }

    function UpdateDataAfterChangeContentTypeOrTheme(targetData) {
        const ConstAuthorsArray: any = []
        targetData.map((sameCard) => {
            sameCard.author.map((interatedAuthorInSameCard) => {
                if (ConstAuthorsArray.indexOf(interatedAuthorInSameCard) === -1) {
                    ConstAuthorsArray.push(interatedAuthorInSameCard)
                }
            })
        })
        setAuthorsArray(ConstAuthorsArray)
        changeSelectedData(targetData)
    }

    useEffect(() => {
        UpdateDataAfterChangeContentTypeOrTheme(cards_data)
    }, [cards_data])
    if (!authorsArray) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return (
        <div {...props}>
            <FormControl fullWidth>
                <InputLabel>Автор карточки:</InputLabel>
                <Select
                    style={{width: "100%", maxWidth: 600}}
                    fullWidth
                    label="Автор карточки:"
                    value={selectedAuthor}
                    onChange={(event) => {
                        if (!openFromPublicView) {
                            setSelectedAuthor(event.target.value)
                            if (Number(event.target.value) === 1000000) {
                                changeSelectedData(cards_data)
                            } else {
                                changeSelectedData(get_cards_data_by_author_id(event.target.value))
                            }
                        } else {
                            CardPageStorage.changeSelectedAuthor(event.target.value)
                        }
                    }}
                >
                    <MenuItem value={1000000}>Не выбран</MenuItem>
                    {!openFromPublicView ?
                        authorsArray.map((author: any) => {
                            return (<MenuItem key={author.id + "authorForSelect"}
                                              value={author.id}> {author.name}</MenuItem>)
                        })
                        :
                        toJS(CardPageStorage.authorsArray).map((author: any) => {
                            return (<MenuItem key={author.id + "authorForSelect"}
                                              value={author.id}> {author.name}</MenuItem>)
                        })
                    }
                </Select>
            </FormControl>
        </div>
    )
})
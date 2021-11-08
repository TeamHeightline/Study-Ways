import React, {useEffect, useState} from 'react'
import {Col, Form, Row, Spinner} from "react-bootstrap";
import Typography from '@mui/material/Typography';
import 'fontsource-roboto';
import _ from 'lodash'
import {observer} from "mobx-react";
import { toJS} from "mobx";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {MenuItem, Select, Stack} from "@mui/material";

export const AuthorSelector = observer(({cards_data, ...props}: any) =>{
    const [selectedAuthor, setSelectedAuthor] = useState<any>(1000000)
    const [authorsArray, setAuthorsArray] = useState<any>([])
    const get_cards_data_by_author_id = (author_id) =>{
        return(_.filter(cards_data, ((obj) =>{
            if (obj.author.length === 0){
                return false
            }
            return (_.find(obj.author, (item) => {
                return(item.id == author_id)
            }))
        })))
    }
    function UpdateDataAfterChangeContentTypeOrTheme(targetData){
        const ConstAuthorsArray: any = []
        targetData.map((sameCard) =>{
            sameCard.author.map((interatedAuthorInSameCard) =>{
                if (ConstAuthorsArray.indexOf(interatedAuthorInSameCard) === -1){
                    ConstAuthorsArray.push(interatedAuthorInSameCard)
                }
            })
        })
        setAuthorsArray(ConstAuthorsArray)
        props.ChangeSelectedData(targetData)
    }
    useEffect(() =>{
        UpdateDataAfterChangeContentTypeOrTheme(cards_data)
    }, [cards_data])
    if(!authorsArray){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div {...props}>
            <Stack direction={"row"}>
                <Typography variant="h6" gutterBottom style={{marginTop: 6}}>
                    Автор:
                </Typography>
                <div style={{paddingLeft: 12}}>
                    <Select
                        style={{minWidth: 200, maxWidth: 600}}
                        fullWidth
                        label=""
                        value={selectedAuthor}
                        onChange={ (event) => {
                            if(!props?.openFromPublicView){
                                setSelectedAuthor(event.target.value)
                                if (Number(event.target.value) === 1000000) {
                                    props.ChangeSelectedData(cards_data)
                                } else {
                                    props.ChangeSelectedData(get_cards_data_by_author_id(event.target.value))
                                }
                            }else{
                                CardPageStorage.changeSelectedAuthor(event.target.value)
                            }
                        }}
                    >
                        <MenuItem value={1000000}>Не выбран</MenuItem>
                        {!props?.openFromPublicView ?
                            authorsArray.map((author: any) => {
                                return (<MenuItem key={author.id + "authorForSelect"}
                                                value={author.id}> {author.name}</MenuItem>)})
                            :
                            toJS(CardPageStorage.authorsArray).map((author: any) => {
                                return (<MenuItem key={author.id + "authorForSelect"}
                                                value={author.id}> {author.name}</MenuItem>)})
                        }
                    </Select>
                </div>
            </Stack>
        </div>
    )
})
import React, {useEffect, useState} from 'react'
import {Col, Form, Row, Spinner} from "react-bootstrap";
import Typography from '@material-ui/core/Typography';
import 'fontsource-roboto';
import _ from 'lodash'
import {observer} from "mobx-react";
import { toJS} from "mobx";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";

export const AuthorSelector = observer(({cards_data, ...props}: any) =>{
    const [selectedAuthor, setSelectedAuthor] = useState<any>()
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
        <Row {...props}>
            <Col className="col-3 mt-2">
                <Typography variant="h6" gutterBottom className="pr-5">
                    Автор:
                </Typography>
            </Col>
            <Col className="col-7">
                <Form.Control
                    className="mt-1"
                    // size="lg"
                    as="select"
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
                    }}>
                    <option value={1000000}>Не выбран</option>
                    {!props?.openFromPublicView ?
                        authorsArray.map((author: any) => {
                        return (<option key={author.id + "authorForSelect"}
                                        value={author.id}> {author.name}</option>)})
                        :
                        toJS(CardPageStorage.authorsArray).map((author: any) => {
                            return (<option key={author.id + "authorForSelect"}
                                            value={author.id}> {author.name}</option>)})
                    }

                </Form.Control>
            </Col>
        </Row>
    )
})
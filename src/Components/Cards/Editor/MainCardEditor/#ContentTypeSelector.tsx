import React, {useEffect, useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {Col, Form, Row} from "react-bootstrap";
import _ from 'lodash'

export default function ContentTypeSelector({cards_data, ...props}: any){
    const [selectedContentType, setSelectedContentType] = useState<any>(1000000)
    // props.onChangeSelectedData(_.filter(cards_data, {'cardContentType': "A_" + selectedContentType}))
    useEffect(() =>{
        if (Number(selectedContentType) != 1000000) {
            props.ChangeSelectedData(_.filter(cards_data, {'cardContentType': "A_" + selectedContentType}))
        } else {
            props.ChangeSelectedData(cards_data)
        }}, [cards_data])
    return(
        <Row {...props}>
            <Col className="col-3 mt-2">
                <Typography variant="h6" gutterBottom className="pr-5">
                    Тип:
                </Typography>
            </Col>
            <Col className="col-7">
                <Form.Control
                    className="mt-1"
                    // size="lg"
                    as="select"
                    value={selectedContentType}
                    onChange={ (event) => {
                        // console.log(event)
                        setSelectedContentType(event.target.value)
                        if (Number(event.target.value) != 1000000) {
                            props.ChangeSelectedData(_.filter(cards_data, {'cardContentType': "A_" + event.target.value}))
                        } else {
                            props.ChangeSelectedData(cards_data)
                        }
                    }}>
                    <option value={1000000}>Не выбран</option>
                    <option value={0}>YouTube</option>
                    <option value={1}>Внешний ресурс</option>
                    <option value={2}>Изображение</option>
                </Form.Control>
            </Col>
        </Row>
    )
}
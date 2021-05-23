import React, {useState} from 'react'
import {Col, Form, Row, Spinner} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {gql} from "graphql.macro";
import Typography from '@material-ui/core/Typography';
import 'fontsource-roboto';

const GET_OWN_AUTHORS = gql`
    query GET_OWN_AUTHORS{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }`
export default function AuthorSelector({...props}: any){
    const [selectedAuthor, setSelectedAuthor] = useState<any>()
    const {data: author_data} = useQuery(GET_OWN_AUTHORS)
    if(!author_data){
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
            <Col className="col-8">
                <Form.Control
                    className="mt-1"
                    // size="lg"
                    as="select"
                    value={selectedAuthor}
                    onChange={ (event) => {
                         setSelectedAuthor(event.target.value)
                    }}>
                    {author_data.me.cardauthorSet.map((author: any) => {
                        return (<option key={author.id + "authorForSelect"}
                                        value={author.id}> {author.name}</option>)
                    })}
                </Form.Control>
            </Col>
        </Row>
    )
}
import * as React from 'react';
import {requestCardContent} from '../InsteadOfDatabase/mainCard';
import {Button, Card} from "react-bootstrap";


export const CardShow = () =>  (
            <>
                {requestCardContent.map((card:{[key: string]: string}) =>
                    <Card style={{width: '18rem'}} className="mr-2  mt-3">
                        <Card.Img variant="top" src={card.cardImgUrl}/>
                        <Card.Body>
                            <Card.Title>{card.cardTitle}</Card.Title>
                            <Card.Text>
                                {card.cardText}
                            </Card.Text>
                            <Button variant="primary">{card.cardButtonText}</Button>
                        </Card.Body>
                    </Card>
                )}
            </>)
export default CardShow



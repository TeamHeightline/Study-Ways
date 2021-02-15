import * as React from 'react';
import {requestCardContent, CardPresentView} from '../InsteadOfDatabase/mainCard';
import {Button, Card} from "react-bootstrap";


export {CardShow}

class CardShow extends React.Component {
    render() {
        return (
            <>
                {requestCardContent.map((card: CardPresentView, cardIndex:number) =>
                    <Card style={{width: '18rem'}} className="mr-2  mt-3" key={cardIndex}>
                        <Card.Img variant="top" src={card.cardImgUrl}/>
                        <Card.Body>
                            <Card.Title>{card.cardTitle}</Card.Title>
                            <Card.Text>
                                {card.cardText}
                            </Card.Text>
                            <Button variant="primary" href={card.cardHref}>{card.cardButtonText}</Button>
                        </Card.Body>
                    </Card>
                )}
            </>
        )
    }
}

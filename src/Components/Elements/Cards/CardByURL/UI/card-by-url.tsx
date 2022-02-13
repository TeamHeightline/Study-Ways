import {observer} from "mobx-react";
import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import CardByID from "../../CardByID/UI/card-by-id";

interface RouteProps {
    id?: string
}

interface ICardByURLProps extends RouteComponentProps<RouteProps> {

}

const CardByURL = observer(({...props}: ICardByURLProps) => {
    const id_from_url = props.match.params.id;

    return (
        <div>
            <CardByID card_id={Number(id_from_url)}/>
        </div>
    )
})

export default CardByURL
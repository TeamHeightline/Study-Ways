import {observer} from "mobx-react";
import React from 'react';
import {useParams} from "react-router-dom";
import CardByID from "../../CardByID/UI/card-by-id";


interface ICardByURLProps {

}

const CardByURL = observer(({...props}: ICardByURLProps) => {
    const {id} = useParams();

    return (
        <div>
            <CardByID card_id={Number(id)}/>
        </div>
    )
})

export default CardByURL
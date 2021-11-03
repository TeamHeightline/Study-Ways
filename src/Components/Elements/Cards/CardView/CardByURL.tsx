import {CARD} from "../Card";
import React from 'react';
import {useHistory} from "react-router-dom";


export default function CardByURL(props: any){
    const history = useHistory();
    const id_from_url = props.match.params.id;
    if(!id_from_url){
        history.push('/cards')
    }
    return(
        <div>
            <CARD id={id_from_url}/>
        </div>
    )

}
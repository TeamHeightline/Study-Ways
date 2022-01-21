import React from 'react'

import {observer} from "mobx-react";
import {CardSelector} from "../Elements/Cards/Selector/UI/CardSelector";
import {useHistory} from "react-router-dom";

export const MainCardPublicView = observer(() => {
    const history = useHistory();
    return (
        <div >
            <CardSelector onCardSelect={(card_id) => {
                history.push("/card/" + card_id)
            }}/>
        </div>
    );
})
import {observer} from "mobx-react";
import React from 'react';
import {EditCardByID} from "../EditorByIDV2/EditCardByID";
import {useParams} from "react-router-dom";


interface ComponentProp {

}

export const EditCardByUrl = observer(({...props}: ComponentProp) => {
    const {id} = useParams();
    return (
        <div {...props}>
            <EditCardByID id={id}/>
        </div>
    )
})
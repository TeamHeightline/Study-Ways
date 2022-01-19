import {observer} from "mobx-react";
import React from 'react';
import {EditCardByID} from "../EditorByIDV2/EditCardByID";
import {RouteComponentProps} from "react-router-dom";

interface RouteProps{
    id?: string
}
interface ComponentProp extends  RouteComponentProps<RouteProps> {

}
export const EditCardByUrl = observer(({...props}: ComponentProp) =>{
    return(
        <div {...props}>
            <EditCardByID id={props.match.params.id}/>
        </div>
    )
})
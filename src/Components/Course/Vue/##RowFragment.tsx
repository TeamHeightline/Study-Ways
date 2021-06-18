import React from 'react';
import {Button} from "@material-ui/core";
import './RowFragment.css'
export default function RowFragment({rowFragment, ...props}: any){

    return(
        <>
            {rowFragment.CourseFragment.map((element, eIndex) =>{
                if(props.cardPositionData && props.cardPositionData.row === props.CRI && props.cardPositionData.fragment === props.rIndex
                    && eIndex ===props.cardPositionData.buttonIndex){
                        console.log(true)
                }

                return(
                    <Button className="ml-1 mt-1" color={"primary"}
                            variant={element?.CourseElement?.id ?
                                props.cardPositionData && props.cardPositionData.row === props.CRI && props.cardPositionData.fragment === props.rIndex
                                && eIndex ===props.cardPositionData.buttonIndex ?
                                    "contained": "outlined": "text"}
                            onClick={() =>{
                                props.buttonClick(eIndex)
                                // console.log(eIndex + "CourseFragment" + props.rIndex + "RowFragment" + props.CRI + "NavigationRow")
                            }}

                            key={eIndex + "CourseFragment" + props.rIndex + "RowFragment" + props.CRI + "NavigationRow"}>
                        {element?.CourseElement?.id ? element?.CourseElement?.id : <br/>}
                    </Button>
                )
            })}
        </>
    )
}
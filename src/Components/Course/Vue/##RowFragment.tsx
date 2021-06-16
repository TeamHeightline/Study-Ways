import React from 'react';
import {Button} from "@material-ui/core";
import './RowFragment.css'
export default function RowFragment({rowFragment, ...props}: any){
    // console.log(rowFragment)
    return(
        <>
            {rowFragment.CourseFragment.map((element, eIndex) =>{
                return(
                    <Button className="ml-1 mt-1" color={element?.CourseElement?.id ? "primary" : "primary"}
                            variant={element?.CourseElement?.id ? "outlined": "text"}
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
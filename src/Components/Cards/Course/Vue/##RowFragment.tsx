import React from 'react';
import {Button} from "@material-ui/core";
import './RowFragment.css'
export default function RowFragment({rowFragment, ...props}: any){
    console.log(rowFragment)
    return(
        <>
            {rowFragment.CourseFragment.map((element) =>{
                return(
                    <Button className="ml-1 mt-1" color={element?.CourseElement?.id ? "primary" : "primary"}
                            variant={element?.CourseElement?.id ? "outlined": "text"}
                            key={element+ "CourseFragment"}>
                        {element?.CourseElement?.id ? element?.CourseElement?.id : <br/>}
                    </Button>
                )
            })}
        </>
    )
}
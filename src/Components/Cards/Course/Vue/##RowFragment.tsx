import React from 'react';
import {Button} from "@material-ui/core";
export default function RowFragment(){
    return(
        <>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((element) =>{
                return(
                    <Button className="ml-1 mt-1" color="primary" variant="outlined"  key={element+ "Key2"}>{element * 100}</Button>
                )
            })}
        </>
    )
}
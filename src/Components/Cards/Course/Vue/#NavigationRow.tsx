import React from 'react'
import {Button} from "@material-ui/core";
import {Row} from "antd";
import RowFragment from "./##RowFragment";

export default function NavigationRow({courseRow, ...props}: any){
    // console.log(courseRow)
    return(
        <Row style={{width: 830 * courseRow.SameLine.length}}>
            {courseRow.SameLine.map((rowFragment, rIndex) =>{
                return(
                    <RowFragment key={rIndex} rowFragment={rowFragment}/>
                )
            })}
            {/*<RowFragment/>*/}
        </Row>
    )
}
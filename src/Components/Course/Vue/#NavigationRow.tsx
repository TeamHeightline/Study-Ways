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
                    <RowFragment buttonClick={(data) =>{
                        // console.log(data)
                        props.buttonClick({
                            buttonIndex: data,
                            fragment: rIndex,
                        })
                    }} key={rIndex + "RowFragment" + props.CRI + "NavigationRow"}
                                 CRI={props.CRI}
                                 rIndex={rIndex}
                                 rowFragment={rowFragment}
                                 cardPositionData={props.cardPositionData}
                                 inCardNavigationMode={props.inCardNavigationMode}/>
                )
            })}
            {/*<RowFragment/>*/}
        </Row>
    )
}
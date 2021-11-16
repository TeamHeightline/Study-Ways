import React from 'react'
import RowFragment from "./##RowFragment";

export default function NavigationRow({courseRow, openPage, ...props}: any){
    // console.log(courseRow)
    return(
        <div>
            <RowFragment
                buttonClick={(data) =>{
                    props.buttonClick({
                    buttonIndex: data,
                    fragment: openPage -1,
                    })
                }}
                key={openPage - 1 + "RowFragment" + props.CRI + "NavigationRow"}
                CRI={props.CRI}
                rIndex={openPage -1}
                rowFragment={courseRow.SameLine[openPage - 1]}
                cardPositionData={props.cardPositionData}/>

        </div>
    )
}
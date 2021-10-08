import React from 'react';
import { IconButton} from "@material-ui/core";
import './RowFragment.css'
import StopSharpIcon from '@material-ui/icons/StopSharp';
export default function RowFragment({rowFragment, ...props}: any){

    return(
        <>
            {rowFragment.CourseFragment.map((element, eIndex) =>{
                return(
                    <IconButton size="small"
                                edge="start"
                                key={eIndex + "CourseFragment" + props.rIndex + "RowFragment" + props.CRI + "NavigationRow"}
                                onClick={() =>{
                                    props.buttonClick(eIndex)
                                }}
                                style={{color: !element?.CourseElement?.id ? "#0A1929" : ''}}
                                disabled={!element?.CourseElement?.id}
                                color={
                                    // !element?.CourseElement?.id? "inherit" :
                                    props.cardPositionData && props.cardPositionData.row === props.CRI && props.cardPositionData.fragment === props.rIndex
                                    && eIndex ===props.cardPositionData.buttonIndex ?
                                        "secondary":
                                        "primary"}
                    >
                        <StopSharpIcon/>
                    </IconButton>
                )
            })}
        </>
    )
}
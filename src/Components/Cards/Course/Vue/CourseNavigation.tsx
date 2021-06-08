import React from 'react';
import {Row} from "antd";
import {Button} from "@material-ui/core";
import NavigationRow from "./#NavigationRow";
export default function CourseNavigation({...props}: any){
    return(
        <div style={{width: 820, overflowY: "scroll", marginBottom:5}}>
            <NavigationRow/>
            <NavigationRow/>
            <NavigationRow/>
            <NavigationRow/>
        </div>
    )
}
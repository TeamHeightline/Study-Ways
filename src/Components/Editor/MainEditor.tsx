import React, {useMemo, useState} from "react";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {AddIcon} from "@material-ui/data-grid";
import {ViewList} from "@material-ui/icons";
import CreatePoint from "./CreatePoint";
import UpdateQuestion from "./UpdateQuestion";
import {Alert} from "@material-ui/lab";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {gql, useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";

const CHECK_USER_LEVEL = gql`
query CHECK_USER_LEVEL{
      me{
        id
        isStaff
        userAccessLevel
      }
    }`


export default function MainEditor(){
    const [value, setValue] = React.useState(0);
    const {data: check_level_data, error: check_error} = useQuery(CHECK_USER_LEVEL,{
        pollInterval: 10000
    })
    if (!check_level_data){
        return(
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (check_level_data.me.userAccessLevel !== "ADMIN" && check_level_data.me.userAccessLevel !== "TEACHER"){
        return (
            <Alert severity="error">
                <AlertTitle>Доступ ограничен</AlertTitle>
                Вы не обладаете достаточными правами, чтобы просматривать этот раздел, для дополнитльной информации обратитесь к администрации
            </Alert>
        )
    }
    return (
        <div>
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className="col-12"
        >
            <BottomNavigationAction label="Создание вопроса" icon={ <AddIcon />} />
            <BottomNavigationAction label="Редактор вопроса" icon={<ViewList />} />
        </BottomNavigation>
        {value === 0 ? <CreatePoint/>: <UpdateQuestion/>}
        </div>
    );
}
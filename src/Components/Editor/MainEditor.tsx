import React, {useMemo, useState} from "react";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {AddIcon} from "@material-ui/data-grid";
import {ViewList} from "@material-ui/icons";
import CreatePoint from "./CreatePoint";
import UpdateQuestion from "./UpdateQuestion";

export default function MainEditor(){
    const [value, setValue] = React.useState(0);


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
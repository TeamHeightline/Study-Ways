import {observer} from "mobx-react";
import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {CardHardLevel} from "../../../../SchemaTypes";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import FunctionsIcon from "@mui/icons-material/Functions";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import {CSSObject} from "../Store/CardSelectorStore";

interface IHardLevelProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const HardLevel = observer(({...props}: IHardLevelProps) =>{
    return(
        <FormControl variant="outlined" fullWidth>
            <InputLabel>Уровень сложности</InputLabel>
            <Select value={CSSObject.hardLevel}
                    onChange={CSSObject.changeHardLevel}
                    fullWidth
                    label={"Уровень сложности"}>
                <MenuItem value={"undefined"}>
                    Все
                </MenuItem>
                <MenuItem value={CardHardLevel.A_0}>
                    <ArchitectureIcon style={{marginRight: 12}}  fontSize="small"  />
                    Выпускникам школ
                </MenuItem>
                <MenuItem value={CardHardLevel.A_1}>
                    <FunctionsIcon style={{marginRight: 12}}  fontSize="small"  />
                    Успешным лицеистам и гимназистам
                </MenuItem>
                <MenuItem value={CardHardLevel.A_2}>
                    <SchoolIcon style={{marginRight: 12}}  fontSize="small"  />
                    Рядовым студентам
                </MenuItem>
                <MenuItem value={CardHardLevel.A_3}>
                    <ScienceIcon style={{marginRight: 12}}  fontSize="small"  />
                    Будущим специалистам
                </MenuItem>
                <MenuItem value={CardHardLevel.A_4}>
                    <BiotechIcon style={{marginRight: 12}}  fontSize="small"  />
                    Специалистам (Real Science)
                </MenuItem>
            </Select>
        </FormControl>
    )
})

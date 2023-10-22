import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import FunctionsIcon from "@mui/icons-material/Functions";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import React from "react";
import {AISObject} from "../Store/AISearch";
import {observer} from "mobx-react";
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface IAIHardLevelFilterProps extends BoxProps {

}

const AIHardLevelFilter = observer(({...props}: IAIHardLevelFilterProps) => {
        return (
            <FormControl variant="outlined" fullWidth size={"small"}>
                <InputLabel>Уровень сложности</InputLabel>
                <Select value={AISObject.hardLevel}
                        onChange={AISObject.changeHardLevel}
                        fullWidth
                        label={"Уровень сложности"}>
                    <MenuItem value={-1}>
                        <DoneAllIcon style={{marginRight: 12}} fontSize="small"/>
                        Все
                    </MenuItem>
                    <MenuItem value={0}>
                        <ArchitectureIcon style={{marginRight: 12}} fontSize="small"/>
                        Выпускникам школ
                    </MenuItem>
                    <MenuItem value={1}>
                        <FunctionsIcon style={{marginRight: 12}} fontSize="small"/>
                        Успешным лицеистам и гимназистам
                    </MenuItem>
                    <MenuItem value={2}>
                        <SchoolIcon style={{marginRight: 12}} fontSize="small"/>
                        Рядовым студентам
                    </MenuItem>
                    <MenuItem value={3}>
                        <ScienceIcon style={{marginRight: 12}} fontSize="small"/>
                        Будущим специалистам
                    </MenuItem>
                    <MenuItem value={4}>
                        <BiotechIcon style={{marginRight: 12}} fontSize="small"/>
                        Специалистам (Real Science)
                    </MenuItem>
                </Select>
            </FormControl>
        )
    }
)

export default AIHardLevelFilter;

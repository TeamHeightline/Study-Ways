import {observer} from "mobx-react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useState} from "react";
import {CardHardLevel} from "../../../../../SchemaTypes";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import FunctionsIcon from "@mui/icons-material/Functions";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";

export const HardLevelSelector = observer(({cards_data, changeSelectedData}) =>{
    const [cardHardLevel, setCardHardLevel] = useState<CardHardLevel>(CardHardLevel.A_2)
    const cardHardLevelHandler = (e) => {
        setCardHardLevel(e.target.value)
    }
    return(
        <div>
            <FormControl variant="outlined" fullWidth>
                <InputLabel>Уровень сложности</InputLabel>
                <Select value={cardHardLevel}
                        onChange={cardHardLevelHandler}
                        fullWidth
                        label={"Уровень сложности"}>
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

        </div>
    )
})
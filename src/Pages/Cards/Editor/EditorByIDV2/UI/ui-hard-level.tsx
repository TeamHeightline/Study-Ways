import {observer} from "mobx-react";
import React from 'react';
import {FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import {CardHardLevel} from "../../../../../SchemaTypes";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import FunctionsIcon from "@mui/icons-material/Functions";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import BiotechIcon from "@mui/icons-material/Biotech";
import {CESObject} from "../Store/CardEditorStorage";

interface IHardLevelProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const HardLevel = observer(({...props}: IHardLevelProps) => {
    return (
        <div {...props}>
            <FormControl variant="filled" fullWidth>
                <InputLabel>Уровень сложности</InputLabel>
                <Select value={CESObject.getField("hard_level", 2)}
                        onChange={CESObject.changeField("hard_level")}
                        fullWidth
                        label={"Уровень сложности"}>
                    <MenuItem value={0}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <ArchitectureIcon fontSize="small"/>
                            <div>
                                Выпускникам школ
                            </div>
                        </Stack>
                    </MenuItem>
                    <MenuItem value={1}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <FunctionsIcon fontSize="small"/>
                            <div style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                Успешным лицеистам и гимназистам
                            </div>
                        </Stack>
                    </MenuItem>
                    <MenuItem value={2}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <SchoolIcon fontSize="small"/>
                            <div>
                                Рядовым студентам
                            </div>
                        </Stack>
                    </MenuItem>
                    <MenuItem value={3}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <ScienceIcon fontSize="small"/>
                            <div>
                                Будущим специалистам
                            </div>
                        </Stack>
                    </MenuItem>
                    <MenuItem value={4}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <BiotechIcon fontSize="small"/>
                            <div>
                                Специалистам (Real Science)
                            </div>
                        </Stack>
                    </MenuItem>
                </Select>
            </FormControl>

        </div>
    )
})

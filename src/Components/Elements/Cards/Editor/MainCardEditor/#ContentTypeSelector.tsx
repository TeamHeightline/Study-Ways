import React, {useEffect, useState} from 'react'
import Typography from "@mui/material/Typography";
import _ from 'lodash'
import {observer} from "mobx-react";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";

export const  ContentTypeSelector = observer(({cards_data, ...props}: any) =>{
    const [selectedContentType, setSelectedContentType] = useState<any>(1000000)
    function makeFiltering(){
        if (Number(selectedContentType) != 1000000) {
            props.ChangeSelectedData(_.filter(cards_data, {'cardContentType': "A_" + selectedContentType}))
        } else {
            props.ChangeSelectedData(cards_data)
        }
    }
    useEffect(() =>{
        makeFiltering()
       }, [cards_data])

    return(
        <Stack direction={"row"} {...props}>
            <Typography variant="h6" gutterBottom style={{marginTop: 6}}>
                Тип:
            </Typography>
            <div style={{paddingLeft: 12}}>
                <Select
                    fullWidth
                    style={{minWidth: 200, maxWidth: 600, }}
                    label=""
                    value={!props?.openFromPublicView ? selectedContentType: CardPageStorage.selectedContentType}
                    onChange={(event) => {
                        if(!props?.openFromPublicView){
                            setSelectedContentType(event.target.value)
                            if (Number(event.target.value) != 1000000) {
                                props.ChangeSelectedData(_.filter(cards_data, {'cardContentType': "A_" + event.target.value}))
                            } else {
                                props.ChangeSelectedData(cards_data)
                            }
                        }else{
                            CardPageStorage.changeContentType(event.target.value)
                        }
                    }}
                >
                    <MenuItem value={1000000}>Не выбран</MenuItem>
                    <MenuItem value={0}>YouTube</MenuItem>
                    <MenuItem value={1}>Внешний ресурс</MenuItem>
                    <MenuItem value={2}>Изображение</MenuItem>
                </Select>
            </div>
        </Stack>
    )
})
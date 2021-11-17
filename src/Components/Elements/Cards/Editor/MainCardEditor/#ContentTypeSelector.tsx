import React, {useEffect, useState} from 'react'
import {filter} from 'lodash'
import {observer} from "mobx-react";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {CardNode} from "../../../../../SchemaTypes";

interface ContentTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    cards_data?: CardNode[],
    openFromPublicView?: boolean,
    changeSelectedData?: any,
}

export const ContentTypeSelector = observer(({
                                                 cards_data,
                                                 openFromPublicView,
                                                 changeSelectedData,
                                                 ...props
                                             }: ContentTypeSelectorProps) => {
    const [selectedContentType, setSelectedContentType] = useState<any>(1000000)

    function makeFiltering() {
        if (Number(selectedContentType) != 1000000) {
            changeSelectedData(filter(cards_data, {'cardContentType': "A_" + selectedContentType}))
        } else {
            changeSelectedData(cards_data)
        }
    }

    useEffect(() => {
        makeFiltering()
    }, [cards_data])

    return (
        <div {...props} >
            <FormControl fullWidth>
                <InputLabel>Тип карточки:</InputLabel>
                <Select
                    fullWidth
                    style={{width: "100%", maxWidth: 600,}}
                    label="Тип карточки:"
                    value={!openFromPublicView ? selectedContentType : CardPageStorage.selectedContentType}
                    onChange={(event) => {
                        if (!openFromPublicView) {
                            setSelectedContentType(event.target.value)
                            if (Number(event.target.value) != 1000000) {
                                changeSelectedData(filter(cards_data, {'cardContentType': "A_" + event.target.value}))
                            } else {
                                changeSelectedData(cards_data)
                            }
                        } else {
                            CardPageStorage.changeContentType(event.target.value)
                        }
                    }}
                >
                    <MenuItem value={1000000}>Не выбран</MenuItem>
                    <MenuItem value={0}>YouTube</MenuItem>
                    <MenuItem value={1}>Внешний ресурс</MenuItem>
                    <MenuItem value={2}>Изображение</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
})
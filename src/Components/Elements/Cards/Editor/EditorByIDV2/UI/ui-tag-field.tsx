import {observer} from "mobx-react";
import React, {useState} from 'react';
import {Autocomplete} from "@mui/lab";
import {Button, Chip, Collapse, TextField} from "@mui/material";
import {CESObject} from "../Store/CardEditorStorage";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ITagFieldProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiTagField = observer(({...props}: ITagFieldProps) => {
    const [showTags, setShowTags] = useState(false)
    return (
        <div {...props}>
            <Button
                onClick={() => {
                    setShowTags(!showTags)
                }}
                variant="outlined"
                size={"small"}
                endIcon={<ArrowDropDownIcon/>}
            >
                Показать поле для тегов
            </Button>
            <Collapse in={showTags} sx={{pt: 1}}>
                <Autocomplete
                    multiple
                    id="search-tag"
                    options={[]}
                    defaultValue={CESObject.DefaultTagValue}
                    freeSolo
                    onChange={(event: any, newValue) => {
                        CESObject.updateTagField(newValue)
                    }}
                    renderTags={(value, getTagProps) =>
                        value?.map((option, index: number) => (
                            <Chip variant="outlined" label={option} {...getTagProps({index})} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Поисковые теги"
                        />
                    )}
                />

            </Collapse>
        </div>
    )
})

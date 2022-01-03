import {observer} from "mobx-react";
import React, {useState} from 'react';
import {Autocomplete} from "@mui/lab";
import {Button, Chip, Collapse, TextField} from "@mui/material";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface ITagFieldProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const TagField = observer(({...props}: ITagFieldProps) =>{
    const [showTags, setShowTags] = useState(false)
    return(
        <div {...props}>
            <Button
                onClick={() =>{setShowTags(!showTags)}}
                variant="text"
            >
                Показать поле для тегов
            </Button>
            <Collapse in={showTags}>
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
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
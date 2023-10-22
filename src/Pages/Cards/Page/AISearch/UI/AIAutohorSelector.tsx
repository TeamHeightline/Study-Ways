import {Autocomplete, TextField} from "@mui/material";
import {useEffect} from "react";
import {AISObject} from "../Store/AISearch";

export default function AIAuthorSelector(props) {
    useEffect(() => {
        AISObject.loadCardAuthors();
    }, [])
    return (
        <Autocomplete
            disablePortal
            size={"small"}
            onChange={(event, value) => {
                AISObject.changeCardAuthor(value);
            }}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.id}>
                        {option.label}
                    </li>
                );
            }}
            options={AISObject.cardAuthorsForSelector}
            fullWidth
            renderInput={(params) => <TextField  {...params} label="Автор"/>}
        />
    )
}

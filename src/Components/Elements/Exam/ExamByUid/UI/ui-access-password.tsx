import {Box, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";

interface IUIAccessPasswordProps extends BoxProps {

}

export default function UIAccessPassword({...props}: IUIAccessPasswordProps) {
    // co
    return (
        <Box {...props}>
            <TextField>

            </TextField>
        </Box>
    )
}

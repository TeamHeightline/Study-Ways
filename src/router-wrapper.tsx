import {Box} from "@mui/material";

export function RouterWrapper(props) {
    return (
        <Box sx={{width: '100vw', display: 'flex', justifyContent: 'center'}}>
            <Box sx={{flex: 1, width: '100%', maxWidth: 1200}}>
                {props.children}
            </Box>
        </Box>
    )
}
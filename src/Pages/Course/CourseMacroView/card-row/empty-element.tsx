import {Box} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";

interface IEmptyElementProps extends BoxProps {
    size: any
}

export default function EmptyElement({size, ...props}: IEmptyElementProps) {
    return (
        <Box {...props}>
            <Box sx={{border: "2px solid rgba(1,1,1,0)"}}>
                <Box sx={size}/>
            </Box>
        </Box>
    )
}

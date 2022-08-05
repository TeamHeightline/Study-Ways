import {Box, IconButton, InputAdornment, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";

interface IUIPasswordProps extends BoxProps {

}

export default function UIPassword({...props}: IUIPasswordProps) {
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    return (
        <Box {...props}>
            <TextField label="Пароль" variant="standard"
                       type={showPassword ? 'text' : 'password'}
                       fullWidth
                       id={"exam-password"}

                       InputProps={{
                           endAdornment:
                               <InputAdornment position="end">
                                   <IconButton
                                       onClick={handleClickShowPassword}
                                       edge="end"
                                   >
                                       {showPassword ? <VisibilityOff/> : <Visibility/>}
                                   </IconButton>
                               </InputAdornment>
                       }}/>
        </Box>
    )
}

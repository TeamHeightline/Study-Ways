import {Box, IconButton, InputAdornment, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {RootState, useAppDispatch} from "../../../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";
import {changePassword} from "../redux-store/examEditorSlice";

interface IUIPasswordProps extends BoxProps {

}

export default function UIPassword({...props}: IUIPasswordProps) {
    const dispatch = useAppDispatch()
    const password = useSelector((state: RootState) => state?.examEditor?.exam_data?.password) || "";

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
                       value={password}
                       onChange={(e) => {
                           dispatch(changePassword(e.target.value))
                       }
                       }
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

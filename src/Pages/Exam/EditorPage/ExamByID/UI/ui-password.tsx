import {Box, IconButton, InputAdornment, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useEffect, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {RootState, useAppDispatch} from "../../../../../App/ReduxStore/RootStore";
import {useSelector} from "react-redux";
import {changeOriginalPassword, changePassword} from "../redux-store/examEditorSlice";
import CryptoJS from "crypto-js";

interface IUIPasswordProps extends BoxProps {

}

export default function UIPassword({...props}: IUIPasswordProps) {
    const dispatch = useAppDispatch()
    const is_enable_password_check = useSelector((state: RootState) => state?.examEditor?.exam_data?.is_enable_password_check) || false;
    const original_password = useSelector((state: RootState) => state?.examEditor?.original_password) || "";

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    useEffect(() => {
        const encryptedPassword = CryptoJS.AES.encrypt(original_password, "sw-secret-key").toString()
        dispatch(changePassword(encryptedPassword))
    }, [original_password])

    return (
        <Box {...props}>
            <TextField label="Пароль" variant="standard"
                       type={showPassword ? 'text' : 'password'}
                       fullWidth
                       id={"exam-password"}
                       value={original_password}
                       onChange={(e) => {
                           dispatch(changeOriginalPassword(e.target.value))
                       }}
                       disabled={!is_enable_password_check}
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

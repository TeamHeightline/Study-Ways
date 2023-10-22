import {Alert, Box, Stack, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../root-redux-store/RootStore";
import {setAccessPassword} from "../redux-store/ExamPlayerSlice";

interface IUIAccessPasswordProps extends BoxProps {

}

export default function UIAccessPassword({...props}: IUIAccessPasswordProps) {
    const dispatch = useAppDispatch()
    const access_password = useAppSelector((state) => state.examPlayer?.access_password)

    const onPasswordChange = (e) => {
        dispatch(setAccessPassword(e.target.value))
    }
    return (
        <Box {...props}>
            <Stack alignItems={"center"}>
                <Box sx={{maxWidth: 400}}>
                    <Alert severity={"warning"} variant={"filled"}>
                        Для доступа к этому экзамену необходимо ввести пароль
                    </Alert>
                    <TextField onChange={onPasswordChange} id="outlined-basic"
                               sx={{mt: 2}}
                               label="Пароль" variant="outlined" value={access_password}/>
                </Box>
            </Stack>

        </Box>
    )
}

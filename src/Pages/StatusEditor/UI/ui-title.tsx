import {Paper, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";

interface IUITitleProps extends PaperProps {

}

export default function UITitle({...props}: IUITitleProps) {
    return (
        <Paper elevation={0} {...props}>
            <Stack alignItems={"center"} sx={{mt: 4, mb: 4}}>
                <Typography variant={"h4"}>
                    Редактор статусов
                </Typography>
            </Stack>
        </Paper>
    )
}

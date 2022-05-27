import {FormControlLabel, Paper, Switch} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";

interface IUIAccessTypeManualProps extends PaperProps {

}

export default function UIAccessTypeManual({...props}: IUIAccessTypeManualProps) {
    return (
        <Paper elevation={0} {...props}>
            <FormControlLabel control={<Switch defaultChecked/>} label="Доступ открыт"/>
        </Paper>
    )
}

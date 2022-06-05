import {Card, Chip, Grid, Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

interface IUIExamQuestionProgressProps extends PaperProps {

}

export default function UIExamQuestionProgress({...props}: IUIExamQuestionProgressProps) {
    const handleClick = () => {
        return void (0)
    }
    return (
        <Paper elevation={0} {...props}>
            <Card variant={"outlined"} sx={{p: 2, maxWidth: 440, mt: 2, ml: 2, zoom: "115%"}}>
                <Grid container spacing={2} justifyContent={"evenly"}>
                    <Grid item xs={4}>
                        <Chip label={"Question 1"} variant={"outlined"} onClick={handleClick}
                              icon={<RadioButtonUncheckedIcon/>}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Chip label={"Question 1"} variant={"outlined"} onClick={handleClick}
                              color={"success"} disabled icon={<DoneIcon/>}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Chip label={"Question 1"} variant={"outlined"} onClick={handleClick}
                              icon={<RadioButtonUncheckedIcon/>}/>
                    </Grid>

                    <Grid item xs={4}>
                        <Chip label={"Question 1"} onClick={handleClick} color={"primary"}
                              icon={<RadioButtonCheckedIcon/>}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Chip label={"Question 1"} variant={"outlined"} onClick={handleClick}
                              color={"error"} disabled icon={<CloseIcon/>}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Chip label={"Question 1"} variant={"outlined"} onClick={handleClick}
                              color={"success"} disabled icon={<DoneIcon/>}/>
                    </Grid>


                </Grid>
            </Card>
        </Paper>
    )
}

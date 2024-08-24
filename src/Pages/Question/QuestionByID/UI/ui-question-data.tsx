import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    Paper,
    Stack
} from "@mui/material";
import React, {useState} from "react";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";

export default function UiQuestionData(props: any) {
    const [openAcceptDefeatDialog, setOpenAcceptDefeatDialog] = useState(false)
    const [disableCheckButton, setDisableCheckButton] = useState(false)
    const isMobile = isMobileHook()
    window.addEventListener("keydown", function (e) {
        if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
            e.preventDefault();
        }
    })

    return <Paper elevation={0} sx={{px: {sm: 1}}}>
        {(!isMobile || props.ignoreAspectRatio) &&
            <Card variant="outlined"
                  sx={{
                      padding: 0,
                      minHeight: {xs: "100%", md: 510},
                      overflowY: "auto",
                      width: "100%"
                  }}>
                <Grid container justifyContent={"center"}>
                    {props.questionImgUrl &&
                        <Grid item xs={12} md={6} sx={{flexGrow: 1, display: "flex"}}>
                            <CardMedia
                                style={{
                                    backgroundSize: "contain",
                                    minWidth: "100%",
                                    minHeight: "100%",
                                    aspectRatio: 16 / 9
                                }}
                                image={props.questionImgUrl}
                            />
                        </Grid>}
                    <Grid item xs={12} md={6} sx={{height: {xs: "100%", md: 500}, width: "100%"}}>
                        <CardContent sx={{height: "100%"}}>
                            <Grid sx={{height: "100%"}} container alignItems="center">
                                <Grid item xs={12} spacing={2}>
                                    <Typography component="h5" variant="h5">
                                        Вопрос
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" component="p"
                                                style={{userSelect: "none", content: "Foobar"}}>
                                        {props.questionData?.questionById?.text ? props.questionData?.questionById?.text : props.questionText}
                                    </Typography>
                                    {props.id && props.onChange &&
                                        <Button
                                            fullWidth sx={{mt: 1}} variant="outlined" color="primary"
                                            onClick={props.onClick}>
                                            Назад
                                        </Button>}
                                    <Stack direction={"row"} spacing={1} sx={{mt: 1}}>
                                        <Button
                                            disabled={disableCheckButton}
                                            variant="contained" color="primary"
                                            onClick={(e) => {
                                                props.onClick1(e)
                                                setDisableCheckButton(true)
                                                setTimeout(setDisableCheckButton, 1000, false)
                                            }} fullWidth>
                                            Проверить
                                        </Button>
                                        <Button variant="outlined" color="secondary"
                                                onClick={() => setOpenAcceptDefeatDialog(true)} fullWidth>
                                            Сдаться
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>}
        {props.showNotUseScrollbarCheckbox &&
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.isNotUseScrollbar}
                        onChange={(e) => props.setIsNotUseScrollbar(e.target.checked)}
                        color="primary"
                    />
                }
                label="Использовать ScrollBar"
            />}
        <Dialog
            onClose={() => setOpenAcceptDefeatDialog(false)}
            open={openAcceptDefeatDialog}
        >
            <DialogTitle>
                {"Вы уверены, что хотите сдаться?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Если этот вопрос является частью серии вопросов, мы советуем Вам заняться другими вопросами и
                    вернуться к этому позже
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={() => props?.onAcceptDefeat()}>Сдаться</Button>
                <Button onClick={() => setOpenAcceptDefeatDialog(false)}>Отмена
                </Button>
            </DialogActions>
        </Dialog>
    </Paper>;
}

import Card from "@mui/material/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
    Button,
    Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel, Stack
} from "@mui/material";
import React, {useState} from "react";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";

export default function DCPCImageQuestion(props: any) {
    const [openAcceptDefeatDialog, setOpenAcceptDefeatDialog] = useState(false)
    const isMobile = isMobileHook()
    window.addEventListener("keydown",function (e) {
        if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
            e.preventDefault();
        }
    })

    return <div className="col-12">
        {(!isMobile || props.ignoreAspectRatio) &&
        <Card variant="outlined"
              style={{ padding: 0,
                  maxHeight: isMobile ? window.innerWidth * 2: 510,
                  overflowY: "auto",}}
              className="col-12 ">
            <Row className="justify-content-center">
                {props.questionImgUrl ?
                    <Col className={!props?.ignoreAspectRatio ? "col-6 justify-content-start":
                        isMobile ? "col-12 justify-content-start" : "col-6 justify-content-start"}>
                    <CardMedia
                        className="col-12 mr-auto"
                        style={{
                            height: isMobile ?  window.innerWidth -100 : 500,
                            backgroundSize: "contain",
                            maxHeight: isMobile ? window.innerWidth : 500,
                            overflowY: "auto",
                            width: "100%"
                        }}
                        image={props.questionImgUrl}
                    />
                </Col> : null}
                <Col
                    className={!props?.ignoreAspectRatio ? "col-6": isMobile ? "col-12" : "col-6"}
                    style={{height: isMobile ? window.innerWidth -100 : 500, width: "100%"}} >
                    <CardContent>
                        <Typography component="h5" variant="h5">
                            Вопрос
                        </Typography>
                        <Typography variant="body1" color="textSecondary" component="p" style={{userSelect: "none", content: "Foobar"}}>
                            {props.questionData?.questionById?.text ? props.questionData?.questionById?.text : props.questionText}
                        </Typography>
                        {props.id && props.onChange &&
                            <Button
                                className="col-12 mt-2" variant="outlined" color="primary" onClick={props.onClick}>
                                Назад
                            </Button>}

                        <Stack direction={"row"} spacing={1}>
                            <Button variant="contained" color="primary" onClick={props.onClick1} fullWidth>
                                Проверить
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => setOpenAcceptDefeatDialog(true)} fullWidth>
                                Сдаться
                            </Button>
                        </Stack>
                    </CardContent>
                </Col>
            </Row>
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
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Вы уверены, что хотите сдаться?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
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
    </div>;
}

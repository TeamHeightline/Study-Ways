import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Paper, Stack, Typography} from "@mui/material";
import {Alert, AlertTitle} from "@mui/lab";
import {CardByIDStore} from "../Store/CardByIDStore";
import {useLocation, useNavigate} from "react-router-dom";


interface ICardFindInCourseProps extends PaperProps {
    card_store: CardByIDStore
}

const CardFindInCourse = observer(({card_store, ...props}: ICardFindInCourseProps) => {
    const navigate = useNavigate()
    const {pathname} = useLocation();
    const cardNOTFindInCourses = card_store.findInCourseArrayForUI?.length == 0

    if (cardNOTFindInCourses) {
        return <div/>
    }

    return (
        <Paper elevation={0} {...props}>
            <Alert severity="success" variant="outlined" sx={{maxWidth: 550}}>
                <AlertTitle>
                    {card_store.findInCourseArrayForUI?.length == 1 ?
                        "Этот ресурс встречается в курсе:" :
                        "Этот ресурс встречается в курсах:"}
                </AlertTitle>
                {card_store.findInCourseArrayForUI?.map((course) => {
                    return (
                        <Stack direction={"column"}>
                            <Stack direction={"row"} alignItems={"center"} justifyContent={"start"}>
                                <Button title={"Перейти"}
                                        color={"info"}
                                        onClick={() => {
                                            if (pathname == "/course") {
                                                navigate("/course?" + "id=" + course.course_id +
                                                    "&activePage=" + course.position.activePage +
                                                    "&selectedPage=" + course.position.selectedPage +
                                                    "&selectedRow=" + course.position.selectedRow +
                                                    "&selectedIndex=" + course.position.selectedIndex)
                                            } else {
                                                navigate("/course?" + "id=" + course.course_id +
                                                    "&activePage=" + course.position.activePage +
                                                    "&selectedPage=" + course.position.selectedPage +
                                                    "&selectedRow=" + course.position.selectedRow +
                                                    "&selectedIndex=" + course.position.selectedIndex)
                                            }
                                        }}>
                                    Перейти
                                </Button>
                                <Typography variant={"body2"}>{course.course_name}</Typography>
                            </Stack>
                        </Stack>)
                })}
            </Alert>
        </Paper>
    )
})

export default CardFindInCourse

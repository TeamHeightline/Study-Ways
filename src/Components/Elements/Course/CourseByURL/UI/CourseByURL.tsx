import {observer} from "mobx-react";
import React, {useState} from 'react';
import useQueryParams from "../../../../../CustomHooks/useQueryParams";
import {positionDataI} from "../../CourseMicroView/V2/Store/CourseMicroStoreByID";
import CourseMicroView from "../../CourseMicroView/V2/UI/CourseMicroView";
import CardByID from "../../../Cards/CardByID/UI/card-by-id";
import {Box, Stack} from "@mui/material";
import CourseMacroView from "../../CourseMacroView";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

interface ICourseByURLProps extends React.HTMLAttributes<HTMLDivElement> {

}

const CourseByURL = observer(({...props}: ICourseByURLProps) => {
    const [activeCardID, setActiveCardID] = useState<undefined | string>()
    const queryParams = useQueryParams();
    const isMobile = isMobileHook()

    function changeSelectedCardID(new_card_id) {
        if (new_card_id) {
            setActiveCardID(new_card_id)
        }
    }

    const position_data: positionDataI = {
        activePage: Number(queryParams.get("activePage")),
        selectedPage: Number(queryParams.get("selectedPage")),
        selectedIndex: Number(queryParams.get("selectedIndex")),
        selectedRow: Number(queryParams.get("selectedRow"))
    }

    //эти все сплиты ID по "," нужны только для того, что у нас в одной ячейки может быть много
    // значений, разделенных той самой запятой.

    return (
        <Box>
            <Stack direction={"row"}
                   sx={{width: window.innerWidth * String(activeCardID)?.split(",")?.length}} {...props}>
                <Stack direction={"column"}>
                    {!isMobile ?
                        <CourseMacroView courseID={Number(queryParams.get("id"))} positionData={position_data}
                                         onCardSelect={changeSelectedCardID}/> :

                        <CourseMicroView
                            onCardSelect={(card_id) => {
                                changeSelectedCardID(card_id)
                            }}
                            course_id={Number(queryParams.get("id"))}
                            position_data={position_data}
                            showArrowNavigation
                        />}
                    <CardByID card_id={Number(String(activeCardID)?.split(",")[0])}/>
                </Stack>
                {String(activeCardID)?.split(",").map((card_id, index) => {
                    if (index > 0) {
                        return (
                            <CardByID is_hidden_navigation is_hidden_go_back_button card_id={Number(card_id)}
                                      key={card_id + "_" + index}/>
                        )
                    }
                })}

            </Stack>
        </Box>
    )

})

export default CourseByURL

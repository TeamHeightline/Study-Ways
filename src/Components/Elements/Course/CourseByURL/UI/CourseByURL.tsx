import {observer} from "mobx-react";
import React, {useState} from 'react';
import useQueryParams from "../../../../../CustomHooks/useQueryParams";
import {positionDataI} from "../../CourseMicroView/V2/Store/CourseMicroStoreByID";
import CourseMicroView from "../../CourseMicroView/V2/UI/CourseMicroView";
import CardByID from "../../../Cards/CardByID/UI/card-by-id";
import {Stack} from "@mui/material";

interface ICourseByURLProps extends React.HTMLAttributes<HTMLDivElement> {

}

const CourseByURL = observer(({...props}: ICourseByURLProps) => {
    const [activeCardID, setActiveCardID] = useState<undefined | string>()
    const queryParams = useQueryParams();
    const changeSelectedCardID = (new_card_id) => {
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
        <Stack direction={"row"}
               sx={{width: window.innerWidth * String(activeCardID)?.split(",")?.length}} {...props}>
            <CardByID card_id={Number(String(activeCardID)?.split(",")[0])}
                      course_navigation={
                          <CourseMicroView
                              onCardSelect={(card_id) => {
                                  changeSelectedCardID(card_id)
                              }}
                              course_id={Number(queryParams.get("id"))}
                              position_data={position_data}
                              showArrowNavigation
                          />
                      }
            />
            {String(activeCardID)?.split(",").map((card_id, index) => {
                if (index > 0) {
                    return (
                        <CardByID is_hidden_navigation is_hidden_go_back_button card_id={Number(card_id)}
                                  key={card_id + "_" + index}/>
                    )
                }
            })}

        </Stack>
    )

})

export default CourseByURL

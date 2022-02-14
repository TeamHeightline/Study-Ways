import {observer} from "mobx-react";
import React, {useState} from 'react';
import useQueryParams from "../../../../../CustomHooks/useQueryParams";
import {positionDataI} from "../../CourseMicroView/V2/Store/CourseMicroStoreByID";
import CourseMicroView from "../../CourseMicroView/V2/UI/CourseMicroView";
import CardByID from "../../../Cards/CardByID/UI/card-by-id";

interface ICourseByURLProps extends React.HTMLAttributes<HTMLDivElement> {

}

const CourseByURL = observer(({...props}: ICourseByURLProps) => {
    const [activeCardID, setActiveCardID] = useState<undefined | number>()
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
    return (
        <div {...props}>
            <CardByID card_id={Number(activeCardID)}
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

        </div>
    )
})

export default CourseByURL
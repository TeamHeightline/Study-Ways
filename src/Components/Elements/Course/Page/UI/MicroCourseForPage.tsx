import {observer} from "mobx-react";
import React from 'react';
import CourseMicroView from "../../CourseMicroView/V2/UI/CourseMicroView";
import {useHistory, useRouteMatch} from "react-router-dom";
import {positionDataI} from "../../CourseMicroView/V2/Store/CourseMicroStoreByID";

interface IMicroCourseForPageProps extends React.HTMLAttributes<HTMLDivElement>{
    course_id: number,
    position_data?: positionDataI,
    showArrowNavigation?: boolean,
    onCardSelect?: (selected_card_id: number | undefined) => void,
}

const MicroCourseForPage = observer(({
                                         course_id,
                                         position_data,
                                         showArrowNavigation,
                                         onCardSelect,
                                         ...props}: IMicroCourseForPageProps) =>{
    const history = useHistory()
    const { path } = useRouteMatch();
    console.log(path)
    return(
        <div {...props}>
            <CourseMicroView course_id={course_id}
                             showArrowNavigation={showArrowNavigation}
                             position_data={position_data}
                             onCardSelect={onCardSelect}
                             onPosition={(position) =>{
                                 if(path == "/course"){
                                     history.replace("./course?" + "id=" + course_id +
                                         "&activePage="+ position.activePage +
                                         "&selectedPage=" + position.selectedPage +
                                         "&selectedRow=" + position.selectedRow +
                                         "&selectedIndex=" + position.selectedIndex)
                                 } else {
                                     history.push("./course?" + "id=" + course_id +
                                         "&activePage="+ position.activePage +
                                         "&selectedPage=" + position.selectedPage +
                                         "&selectedRow=" + position.selectedRow +
                                         "&selectedIndex=" + position.selectedIndex)
                                 }
            }}/>
        </div>
    )
})

export default MicroCourseForPage
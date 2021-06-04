import React from 'react'
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";
import MainCardEditor from "../../Editor/MainCardEditor/MainCardEditor";
import CourseFragment from "./#CourseFragment";
import CourseRow from "./#CourseRow";

export default function EditCourseByID(){
    return(
        <div className="mt-4 ml-4">
            <div style={{overflowY: "scroll"}} className="ml-5 mr-5">
                <CourseRow/>
                <CourseRow/>
                <CourseRow/>
                <CourseRow/>
            </div>
                <MainCardEditor/>
        </div>
    )
}
// Курс
//      -строка курса
//                     -фрагмент строки (12 штук)
//                                     -редактировать элемент курса
//
//

// ----------------------------------------------------------------|

// Структура данных
// Курс
//     -столбец курса
//                   -элемент курса
//                          -id
//                          -дополнительные поля
// ----------------------------------------------------------------|
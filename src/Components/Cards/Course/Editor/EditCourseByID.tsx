import React, {useState} from 'react'
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";
import MainCardEditor from "../../Editor/MainCardEditor/MainCardEditor";
import CourseFragment from "./#CourseFragment";
import CourseRow from "./#CourseRow";

export default function EditCourseByID({course_id}: any){
    const [CourseLinesData, setCourseLineData] = useState(CourseLines)
    return(
        <div className="mt-4 ml-4">
            <div style={{overflowY: "scroll"}} className="ml-5 mr-5">
                {CourseLinesData.map((line, lIndex) =>{
                    return(
                        <CourseRow key={lIndex} row={line}
                                   updateCourseRow={new_row =>{
                                        const newRowsData = CourseLinesData
                                        newRowsData[lIndex] = new_row
                                        // console.log(newRowsData)
                                        setCourseLineData(newRowsData)
                        }}/>
                    )
                })}
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
//     -строка курса
//                 -фрагмент курса
//                              -элемент курса
//                                  -id
//                                  -дополнительная информация
// ----------------------------------------------------------------|
const CourseLines =
     [
        {
            SameLine: [
                {
                    CourseFragment: [
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: null,
                                haveInputTest: false
                            }
                        },
                        ]
                }
                ]

        },
         {
             SameLine: [
                 {
                     CourseFragment: [
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                     ]
                 }
             ]

         },
         {
             SameLine: [
                 {
                     CourseFragment: [
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                     ]
                 }
             ]

         },
         {
             SameLine: [
                 {
                     CourseFragment: [
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: null,
                                 haveInputTest: false
                             }
                         },
                     ]
                 }
             ]

         },
        ]

// console.log(CourseLines[0].SameLine[0].CourseFragment[0].CourseElement.id)

console.log(CourseLines)
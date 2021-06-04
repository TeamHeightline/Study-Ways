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
                {CourseLines.map((line, lIndex) =>{
                    return(
                        <CourseRow key={lIndex} row={line}/>
                    )
                })}
            </div>
                <MainCardEditor/>
        </div>
    )
}
// какой язык на сколько востребован //


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
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
                                haveInputTest: false
                            }
                        },
                        {
                            CourseElement: {
                                id: 1,
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
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
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
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
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
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
                                 haveInputTest: false
                             }
                         },
                         {
                             CourseElement: {
                                 id: 1,
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
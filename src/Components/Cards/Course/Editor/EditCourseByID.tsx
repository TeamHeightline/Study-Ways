import React, {useState} from 'react'
import {Col, Row} from "antd";
import EditCourseItem from "./##EditCourseItem";
import MainCardEditor from "../../Editor/MainCardEditor/MainCardEditor";
import CourseFragment from "./#CourseFragment";
import CourseRow from "./#CourseRow";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";

const GET_COURSE_BY_ID = gql`
    query GET_COURSE_BY_ID($id: ID!){
        cardCourseById(id: $id){
            courseData
            id
        }
    }`
export default function EditCourseByID({course_id, ...props}: any){
    const [CourseLinesData, setCourseLineData] = useState<any>([])
    const {data: course_data, refetch} = useQuery(GET_COURSE_BY_ID, {
        variables:{
            id: props?.match?.params?.id? props?.match?.params?.id : course_id
        },
        onCompleted: data => {
            console.log(data)
            setCourseLineData(data.cardCourseById.courseData)
        }

    })
    // console.log(course_data)
    if(!course_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div className="mt-4 ml-4">
            <div style={{overflowY: "scroll"}} className="ml-5 mr-5">
                {CourseLinesData.map((line, lIndex) =>{
                    return(
                        <CourseRow key={lIndex} row={line}
                                   updateCourseRow={new_row =>{
                                       const newSameLine = {
                                           SameLine: new_row
                                       }
                                       const newCourseLinesData = CourseLinesData.slice()
                                       newCourseLinesData[lIndex] = newSameLine
                                       setCourseLineData(newCourseLinesData)
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
export const CourseLines =
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

// console.log(CourseLines)
import React, {useEffect, useState} from 'react'
import {Row} from "antd";
import MainCardEditor from "../../../PrivatePages/MainCardEditor";
import CourseRow from "./#CourseRow";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import {Alert, Pagination} from "@material-ui/lab";
import {Button, Snackbar, TextField, Typography} from "@material-ui/core";

const GET_COURSE_BY_ID = gql`
    query GET_COURSE_BY_ID($id: ID!){
        cardCourseById(id: $id){
            courseData
            id
            name
        }
    }`
const UPDATE_COURSE_DATA = gql`
    mutation UPDATE_COURSE_DATA($new_data: GenericScalar, $course_id: ID!, $name: String){
        updateCardCourse(input: {courseData: $new_data, courseId: $course_id, name: $name}){
            course{
                id
            }
        }
    }`
export default function EditCourseByID({course_id, ...props}: any){
    const [cardCourseImageName, setCardCourseImageName] = useState('');
    const [CourseLinesData, setCourseLineData] = useState<any>([])
    const [courseName, setCourseName] = useState('')
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()
    const [isCardEditNow, setIsCardEditNow] = useState(false)
    const [cardStateOfSave, setCardStateOfSave] = useState(2)
    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено

    const [update_course] = useMutation(UPDATE_COURSE_DATA, {
        variables:{
            new_data: CourseLinesData,
            course_id: props?.match?.params?.id? props?.match?.params?.id : course_id,
            name: courseName
        },
        onError: error => console.log("Save error - " + error),
        onCompleted: () => {
            setStateOfSave(2)
        }
    })

    const {data: course_data} = useQuery(GET_COURSE_BY_ID, {
        variables:{
            id: props?.match?.params?.id? props?.match?.params?.id : course_id
        },
        onCompleted: data => {
            // console.log(data)
            setCourseLineData(data.cardCourseById.courseData)
            setCourseName(data.cardCourseById.name)
        }

    })
    const autoSave = async () =>{
        clearTimeout(autoSaveTimer)
        setStateOfSave(0)
        changeAutoSaveTimer(setTimeout(() => {
            setStateOfSave(1)
            console.log("-----autosave-------")
            update_course()
        }, 4000))
    }
    const handleSubmissionCardCourseImage = (img: any) => {
        console.log("---")
        const formData = new FormData();

        formData.append('image', img);
        formData.append('card_course', course_id);
        fetch(
            'https://iot-experemental.herokuapp.com/cardfiles/course?update_id=' + course_id,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setCardCourseImageName(result.image.slice(74).split('?')[0])
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    async function getCourseImageData(){
        fetch("https://iot-experemental.herokuapp.com/cardfiles/course?id=" + course_id)
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setCardCourseImageName(result[0].image.slice(74).split('?')[0])
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    useEffect(()=>{
        getCourseImageData();
    }, [course_id])
    const changeHandlerForCardCourseImage = async (event) => {
        if (event.target.files[0]){
            // console.log(event.target.files)
            handleSubmissionCardCourseImage(event.target.files[0])
        }
    };

    // console.log(course_data)
    if(!course_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div className="mt-4 ">
            {course_id ?
                <Button
                    className="ml-5"
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")}}>
                    Назад
                </Button>: null}
            <br/>
            <Row>
                <TextField className="ml-5 mt-2 col-4" value={courseName}
                           onChange={(e) =>{
                                setCourseName(e.target.value)
                                autoSave()
                           }}
                    id="filled-basic" label="Назавние курса" variant="outlined" size="small"/>
            </Row>
            <div>
                {course_id &&
                <Button
                    color="primary"
                    variant="outlined"
                    component="label"
                    size="small"
                    className="ml-5 mt-2"
                >
                    <input type="file"  hidden name="file" onChange={changeHandlerForCardCourseImage} />
                    Изображение для курса
                </Button>}
                <br/>
                <Typography className="ml-5">
                    {course_id && cardCourseImageName && <div>{cardCourseImageName}</div>}
                </Typography>
            </div>
            <div>
                <Pagination  className="ml-5 mr-5 mt-2" style={{marginLeft: 6}} count={8} shape="rounded"
                             size="large" variant="outlined" color="secondary"/>
            </div>
            <div className="ml-5 mr-5">
                {CourseLinesData.length !== 0 && CourseLinesData.map((line, lIndex) =>{
                    return(
                        <CourseRow key={lIndex + "course" + props.cIndex} row={line} lIndex={lIndex}
                                   cIndex={props.cIndex}
                                   updateCourseRow={new_row =>{
                                       const newSameLine = {
                                           SameLine: new_row
                                       }
                                       const newCourseLinesData = CourseLinesData.slice()
                                       newCourseLinesData[lIndex] = newSameLine
                                       setCourseLineData(newCourseLinesData)
                                       // console.log("update course ----------------------")
                                       // console.log(newCourseLinesData)
                                       autoSave()
                        }}/>
                    )
                })}
            </div>
                <MainCardEditor
                    returnStateOfSave={(data) =>{
                        setCardStateOfSave(data)
                    }}
                    onSetIsEditNow={(data) =>{
                        setIsCardEditNow(data)
                }}/>
            <Snackbar open={true}>
                {isCardEditNow?
                    <Alert severity="info">
                        {stateOfSave === 0 &&
                        "Курс: не сохранен"}
                        {stateOfSave === 1 &&
                        "Курс: сохранияется"}
                        {stateOfSave === 2 &&
                        "Курс: сохранен"}
                        {cardStateOfSave === 0 && " | Карточка: не сохранена"}
                        {cardStateOfSave === 1 && " | Карточка: сохранияется"}
                        {cardStateOfSave === 2 && " | Карточка: сохранена"}
                    </Alert>:
                    <Alert severity="info">
                        {stateOfSave === 0 &&
                        "Курс: не сохранен"}
                        {stateOfSave === 1 &&
                        "Курс: сохранияется"}
                        {stateOfSave === 2 &&
                        "Курс: сохранен"}
                    </Alert>
                }
            </Snackbar>
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
const element = {
    CourseElement: {
        id: null,
    }
}
const fragment = {
    CourseFragment: [
        element,
        element,
        element,
        element,
        element,
        element,
        element,
        element,
        element,
        element,
    ]
}
export const CourseLines =
     [
        {
            SameLine:
                [
                fragment
                ]

        },
         {
             SameLine: [
                 fragment
             ]
         },
         {
             SameLine: [
                 fragment
             ]

         },
         {
             SameLine: [
                 fragment
             ]

         },
        ]

// console.log(CourseLines[0].SameLine[0].CourseFragment[0].CourseElement.id)

// console.log(CourseLines)
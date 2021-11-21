import React, {useEffect, useState} from 'react'
import MainCardEditor from "../../../PrivatePages/MainCardEditor";
import CourseRow from "./#CourseRow";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import {Row, Spinner} from "react-bootstrap";
import { Alert, Pagination } from '@mui/material';
import {Button, ButtonGroup, Grid, Snackbar, TextField, Typography} from "@mui/material";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";
import AddIcon from '@mui/icons-material/Add';

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
    const [openPageIndex, setOpenPageIndex] = useState(1) //пагинация работает с элемента под номером 1
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()
    const [isCardEditNow, setIsCardEditNow] = useState(false)
    const [cardStateOfSave, setCardStateOfSave] = useState(2)
    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [rerender, setRerender] = useState(false)
    const isMobile = isMobileHook()

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

            handleSubmissionCardCourseImage(event.target.files[0])
        }
    };
    function addCourseFragment(){
        const newCourseLinesData = CourseLinesData.slice()

        CourseLinesData.map((line, lIndex) => {

            const newRow = line.SameLine.slice()
            newRow[line.SameLine.length] = fragment

            const newSameLine = {
                SameLine: newRow
            }
            newCourseLinesData[lIndex] = newSameLine

        })
        setCourseLineData(newCourseLinesData)
        setRerender(!rerender)
        autoSave()
    }


    if(!course_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    console.log(CourseLinesData)
    return(
        <div className="mt-4 pl-2">
            <div className="pl-md-5">
                {course_id ?
                    <Button
                        className="col-md-2 col-12"
                        variant="outlined" color="primary" onClick={() => {
                        props.onChange("goBack")}}>
                        Назад
                    </Button>: null}
                <br/>
                <Row>
                    <TextField className=" mt-2 col-md-4 col-12" value={courseName}
                               onChange={(e) =>{
                                    setCourseName(e.target.value)
                                    autoSave()
                               }} label="Название курса" variant="filled" size="small" multiline/>
                </Row>
                <div>
                    {course_id &&
                    <Button
                        color="primary"
                        variant="outlined"
                        component="label"
                        size="small"
                        className="col-12 col-md-2 mt-2"
                    >
                        <input type="file"  hidden name="file" onChange={changeHandlerForCardCourseImage} />
                        Изображение для курса
                    </Button>}
                    <br/>
                    <Typography className="pl-md-5">
                        {course_id && cardCourseImageName && <div>{isMobile ? cardCourseImageName.slice(0, 25) + "..."
                            : cardCourseImageName}</div>}
                    </Typography>
                </div>
                {CourseLinesData.length !== 0 &&
                    <Grid container className="pr-md-5 mt-2">
                        <Grid item xs={12} md={'auto'}>
                            <Pagination
                                count={CourseLinesData[0].SameLine.length} shape="rounded"
                                onChange={(e, value) =>{setOpenPageIndex(value)}}
                                size={isMobile ? "small" : "large"} variant="outlined" color="secondary"/>
                        </Grid>
                        <Grid item xs={12} md={1} style={{marginLeft: 12}}>
                            <ButtonGroup style={{zoom: "109%"}}>
                                <Button onClick={() => addCourseFragment()}>
                                    <AddIcon/>
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>}


            </div>
            <div className="pl-md-5 pr-md-5" style={{overflow: "auto"}}>
                {CourseLinesData.length !== 0 && CourseLinesData.map((line, lIndex) =>{
                    return(
                        <CourseRow key={lIndex + "course" + props.cIndex} row={line} lIndex={lIndex}
                                   cIndex={props.cIndex}
                                   openPageIndex={openPageIndex}
                                   updateCourseRow={new_row =>{
                                       const newSameLine = {
                                           SameLine: new_row
                                       }
                                       const newCourseLinesData = CourseLinesData.slice()
                                       newCourseLinesData[lIndex] = newSameLine
                                       setCourseLineData(newCourseLinesData)
                                       autoSave()
                        }}/>
                    )
                })}
            </div>
            <div style={{overflow: "auto"}}>
                <MainCardEditor
                    returnStateOfSave={(data) =>{
                        setCardStateOfSave(data)
                    }}
                    onSetIsEditNow={(data) =>{
                        setIsCardEditNow(data)
                }}/>
            </div>
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

export type ICourseLine = typeof CourseLines[0]
// console.log(CourseLines[0].SameLine[0].CourseFragment[0].CourseElement.id)

// console.log(CourseLines)
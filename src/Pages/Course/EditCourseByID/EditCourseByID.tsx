import React, {useEffect, useState} from 'react'
import CourseRow from "./CourseRow";
import {gql} from "graphql.macro";
import {useMutation, useQuery} from "@apollo/client";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Grid,
    Pagination,
    Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {isMobileHook} from "../../../Shared/CustomHooks/isMobileHook";
import AddIcon from '@mui/icons-material/Add';
import {SERVER_BASE_URL} from "../../../settings";
import {EditorPage} from "../../Cards/Editor/EditorPageV2/Page";
import SearchIcon from '@mui/icons-material/Search';
import {Route, Routes, useNavigate, useParams} from "react-router-dom";

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
export default function EditCourseByID({course_id, ...props}: any) {
    const [cardCourseImageName, setCardCourseImageName] = useState('');
    const [CourseLinesData, setCourseLineData] = useState<any>([])
    const [courseName, setCourseName] = useState('')
    const [openPageIndex, setOpenPageIndex] = useState(1) //пагинация работает с элемента под номером 1
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()
    const [isCardEditNow] = useState(false)
    const [cardStateOfSave] = useState(2)
    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [rerender, setRerender] = useState(false)
    const isMobile = isMobileHook()
    const navigate = useNavigate();
    const {id} = useParams()


    const [update_course] = useMutation(UPDATE_COURSE_DATA, {
        variables: {
            new_data: CourseLinesData,
            course_id: id ? id : course_id,
            name: courseName
        },
        onError: error => console.log("Save error - " + error),
        onCompleted: () => {
            setStateOfSave(2)
        }
    })

    const {data: course_data} = useQuery(GET_COURSE_BY_ID, {
        variables: {
            id: id ? id : course_id
        },
        onCompleted: data => {
            // console.log(data)
            setCourseLineData(data.cardCourseById.courseData)
            setCourseName(data.cardCourseById.name)
        }

    })
    const autoSave = async () => {
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
            SERVER_BASE_URL + '/cardfiles/course?update_id=' + course_id,
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

    async function getCourseImageData() {
        fetch(SERVER_BASE_URL + "/cardfiles/course?id=" + course_id)
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setCardCourseImageName(result[0].image.slice(74).split('?')[0])
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getCourseImageData();
    }, [course_id])
    const changeHandlerForCardCourseImage = async (event) => {
        if (event.target.files[0]) {

            handleSubmissionCardCourseImage(event.target.files[0])
        }
    };

    function addCoursePage() {
        const newCourseLinesData = CourseLinesData.slice()

        // Итерируемся по каждой строке и добавляем массив пустых элементов в конец строки
        // На каждой странице 10 элементов
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

    function addCourseLine(isTopOrBottom: boolean) {
        const numberOfPages = CourseLinesData?.[0]?.SameLine?.length
        if (!numberOfPages) {
            return
        }

        const arrayForIterations = Array.from(Array(numberOfPages))

        function generateLine() {
            return fragment
        }

        const newLine: ICourseLine = {SameLine: arrayForIterations.map(generateLine)}

        if (isTopOrBottom) {
            const newCourse: CourseData = [newLine, ...CourseLinesData]
            setCourseLineData(newCourse)
        } else {
            const newCourse: CourseData = [...CourseLinesData, newLine]
            setCourseLineData(newCourse)
        }
    }


    if (!course_data) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }


    return (
        <Box sx={{pl: {xs: 0, md: 4}, mt: {xs: 0, md: 2}}}>
            <Stack direction={"column"} sx={{maxWidth: 300}} spacing={1}>
                {course_id &&
                    <Button
                        variant="outlined" color="primary" onClick={() => {
                        props.onChange("goBack")
                    }}>
                        Назад
                    </Button>}

                <TextField value={courseName}
                           onChange={(e) => {
                               setCourseName(e.target.value)
                               autoSave()
                           }} label="Название курса" variant="filled" size="small" multiline/>

                {course_id &&
                    <Button
                        color="primary"
                        variant="outlined"
                        component="label"
                        size="small"
                    >
                        <input type="file" hidden name="file" onChange={changeHandlerForCardCourseImage}/>
                        Изображение для курса
                    </Button>}

                <Typography>
                    {course_id && cardCourseImageName && <div>{isMobile ? cardCourseImageName.slice(0, 25) + "..."
                        : cardCourseImageName}</div>}
                </Typography>
            </Stack>

            {CourseLinesData.length !== 0 &&
                <Stack direction={"row"} alignItems={"flex-end"} sx={{mt: 2}} spacing={2}>
                    <Grid item xs={12} md={'auto'}>
                        <Pagination
                            count={CourseLinesData[0].SameLine.length} shape="rounded"
                            onChange={(e, value) => {
                                setOpenPageIndex(value)
                            }}
                            size={isMobile ? "small" : "large"} variant="outlined" color="secondary"/>
                    </Grid>
                    <Grid item xs={12} md={1} sx={{mt: 1}}>
                        <ButtonGroup style={{zoom: "109%"}}>
                            <Button onClick={() => addCoursePage()}>
                                <AddIcon/>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Button onClick={() => addCourseLine(true)} variant={"contained"}>
                        Добавить строку сверху
                    </Button>
                    <Button onClick={() => addCourseLine(false)} variant={"contained"}>
                        Добавить строку снизу
                    </Button>
                </Stack>}
            <Box sx={{overflow: "auto", mb: 1}}>
                {CourseLinesData.length !== 0 && CourseLinesData.map((line, lIndex) => {
                    return (
                        <CourseRow
                            editCard={(item_id) => {
                                navigate("/editor/course/card/" + item_id)
                            }}
                            key={lIndex + "course" + "number_of_lines" + CourseLinesData.length + props.cIndex}
                            row={line} lIndex={lIndex}
                            cIndex={props.cIndex}
                            openPageIndex={openPageIndex}
                            updateCourseRow={new_row => {
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
            </Box>
            <Routes>
                <Route path={'card/:id'} element={
                    <Button startIcon={<SearchIcon/>} variant={"contained"}
                            onClick={() => {
                                navigate("/editor/course")
                            }}>
                        К поиску карточек
                    </Button>
                }/>
            </Routes>
            <EditorPage/>
            <Snackbar open={true}>
                {isCardEditNow ?
                    <Alert severity="info">
                        {stateOfSave === 0 &&
                            "Курс: не сохранен"}
                        {stateOfSave === 1 &&
                            "Курс: сохранияется"}
                        {stateOfSave === 2 &&
                            "Курс: сохранен"}
                        {cardStateOfSave === 0 && " | Карточка: не сохранена"}
                        {cardStateOfSave === 1 && " | Карточка: сохраняется"}
                        {cardStateOfSave === 2 && " | Карточка: сохранена"}
                    </Alert> :
                    <Alert severity="info">
                        {stateOfSave === 0 &&
                            "Курс: не сохранен"}
                        {stateOfSave === 1 &&
                            "Курс: сохраняется"}
                        {stateOfSave === 2 &&
                            "Курс: сохранен"}
                    </Alert>
                }
            </Snackbar>
        </Box>
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

export type CourseData = typeof CourseLines
// console.log(CourseLines[0].SameLine[0].CourseFragment[0].CourseElement.id)

// console.log(CourseLines)

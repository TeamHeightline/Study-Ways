import React, {useEffect, useRef, useState} from "react";
import {Button, Input} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
export default function CKEDITOR(props: any){
    const [selectedAnswerImage, setSelectedAnswerImage] = useState<any>();
    const [isSelectedAnswerImage, setIsSelectedAnswerImage] = useState(false);
    const changeHandlerForAnswerImage = async (event) => {
        if (event.target.files[0]){
        await setSelectedAnswerImage(event.target.files[0]);
        await setIsSelectedAnswerImage(true);
        handleSubmissionAnswerImage(event.target.files[0])
        }
    };

    const handleSubmissionAnswerImage = (img: any) => {
        console.log("---")
        const formData = new FormData();

        formData.append('image', img);
        formData.append('owner_answer', '14');
        fetch(
            'https://iot-experemental.herokuapp.com/files/answer?update_id=14',
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    return(
        <div>
            <div>
                <Button
                    color="primary"
                    variant="outlined"
                    component="label"
                >
                    <input type="file"  hidden name="file" onChange={changeHandlerForAnswerImage} />
                    Upload File
                </Button>
                {isSelectedAnswerImage ? (
                    <div>
                        Filename: {selectedAnswerImage?.name}
                    </div>
                ) : (
                    <p>Select a file to show details</p>
                )}
            {/*            <Button  color="primary"*/}
            {/*                     variant="contained"*/}
            {/*                     onClick={handleSubmissionAnswerImage}>S</Button>*/}
            </div>
        </div>
    )
}
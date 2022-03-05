import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {Slider, Stack, TextField} from "@mui/material";
import {colorType} from "./ColorBackground";

interface IColorFieldProps extends React.HTMLAttributes<HTMLDivElement>{
    colorName: "Red" | "Green" | "Blue" | string,
    Color: colorType,
    setColor: React.Dispatch<React.SetStateAction<colorType>>
}
enum colorRange {
    min = 0,
    max = 256
}

export const ColorField = observer(({colorName, Color, setColor, ...props}: IColorFieldProps) =>{

    function changeColor(event){
        setColor({...Color, [colorName]: event.target.value})
    }
    function getBackgroundCSS(){
        return("Rgb(" + Color.Red + "," + Color.Green + "," + Color.Blue + ")")
    }
    useEffect(() =>{
        window.document.body.style.backgroundColor = getBackgroundCSS()
    }, [Color])

    return(
        <div {...props}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <TextField
                    onChange={changeColor}
                    value={Color[colorName]}
                    label={colorName =="Red" ? "Красный": colorName =="Green" ? "Зеленый" : "Синий"}
                    variant="outlined" />
                <Slider
                    onChange={changeColor}
                    value={Color[colorName]}
                    min={colorRange.min} max={colorRange.max}
                    sx={{width: "200px", color: colorName}}/>
            </Stack>
        </div>
    )
})
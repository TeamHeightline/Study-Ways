import {observer} from "mobx-react";
import React, {useState} from 'react';
import {Card, Grid, Stack} from "@mui/material";
import {ColorField} from "./ColorInput";

interface IColorBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {

}

const defaultColor = {
    Red: 125,
    Green: 125,
    Blue: 125
}
export type colorType = typeof defaultColor

const colorNameArray = Object.keys(defaultColor)

export const ColorBackground = observer(({...props}: IColorBackgroundProps) => {
    const [Color, setColor] = useState(defaultColor)

    return (
        <div {...props}>
            <Grid container alignItems="center" justifyContent={"center"} sx={{height: window.innerHeight - 300}}>
                <Card variant={"elevation"} elevation={3} sx={{width: "460px", borderRadius: "10px"}}>
                    <Stack spacing={2} direction={"column"} sx={{ml: 2, mt: 2, pb: 2}}>
                        {colorNameArray.map((colorName) => {
                            return (<ColorField {...{Color, setColor, colorName}}  />)
                        })}
                    </Stack>
                </Card>
            </Grid>
        </div>
    )
})
import {observer} from "mobx-react";
import React from 'react';
import {Button, ButtonGroup, Collapse, Stack} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {SelectCard} from "./##SelectCard";

interface IArrowNavigationProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const ArrowNavigation = observer(({...props}: IArrowNavigationProps) =>{
    return(
        <div {...props}>
            <Collapse in={CESObject.getField("isCardUseArrowNavigation", false)}>
                <Stack spacing={1}>
                    <Stack direction={"row"} spacing={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button >
                                <KeyboardArrowLeftOutlinedIcon />
                            </Button>
                        </ButtonGroup>
                        <SelectCard card_direction={"cardBefore"}/>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button>
                                <KeyboardArrowDownOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                        <SelectCard card_direction={"cardDown"}/>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button>
                                <KeyboardArrowUpOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                        <SelectCard card_direction={"cardUp"}/>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <ButtonGroup size="medium" color="primary">
                            <Button>
                                <KeyboardArrowRightOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                        <SelectCard card_direction={"cardNext"}/>
                    </Stack>
                </Stack>
            </Collapse>
        </div>
    )
})
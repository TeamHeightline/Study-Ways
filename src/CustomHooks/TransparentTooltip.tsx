import {styled} from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

const TransparentTooltip = styled(({className, ...props }: any) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }}/>
))(`
    background-color: transparent;
`);
export default TransparentTooltip
import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Helmet} from "react-helmet";


interface ISeoDataProps extends PaperProps {

}

const SeoData = observer(({...props}: ISeoDataProps) => {
    return (
        <>
            <Helmet>
                <meta property="og:image"
                      content='https://sun9-55.userapi.com/impf/abtDBVV2AYLhEExPXYgmoTZlbmsxR3Jjtq1kMA/1Bp8jznUyeY.jpg?size=512x512&quality=96&sign=5c53dc5718d6b41644b13c48b4545df9&type=album'/>
                <meta name="twitter:site" content="https://sw-university.com/"/>
                <meta name="twitter:creator" content="Study Ways"/>
                <meta name="twitter:image"
                      content="https://sun9-55.userapi.com/impf/abtDBVV2AYLhEExPXYgmoTZlbmsxR3Jjtq1kMA/1Bp8jznUyeY.jpg?size=512x512&quality=96&sign=5c53dc5718d6b41644b13c48b4545df9&type=album"/>
                <meta property="og:locale" content="ru"/>
            </Helmet>
        </>
    )
})

export default SeoData
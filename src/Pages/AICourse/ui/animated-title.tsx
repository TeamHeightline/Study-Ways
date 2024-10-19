import {observer} from "mobx-react";
import {Typography} from "@mui/material";

export const AnimatedTitle = observer(() => {
    return (
        <Typography variant={'h2'}
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, rgb(9, 48, 255), rgb(204, 5, 254))',
                        backgroundClip: 'text',
                        'webkit-background-clip': 'text',
                        '-webkit-text-fill-color': 'transparent'
                    }}>
            AI курс
        </Typography>
    )
})
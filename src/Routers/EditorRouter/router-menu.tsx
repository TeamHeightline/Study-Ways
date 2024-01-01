import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Box, Button, Grid, ListItemButton, Paper, Tooltip, Typography} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router-dom";
import {isMobileHook} from "../../CustomHooks/isMobileHook";
import {privateRoutes} from "./routes";
import haveStatus from "../../Store/UserStore/utils/HaveStatus";


interface IRouterMenuProps extends PaperProps {

}

const EDITOR_URL_PREFIX = "/editor/"
const RouterMenu = observer(({...props}: IRouterMenuProps) => {
    const navigate = useNavigate();
    const [isOpen, setOpen] = React.useState(false);
    const isMobile = isMobileHook()

    const handleDrawer = () => {
        setOpen(!isOpen);
    };


    return (
        <Paper elevation={0} {...props}>
            <Drawer
                variant={"permanent"}
                open={isOpen}
                onClose={() => setOpen(!isOpen)}


            >
                <Box
                    sx={(theme) => ({
                        pt: "50px",
                        width: isOpen ? 250 : isMobile ? 0 : 85,
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        })
                    })}>
                    <div>
                        < IconButton onClick={handleDrawer} size="large">
                            {!isOpen ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        {privateRoutes.map((route) => {
                            if (!!route?.title) {
                                return (
                                    <Tooltip title={<Typography variant="body1">{route.title}</Typography>}>
                                        <ListItem disabled={!haveStatus(route.status)}
                                                  onClick={() => {
                                                      if (!haveStatus(route.status)) {
                                                          return
                                                      }
                                                      isMobile && setOpen(false)
                                                      navigate(EDITOR_URL_PREFIX + route.navigate)
                                                  }}>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    {route.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={isOpen ? route.title : ""}/>
                                            </ListItemButton>
                                        </ListItem>
                                    </Tooltip>
                                )
                            }
                        })}
                    </List>
                </Box>
            </Drawer>
            {isMobile &&
                <Grid container justifyContent="center" sx={{pb: 2}}>
                    <Grid item>
                        <Button fullWidth variant="outlined"
                                endIcon={<MenuIcon/>} onClick={() => {
                            setOpen(!isOpen)
                        }}
                        >
                            Меню
                        </Button>
                    </Grid>
                </Grid>}
        </Paper>
    )
})

export default RouterMenu

import React from "react";
import {gql, useQuery} from "@apollo/client";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import {Row, Spinner} from "react-bootstrap";

const GET_THEMES = gql`
query GET_THEMES{
  questionThemes{
    id
    name
    description
  }
  me{
    questionauthorSet{
      id
      name
    }
  }
}`



const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 600,
        maxWidth: 600,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


export default function TestEditor() {
    const classes = useStyles();
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);
    const {data, error, loading} = useQuery(GET_THEMES);


    const handleChange = (event: any) => {
        setPersonName(event.target.value);
    };

    const [state, setState] = React.useState({
        age: '',
        name: 'hai',
    });



    console.log(data)
    if(!data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }


    return (
        <div>
            <div className="display-4 text-center mt-3" style={{fontSize: '35px'}}>Глобальный редактор вопросов</div>
            <Row>
                <div className="offset-6">

                </div>
                <div className="offset-8">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="question-theme-multiple">Темы вопросов</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<Input/>}
                            MenuProps={MenuProps}
                        >
                            {data.questionThemes.map((theme: any) => (
                                <MenuItem key={theme.id} value={theme.name} >
                                    {theme.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="question-author-multiple">Авторы вопросов</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            input={<Input/>}
                            MenuProps={MenuProps}
                        >
                            {data.me.questionauthorSet.map((author: any) => (
                                <MenuItem key={author.id} value={author.name} >
                                    {author.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </Row>
        </div>)
}





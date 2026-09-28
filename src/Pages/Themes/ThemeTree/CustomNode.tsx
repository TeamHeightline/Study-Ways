import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Collapse, Stack } from '@mui/material';

export const CustomNode = (props: any) => {
  const [startOpenAnimation, setStartOpenAnimation] = useState(false);
  useEffect(() => {
    setStartOpenAnimation(true);
  }, []);
  useEffect(
    () => () => {
      setStartOpenAnimation(false);
    },
    [],
  );
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };
  return (
    <Collapse in={props.isOpen || startOpenAnimation}>
      <Stack
        className={`sw-theme-editor-node${props.node.id === props.selectedThemeID ? ' is-selected' : ''}`}
        direction={'row'}
        onClick={() => props.setSelectedThemeID(props.node.id)}
      >
        {props.node.droppable && (
          <button type="button" className="sw-theme-editor-toggle" aria-label={props.isOpen ? 'Свернуть тему' : 'Раскрыть тему'} aria-expanded={props.isOpen} onClick={handleToggle}>
            <ArrowRightIcon style={{ transform: props.isOpen ? 'rotate(90deg)' : undefined }} />
          </button>
        )}
        <Typography
          variant="body1"
        >
          {props.node.text}
        </Typography>
      </Stack>
    </Collapse>
  );
};

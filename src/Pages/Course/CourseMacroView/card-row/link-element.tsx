import { Box } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import React from 'react';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { useNavigate } from 'react-router-dom';

interface ILinkElementProps extends BoxProps {
  courseLink: string;
  size: any;
}

export default function LinkElement({
  courseLink,
  size,
  ...props
}: ILinkElementProps) {
  const navigate = useNavigate();

  function handleClickOnLink() {
    const formattedLink = courseLink.replace(/^.*\/\/[^\/]+/, '');
    navigate(formattedLink);
  }

  return <Box {...props} className="sw-course-link-tile" sx={size} onClick={handleClickOnLink} role="link" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleClickOnLink(); }}>
    <span className="sw-course-link-icon"><LinkRoundedIcon /></span>
    <span className="sw-course-link-label">Следующий курс</span>
    <OpenInNewRoundedIcon className="sw-course-link-arrow" />
  </Box>;
}

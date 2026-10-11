import React from 'react';
import { Box, Divider, Pagination, Stack, Typography } from '@mui/material';
import { CourseMicroStoreByID } from '../store/CourseMicroStoreByID';
import RowFragment from './RowFragment';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
type CourseNavigationProps = {
  courseStore: CourseMicroStoreByID;
};
const CourseNavigation = ({ courseStore }: CourseNavigationProps) => {
  const navigate = useNavigate();
  const author = courseStore.author;
  const profile = author?.users_userprofile;
  const authorName =
    [profile?.firstname, profile?.lastname].filter(Boolean).join(' ') ||
    author?.username;
  function handleAuthorClick() {
    if (author) navigate(`/author/${author.id}`);
  }
  return (
    <Stack direction={'row'}>
      <div>
        <Typography variant={'subtitle2'} sx={{ p: 1, width: 500 }}>
          {courseStore?.courseName}
        </Typography>
        {author && (
          <Typography
            variant="caption"
            onClick={handleAuthorClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              cursor: 'pointer',
            }}
          >
            <OpenInNewIcon fontSize={'small'} sx={{ mr: 1 }} />
            {authorName}
          </Typography>
        )}
        <Divider />
        <Box>
          {courseStore?.course?.map((courseRow, CRI) => (
            <RowFragment
              key={`${CRI}NavigationRow`}
              CRI={CRI}
              courseStore={courseStore}
            />
          ))}

          <Box sx={{ width: 500 }}>
            <Pagination
              sx={{ p: 1, width: '100%' }}
              variant="outlined"
              count={courseStore?.courseData[0]?.SameLine.length || 1}
              page={courseStore.position.activePage}
              onChange={(event, page) => courseStore.setActivePage(page)}
              color="primary"
              disabled={
                Number(courseStore?.courseData[0]?.SameLine.length || 1) <= 1
              }
            />
          </Box>
        </Box>

        {/* <Divider/>*/}
      </div>
    </Stack>
  );
};
export default CourseNavigation;

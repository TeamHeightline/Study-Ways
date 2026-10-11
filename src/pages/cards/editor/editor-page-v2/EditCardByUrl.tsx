import React from 'react';
import { EditCardByID } from '../editor-by-id-v2/ui/EditCardByID';
import { useParams } from 'react-router-dom';

interface ComponentProp {}

export const EditCardByUrl = ({ ...props }: ComponentProp) => {
  const { id } = useParams();
  return (
    <div {...props}>
      <EditCardByID id={id} />
    </div>
  );
};

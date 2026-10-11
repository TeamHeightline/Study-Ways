import React from 'react';
import { EditCardByID } from '../EditorByIDV2/UI/EditCardByID';
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

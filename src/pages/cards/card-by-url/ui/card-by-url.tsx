import React from 'react';
import { useParams } from 'react-router-dom';
import CardByID from '../../card-by-id/ui/card-by-id';
interface ICardByURLProps {}
const CardByURL = ({ ...props }: ICardByURLProps) => {
  const { id } = useParams();
  return (
    <div>
      <CardByID card_id={Number(id)} />
    </div>
  );
};
export default CardByURL;

import React from "react";
import FolderIcon from "@material-ui/icons/Folder";
import ImageIcon from "@material-ui/icons/Image";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DescriptionIcon from "@material-ui/icons/Description";

type Props = {
  droppable: boolean;
  fileType?: string;
};

export const TypeIcon: React.FC<Props> = (props: any) => {
  if (props.droppable) {
    return <FolderIcon />;
  }

  switch (props.fileType) {
    case "image": return <ImageIcon />;
    case "csv": return <ListAltIcon />;
    case "text": return <DescriptionIcon />;
    default: return null;
  }
};
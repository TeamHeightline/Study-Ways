import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { IHelpArticle } from "../redux-store/types";
import ReactPlayer from "react-player";
import React from "react";
import { isMobileHook } from "../../../../Shared/CustomHooks/isMobileHook";

interface IContentDialogProps extends BoxProps {
  isOpen: boolean;
  article: IHelpArticle;
  onClose: () => void;
}

export default function ContentDialog({
  isOpen,
  article,
  onClose,
  ...props
}: IContentDialogProps) {
  const isMobile = isMobileHook();
  return (
    <Box {...props}>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={"md"}>
        <DialogTitle>{article.title}</DialogTitle>
        <DialogContent>
          {article?.video_url && (
            <ReactPlayer
              width="auto"
              height={isMobile ? 200 : 540}
              controls
              url={article.video_url}
            />
          )}
          {article?.content && (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

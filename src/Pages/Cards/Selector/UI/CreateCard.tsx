import { observer } from "mobx-react";
import React from "react";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, Stack } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { CSSObject } from "../Store/CardSelectorStore";

type ICreateCardProps = React.HTMLAttributes<HTMLDivElement>;

export const CreateCard = observer(({ ...props }: ICreateCardProps) => (
  <div {...props}>
    <Card
      variant="outlined"
      sx={{ width: 400, height: 170 }}
      onClick={() => {
        CSSObject.createNewCard();
      }}
    >
      <Stack direction={"row"}>
        <CardMedia
          sx={{ width: 200, height: 169 }}
          image="https://www.shareicon.net/data/256x256/2017/03/06/880378_blue_512x512.png"
        />
        <CardActionArea>
          <CardContent>
            <Typography style={{ paddingLeft: 6 }} variant="h4" gutterBottom>
              Создать новую карточку
            </Typography>
          </CardContent>
        </CardActionArea>
      </Stack>
    </Card>
  </div>
));

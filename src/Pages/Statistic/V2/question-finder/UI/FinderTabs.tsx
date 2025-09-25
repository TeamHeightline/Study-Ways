import { observer } from "mobx-react";
import React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { isMobileHook } from "../../../../../Shared/CustomHooks/isMobileHook";
import { useNavigate } from "react-router-dom";

type IFinderTabsProps = React.HTMLAttributes<HTMLDivElement>;

export const FinderTabs = observer(({ ...props }: IFinderTabsProps) => {
  const isMobile = isMobileHook();
  const navigate = useNavigate();
  return (
    <div {...props}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        centered
        variant={!isMobile ? "standard" : "scrollable"}
        scrollButtons={isMobile}
      >
        <Tab label="Серии вопросов" onClick={() => navigate("qs")} />
        <Tab label="Все попытки" onClick={() => navigate("all")} />
      </Tabs>
    </div>
  );
});

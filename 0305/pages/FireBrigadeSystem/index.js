import { Box } from "@mui/material";
import React from "react";
import BasicLayout from "../../containers/Layout/BasicLayout";
import InnerCards from "../../containers/Layout/Inner-Cards/InnerCards";

const Index = () => {
  return (
    <div>
      <Box titleProp={"none"}>
        <InnerCards pageKey={"FireBrigadeSystem"} />
      </Box>
    </div>
  );
};

export default Index;

import { Paper } from "@mui/material";
import Head from "next/head";
import React from "react";

const Index = () => {
  return (
    <>
      <Head>
        <title>Property Tax Dashboard</title>
      </Head>
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "76vh",
        }}
      >
        <h1>Property Tax Dashboard</h1>
      </Paper>
    </>
  );
};

export default Index;

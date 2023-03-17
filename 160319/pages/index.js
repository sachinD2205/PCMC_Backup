import Head from "next/head";
import React from "react";
import BasicLayout from "../containers/Layout/BasicLayout";
// import { BrowserRouter as Router } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Head>
        <title>PCMC ERP</title>
        <meta name="PCMC ERP" content="This the PCMC ERP Portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <BasicLayout titleProp={'none'}>
        <h2>Home Page</h2>
      </BasicLayout> */}
    </div>
  );
}

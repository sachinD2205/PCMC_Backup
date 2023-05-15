import { Add, Visibility } from "@mui/icons-material";
import { Button, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Head from "next/head";
import router from "next/router";
import React, { useEffect, useState } from "react";
import sweetAlert from "sweetalert";
import URLS from "../../../../../URLS/urls";
// import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";

import { useSelector } from "react-redux";

const Index = () => {
  const [runAgain, setRunAgain] = useState(false);
  const [table, setTable] = useState([]);
  const [forView, setForView] = useState([]);
  const [zone, setZone] = useState([
    {
      id: 1,
      zoneEn: "",
      zoneMr: "",
    },
  ]);
  const [village, setVillage] = useState([
    {
      id: 1,
      villageEn: "",
      villageMr: "",
    },
  ]);

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  useEffect(() => {
    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((res) => {
      console.log("Zone: ", res.data);
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        })),
      );
    });

    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((res) => {
      console.log("Villages: ", res.data);
      setVillage(
        res.data.village.map((j) => ({
          id: j.id,
          villageEn: j.villageName,
          villageMr: j.villageNameMr,
        })),
      );
    });
  }, [runAgain]);

  useEffect(() => {
    setRunAgain(false);

    axios.get(`${URLS.TPURL}/partplan/getpartplanDetails`).then((response) => {
      setForView(response.data);
      setTable(
        response.data.map((res, index) => ({
          srNo: index + 1,
          id: res.id,
          applicationDate: res.applicationDate,
          applicationNo: res.applicationNo,
          fullNameEn: res.firstNameEn + " " + res.middleNameEn + " " + res.surnameEn,
          fullNameMr: res.firstNameMr + " " + res.middleNameMr + " " + res.surnameMr,
          zoneNameEn: zone.find((obj) => obj?.id == res.tDRZone)?.zoneEn,
          zoneNameMr: zone.find((obj) => obj?.id == res.tDRZone)?.zoneMr,
          villageNameEn: village.find((obj) => obj?.id == res.villageName)?.villageEn,
          villageNameMr: village.find((obj) => obj?.id == res.villageName)?.villageMr,
          pincode: res.pincode,
          status: res.status,
        })),
      );
    });
  }, [village, zone]);

  function getZoneName(value, lang) {
    if (lang === "en") {
      // @ts-ignore
      return zone.find((obj) => obj?.id == value)?.zoneEn;
    } else {
      // @ts-ignore
      return zone.find((obj) => obj?.id == value)?.zoneMr;
    }
  }
  function getVillageName(value, lang) {
    if (lang === "en") {
      // @ts-ignore
      return village.find((obj) => obj?.id == value)?.villageEn;
    } else {
      // @ts-ignore
      return village.find((obj) => obj?.id == value)?.villageMr;
    }
  }

  const deleteRecord = async (record) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLS.TPURL}/partplan/deletepartplan/${record.id}`).then((res) => {
          if (res.status == 200) {
            sweetAlert("Deleted!", "Record Deleted successfully !", "success");
            setRunAgain(true);
          }
        });
      }
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 150,
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 200,
    },
    {
      field: language === "en" ? "fullNameEn" : "fullNameMr",
      headerName: <FormattedLabel id="fullName" />,
      width: 200,
    },
    {
      field: language === "en" ? "zoneNameEn" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      width: 200,
    },
    {
      field: language === "en" ? "villageNameEn" : "villageNameMr",
      headerName: <FormattedLabel id="villageName" />,
      width: 200,
    },
    {
      field: "pincode",
      headerName: <FormattedLabel id="pincode" />,
      width: 200,
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      width: 200,
    },
    {
      field: "action",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                const viewData = forView[params.row.srNo - 1];
                console.log("Query data: ", viewData);
                router.push({
                  pathname: `/townPlanning/transactions/partMap/view`,
                  query: {
                    pageMode: "view",
                    ...viewData,
                  },
                });
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton onClick={() => deleteRecord(params.row)}>
              <Delete />
            </IconButton> */}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>Part Map</title>
      </Head>
      <div>
        <Button
          sx={{ marginBottom: 2, marginLeft: 5 }}
          onClick={() =>
            router.push({
              pathname: `/townPlanning/transactions/partMap/view`,
              query: {
                pageMode: "new",
                length: table.length + 1,
              },
            })
          }
          variant="contained"
          endIcon={<Add />}
        >
          <FormattedLabel id="add" />
        </Button>

        <Paper style={{ padding: "3% 3%" }}>
          <DataGrid
            autoHeight
            rows={table}
            // @ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Paper>
      </div>
    </>
  );
};

export default Index;

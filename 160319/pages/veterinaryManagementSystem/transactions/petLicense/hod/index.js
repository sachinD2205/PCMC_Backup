import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";
import styles from "../vet.module.css";

import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Paper, Button, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add, Delete, Pets, Visibility } from "@mui/icons-material";
import axios from "axios";
import sweetAlert from "sweetalert";
// import { useSelector } from 'react-redux'

const Index = () => {
  const [table, setTable] = useState([
    // {
    //   id: 1,
    //   srNo: 1,
    //   ownerName: 'Karan Sable',
    //   petName: 'Bhubhi',
    //   animalAge: 2,
    //   animalColor: 'Brown',
    //   status: 'Applied',
    // },
  ]);

  useEffect(() => {
    //Get Applications
    axios
      .get(`${URLs.VMS}/trnPetLicence/getAll`)
      .then((res) => {
        setTable(
          res.data.trnPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            ownerName: j.ownerName,
            petName: j.petName,
            animalAge: j.animalAge,
            animalColor: j.animalColor,
            status: j.status,
          })),
        );
      })
      .catch((error) => {
        console.log("error: ", error);
        sweetAlert({
          title: "ERROR!",
          text: `${error}`,
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              visible: true,
              closeModal: true,
            },
          },
          dangerMode: true,
        });
      });
  }, []);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },

    {
      headerClassName: "cellColor",

      field: "ownerName",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",

      field: "petName",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petName" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "animalAge",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="animalAge" />,
      width: 200,
      // flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "animalColor",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="animalColor" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: "#1976d2" }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/petLicense/hod/view`,
                  query: { id: params.row.id },
                });
              }}
            >
              <Visibility />
            </IconButton>

            {/* {params.row.status === "Payment Successful" && (
              <Button
                variant="contained"
                onClick={() => {
                  router.push({
                    pathname: `${URLs.APPURL}/veterinaryManagementSystem/transactions/petLicense/petLicense`,
                    query: { id: router.query.id },
                  });
                }}
                endIcon={<Pets />}
              >
                <FormattedLabel id="generateLicense" />
              </Button>
            )} */}
            <Button
              disabled={params.row.status === "Payment Successful" ? false : true}
              variant="contained"
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/petLicense/petLicense`,
                  query: { id: params.row.id },
                });
              }}
              endIcon={<Pets />}
            >
              <FormattedLabel id="generateLicense" />
            </Button>
            {/* <IconButton
              style={{ color: 'red' }}
              onClick={() => {
                console.log(params.row)
              }}
            >
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
        <title>Pet License</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="petLicense" />
        </div>
        {/* <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              router.push(
                `${URLs.APPURL}/veterinaryManagementSystem/transactions/petLicense/hod/view`
              )
            }}
          >
            <FormattedLabel id='add' />
          </Button>
        </div> */}
        <DataGrid
          autoHeight
          sx={{
            marginTop: "5vh",
            width: "100%",

            "& .cellColor": {
              backgroundColor: "#1976d2",
              color: "white",
            },
            "& .redText": {
              color: "red",
            },
            "& .orangeText": {
              color: "orange",
            },
            "& .greenText": {
              color: "green",
            },
            "& .blueText": {
              color: "blue",
            },
          }}
          getCellClassName={(params) => {
            if (params.field === "status" && params.value == "Applied") {
              return "orangeText";
            } else if (params.field === "status" && params.value == "Approved") {
              return "greenText";
            } else if (params.field === "status" && params.value == "Payment Successful") {
              return "blueText";
            } else if (params.field === "status" && params.value == "Reassigned") {
              return "redText";
            } else {
              return "";
            }
          }}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 0 },
              disableExport: true,
              disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Paper>
    </>
  );
};

export default Index;

import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import URLs from "../../../../../URLS/urls";
import styles from "../vet.module.css";

import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Paper, Button, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add, Delete, Edit, Pets, Visibility } from "@mui/icons-material";
import axios from "axios";
import sweetAlert from "sweetalert";

const Index = () => {
  const [table, setTable] = useState([]);
  const [runAgain, setRunAgain] = useState(false);

  useEffect(() => {
    setRunAgain(false);

    //Get Applications
    axios
      .get(`${URLs.VMS}/trnRenewalPetLicence/getAll`)
      .then((res) => {
        setTable(
          res.data.trnRenewalPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            petAnimal: j.petAnimalKey,
            ownerName: j.ownerName,
            petName: j.petName,
            animalAge: j.animalAge,
            animalColor: j.animalColor,
            status: j.status,
          })),
        );
      })
      .catch((error) => {
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
  }, [runAgain]);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 80,
    },

    {
      headerClassName: "cellColor",

      field: "ownerName",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      // width: 250,
      flex: 1,
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
      width: 180,
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
      // width: 200,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: "#1976d2" }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                  query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                });
              }}
            >
              <Visibility />
            </IconButton>
            {params.row.status === "Reassigned by Clerk" && (
              <IconButton
                style={{ color: "#1976d2" }}
                onClick={() => {
                  router.push({
                    pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                    query: { id: params.row.id, pageMode: "edit" },
                  });
                }}
              >
                <Edit />
              </IconButton>
            )}

            <Button
              disabled={params.row.status == "License Generated" ? false : true}
              variant="contained"
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/petLicense`,
                  query: { id: params.row.id },
                });
              }}
              endIcon={<Pets />}
            >
              <FormattedLabel id="viewLicense" />
            </Button>
            {/* <IconButton
              style={{ color: "red" }}
              onClick={() => {
                deleteApplication(params.row.id);
              }}
            >
              <Delete />
            </IconButton> */}
          </>
        );
      },
    },
  ];

  const deleteApplication = (applicationId) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLs.VMS}/trnRenewalPetLicence/delete/${applicationId}`).then((res) => {
          if (res.status == 226) {
            sweetAlert("Deleted!", "Record Deleted successfully !", "success");
            setRunAgain(true);
          }
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Pet License Renewal</title>
      </Head>
      <Paper className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id='petLicense' />
        </div> */}
        <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => {
              router.push(`/veterinaryManagementSystem/transactions/renewalPetLicense/TnC`);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>
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
            } else if (params.field === "status" && params.value == "Approved by Clerk") {
              return "greenText";
            } else if (params.field === "status" && params.value == "Approved by HOD") {
              return "greenText";
            } else if (
              params.field === "status" &&
              (params.value == "Reassigned by Clerk" ||
                params.value == "Reassigned by HOD" ||
                params.value == "Rejected by HOD")
            ) {
              return "redText";
            }
            // else if (params.field === "status" && params.value == "Reassigned by HOD") {
            //   return "redText";
            // }
            else if (params.field === "status" && params.value == "Payment Successful") {
              return "blueText";
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
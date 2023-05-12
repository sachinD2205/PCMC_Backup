import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./petIncinerator.module.css";

import { Button, IconButton, Paper } from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Add, Delete, Visibility } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import URLs from "../../../../URLS/urls";
import axios from "axios";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [table, setTable] = useState([]);
  const [runAgain, setRunAgain] = useState(false);
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: "",
      breedNameMr: "",
      petAnimalKey: "",
    },
  ]);

  useEffect(() => {
    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetBreeds(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalKey: j.petAnimalKey,
        })),
      );
    });
  }, []);

  useEffect(() => {
    setRunAgain(false);
    axios.get(`${URLs.VMS}/trnSmallPetIncineration/getAll`).then((res) => {
      setTable(
        res.data.trnSmallPetIncinerationList.map((j, i) => ({
          srNo: i + 1,
          ...j,
          petBreedEn: petBreeds.find((obj) => obj.id == Number(j.animalBreedKey))?.breedNameEn,
          petBreedMr: petBreeds.find((obj) => obj.id == Number(j.animalBreedKey))?.breedNameMr,
        })),
      );
    });
  }, [runAgain, petBreeds]);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },
    {
      headerClassName: "cellColor",

      field: "applicationNumber",
      headerAlign: "center",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",

      field: "licenseNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="licenseNo" />,
      width: 160,
    },
    {
      headerClassName: "cellColor",

      field: "ownerName",
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerName" />,
      width: 160,
    },
    {
      headerClassName: "cellColor",

      field: "ownerAddress",
      headerAlign: "center",
      headerName: <FormattedLabel id="ownerAddress" />,
      width: 280,
    },
    // {
    //   headerClassName: "cellColor",

    //   field: "ownerEmailId",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="emailId" />,
    //   width: 120,
    // },
    {
      headerClassName: "cellColor",

      field: "petName",
      headerAlign: "center",
      headerName: <FormattedLabel id="petName" />,
      width: 120,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "petBreedEn" : "petBreedMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="petBreed" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "applicationStatus",
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: "#1976d2" }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/petIncinerator`,
                  query: { id: params.row.id, pageMode: "view" },
                });
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton style={{ color: "red" }} onClick={() => deleteById(params.row.id)}>
              <Delete />
            </IconButton> */}
          </>
        );
      },
    },
  ];

  const deleteById = (id) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLs.VMS}/trnSmallPetIncineration/delete/${id}`).then((res) => {
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
        <title>Pet Incinerator</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Pet Incinerator</div>
        {/* <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => router.push("/veterinaryManagementSystem/transactions/petIncinerator")}
          >
            <FormattedLabel id="add" />
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
            "& .orangeText": {
              color: "orange",
            },
            "& .blueText": {
              color: "blue",
            },
            // "& .redText": {
            //   color: "red",
            // },
            // "& .greenText": {
            //   color: "green",
            // },
          }}
          getCellClassName={(params) => {
            if (params.field === "applicationStatus" && params.value == "Application Submitted") {
              return "orangeText";
            } else if (params.field === "applicationStatus" && params.value == "Payment Successful") {
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

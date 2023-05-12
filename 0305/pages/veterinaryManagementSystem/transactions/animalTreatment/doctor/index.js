import React, { useState, useEffect } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../ipd.module.css";

import URLs from "../../../../../URLS/urls";
import { Delete, Visibility } from "@mui/icons-material";
import { Paper, Button, IconButton } from "@mui/material";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [runAgain, setRunAgain] = useState(false);
  const [table, setTable] = useState([]);
  const [petAnimal, setPetAnimal] = useState([{ id: 1, naemEn: "", nameMr: "" }]);
  const [petAnimalBreed, setPetAnimalBreed] = useState([{ id: 1, breedNameEn: "", breedNameMr: "" }]);

  useEffect(() => {
    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimal(
        res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        })),
      );
    });

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setPetAnimalBreed(
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

    //Get IPD data
    axios.get(`${URLs.VMS}/trnAnimalTreatmentIpd/getAll`).then((res) => {
      console.log("IPD data: ", res.data.trnAnimalTreatmentIpdList);
      setTable(
        res.data.trnAnimalTreatmentIpdList.map((j, i) => ({
          srNo: i + 1,
          ...j,
          petAnimalEn: petAnimal.find((obj) => obj.id === Number(j.animalName))?.nameEn,
          petAnimalMr: petAnimal.find((obj) => obj.id === Number(j.animalName))?.nameMr,
          petAnimalBreedEn: petAnimalBreed.find((obj) => obj.id === j.animalSpeciesKey)?.breedNameEn,
          petAnimalBreedMr: petAnimalBreed.find((obj) => obj.id === j.animalSpeciesKey)?.breedNameMr,
        })),
      );
    });
  }, [runAgain, petAnimal, petAnimalBreed]);

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

      field: "casePaperNo",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="casePaperNo" />,
      width: 240,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "petAnimalEn" : "petAnimalMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimal" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "petAnimalBreedEn" : "petAnimalBreedMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimal" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "animalColour",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="animalColor" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "ownerFullName",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="teamName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 150,
    },

    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 125,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: "#1976d2" }}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/animalTreatment/doctor/view`,
                  query: {
                    id: params.row.id,
                    // petAnimal: params.row.petAnimal
                  },
                });
                console.log("444", params.row);
              }}
            >
              <Visibility />
            </IconButton>
            {/* <IconButton
              style={{ color: "red" }}
              onClick={() => {
                console.log(params.row.id);
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

  const deleteApplication = (deleteId) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLs.VMS}/trnAnimalTreatmentIpd/delete/${deleteId}`).then((res) => {
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
        <title>Treating sick and injured animal through IPD</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Treating sick and injured animal through IPD</div>
        {/* <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => {
              router.push(`/veterinaryManagementSystem/transactions/animalTreatment/clerk/view`);
            }}
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
            if (params.field === "status" && params.value == "Initiated") {
              return "blueText";
            } else if (params.field === "status" && params.value == "Under Treatment") {
              return "orangeText";
            } else if (params.field === "status" && params.value == "Dead") {
              return "redText";
            } else if (params.field === "status" && params.value == "Released") {
              return "greenText";
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

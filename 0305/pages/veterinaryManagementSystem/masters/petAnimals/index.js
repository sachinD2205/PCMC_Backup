import React, { useEffect, useState } from "react";
import router from "next/router";
import Head from "next/head";
import styles from "../vetMasters.module.css";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";

import URLs from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Paper, Button, TextField, IconButton, Slide } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import sweetAlert from "sweetalert";

const Index = () => {
  const [table, setTable] = useState([]);
  const [runAgain, setRunAgain] = useState(false);
  const [collapse, setCollapse] = useState(false);

  let petSchema = yup.object().shape({
    nameEn: yup
      .string()
      .required("Please enter pet animal name in english")
      .matches(/^[A-Za-z0-9\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
    nameMr: yup
      .string()
      .required("Please enter pet animal name in marathi")

      .matches(/^[०-९\u0900-\u097F]+$/, "Must be only marathi characters / फक्त मराठी शब्द "),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    setRunAgain(false);

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setTable(() => {
        sortByAsc(res.data.mstPetAnimalList, "nameEn");
        return res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          ...j,
        }));
      });
    });
  }, [runAgain]);

  const deleteAnimal = (deleteId) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLs.VMS}/mstPetAnimal/delete/${deleteId}`).then((res) => {
          if (res.status == 226) {
            sweetAlert("Deleted!", "Record Deleted successfully !", "success");
            setRunAgain(true);
          }
        });
      }
    });
  };

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },

    {
      headerClassName: "cellColor",

      field: "nameEn",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimalEn" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "nameMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimalMr" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{ color: "#1976d2" }}
              onClick={() => {
                reset({
                  id: params.row.id,
                  nameEn: params.row.nameEn,
                  nameMr: params.row.nameMr,
                });
                setCollapse(true);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              style={{ color: "red" }}
              onClick={() => {
                deleteAnimal(params.row.id);
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const finalSubmit = (data) => {
    console.log("Data: ", data);

    axios
      .post(`${URLs.VMS}/mstPetAnimal/save`, { ...data, activeFlag: "Y" })
      .then((res) => {
        if (data.id) {
          sweetAlert("Updated!", "Animal data updated successfully!", "success");
        } else {
          sweetAlert("Success!", "Animal data saved successfully!", "success");
        }
        reset({
          id: null,
          nameEn: "",
          nameMr: "",
        });
        setCollapse(!collapse);
        setRunAgain(true);
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
  };

  return (
    <>
      <Head>
        <title>Pet Animal</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="petAnimal" />
        </div>
        <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => {
              setCollapse(!collapse);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>
        <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
          <form onSubmit={handleSubmit(finalSubmit)} style={{ padding: "5vh 3%" }}>
            <div className={styles.row} style={{ justifyContent: "space-evenly" }}>
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="petAnimalEn" />}
                variant="standard"
                {...register("nameEn")}
                error={!!error.nameEn}
                helperText={error?.nameEn ? error.nameEn.message : null}
              />
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="petAnimalMr" />}
                variant="standard"
                {...register("nameMr")}
                error={!!error.nameMr}
                helperText={error?.nameMr ? error.nameMr.message : null}
              />
            </div>
            <div className={styles.buttons}>
              <Button color="success" variant="contained" type="submit" endIcon={<Save />}>
                <FormattedLabel id="save" />
              </Button>
              <Button
                variant="outlined"
                color="error"
                endIcon={<Clear />}
                onClick={() => {
                  reset({
                    nameEn: null,
                    nameMr: null,
                  });
                }}
              >
                <FormattedLabel id="clear" />
              </Button>
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  router.push(`/veterinaryManagementSystem/dashboard`);
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </div>
          </form>
        </Slide>

        <div className={styles.table}>
          <DataGrid
            autoHeight
            sx={{
              // marginTop: "2vh",
              width: "100%",

              "& .cellColor": {
                backgroundColor: "#1976d2",
                color: "white",
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
        </div>
      </Paper>
    </>
  );
};

export default Index;

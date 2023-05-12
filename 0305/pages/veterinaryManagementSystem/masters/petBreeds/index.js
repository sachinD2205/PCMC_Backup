import React, { useEffect, useState } from "react";
import router from "next/router";
import Head from "next/head";
import styles from "../vetMasters.module.css";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";

import URLs from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";

const Index = () => {
  const [table, setTable] = useState([]);
  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    {
      id: 1,
      petNameEn: "",
      petNameMr: "",
    },
  ]);
  const [runAgain, setRunAgain] = useState(false);
  const [collapse, setCollapse] = useState(false);

  let petSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select a pet animal"),
    breedNameEn: yup
      .string()
      .required("Please enter breed name in english")
      .matches(/^[A-Za-z0-9\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),

    breedNameMr: yup
      .string()
      .required("Please enter breed name in marathi")
      .matches(/^[०-९\u0900-\u097F]+$/, "Must be only marathi characters / फक्त मराठी शब्द "),
  });

  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimalDropDown(() => {
        sortByAsc(res.data.mstPetAnimalList, "nameEn");
        return res.data.mstPetAnimalList.map((j) => ({
          id: j.id,
          petNameEn: j.nameEn,
          petNameMr: j.nameMr,
        }));
      });
    });
  }, []);

  useEffect(() => {
    setRunAgain(false);

    //Get Pet Breeds
    axios.get(`${URLs.VMS}/mstAnimalBreed/getAll`).then((res) => {
      setTable(() => {
        sortByAsc(res.data.mstAnimalBreedList, "breedNameEn");
        return res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          petAnimalKey: j.petAnimalKey,
          breedNameEn: j.breedNameEn,
          breedNameMr: j.breedNameMr,
          petAnimalEn: petAnimalDropDown.find((obj) => obj.id === j.petAnimalKey)?.petNameEn,
          petAnimalMr: petAnimalDropDown.find((obj) => obj.id === j.petAnimalKey)?.petNameMr,
        }));
      });
    });
  }, [runAgain, petAnimalDropDown]);

  const deleteAnimal = (deleteId) => {
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`${URLs.VMS}/mstAnimalBreed/delete/${deleteId}`).then((res) => {
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

      field: language === "en" ? "petAnimalEn" : "petAnimalMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="petAnimal" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "breedNameEn",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="breedNameEn" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "breedNameMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="breedNameMr" />,
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
                console.table({ ...params.row });
                reset({
                  id: params.row.id,
                  petAnimalKey: params.row.petAnimalKey,
                  breedNameEn: params.row.breedNameEn,
                  breedNameMr: params.row.breedNameMr,
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
      .post(`${URLs.VMS}/mstAnimalBreed/save`, { ...data, activeFlag: "Y" })
      .then((res) => {
        if (data.id) {
          sweetAlert("Updated!", "Animal data updated successfully!", "success");
        } else {
          sweetAlert("Success!", "Animal data saved successfully!", "success");
        }
        reset({
          petAnimalKey: "",
          breedNameEn: "",
          breedNameMr: "",
        });
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
          <FormattedLabel id="petBreed" />
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
              <FormControl variant="standard" error={!!error.petAnimalKey}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="petAnimal" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: "250px" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="petAnimalKey"
                    >
                      {petAnimalDropDown &&
                        petAnimalDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.petNameEn
                              : // @ts-ignore
                                value?.petNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="petAnimalKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>{error?.petAnimalKey ? error.petAnimalKey.message : null}</FormHelperText>
              </FormControl>
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="breedNameEn" />}
                variant="standard"
                {...register("breedNameEn")}
                error={!!error.breedNameEn}
                helperText={error?.breedNameEn ? error.breedNameEn.message : null}
              />
              <TextField
                sx={{ width: "250px" }}
                label={<FormattedLabel id="breedNameMr" />}
                variant="standard"
                {...register("breedNameMr")}
                error={!!error.breedNameMr}
                helperText={error?.breedNameMr ? error.breedNameMr.message : null}
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
                    petAnimalKey: null,
                    breedNameEn: "",
                    breedNameMr: "",
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
              marginTop: "5vh",
              width: "100%",

              "& .cellColor": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={10}
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

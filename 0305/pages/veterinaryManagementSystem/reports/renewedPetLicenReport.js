import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import styles from "./report.module.css";

import moment from "moment";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import URLs from "../../../URLS/urls";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Button,
  FormControl,
  TextField,
  Paper,
  FormHelperText,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import sweetAlert from "sweetalert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Print, Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [petAnimal, setPetAnimal] = useState([{ id: 1, nameEn: "", nameMr: "" }]);
  const [petBreeds, setPetBreeds] = useState([{ id: 1, breedEn: "", breedMr: "" }]);

  let reportSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select an animal").typeError("Please select an animal"),
    fromDate: yup.date().typeError(`Please select a from Date`).required(`Please select a from Date`),
    toDate: yup.date().typeError(`Please select a to Date`).required(`Please select a to Date`),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(reportSchema),
  });

  const componentRef = useRef(null);

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: "Renewal of License Report",
  });

  const [table, setTable] = useState([]);

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
      setPetBreeds(
        res.data.mstAnimalBreedList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          breedEn: j.breedNameEn,
          breedMr: j.breedNameMr,
        })),
      );
    });

    // //Get Applications
    // axios
    //   .get(`${URLs.VMS}/trnRenewalPetLicence/getAll`)
    //   .then((res) => {
    //     setTable(
    //       res.data.trnRenewalPetLicenceList.map((j, i) => ({
    //         srNo: i + 1,
    //         id: j.id,
    //         ownerName: j.ownerName,
    //         petName: j.petName,
    //         animalAge: j.animalAge,
    //         animalColor: j.animalColor,
    //         licenseNo: j.licenseNo,
    //         status: j.status,
    //       })),
    //     );
    //   })
    //   .catch((error) => {
    //     console.log("error: ", error);
    //     sweetAlert({
    //       title: "ERROR!",
    //       text: `${error}`,
    //       icon: "error",
    //       buttons: {
    //         confirm: {
    //           text: "OK",
    //           visible: true,
    //           closeModal: true,
    //         },
    //       },
    //       dangerMode: true,
    //     });
    //   });
  }, []);

  const columns = [
    // {
    //   headerClassName: "cellColor",

    //   field: "srNo",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="srNo" />,
    //   width: 80,
    // },

    // {
    //   headerClassName: "cellColor",

    //   field: "licenseNo",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="licenseNo" />,
    //   width: 180,
    // },
    // {
    //   headerClassName: "cellColor",

    //   field: "ownerName",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="ownerName" />,
    //   width: 150,
    // },
    // {
    //   headerClassName: "cellColor",

    //   field: "petName",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="petName" />,
    //   width: 150,
    // },
    // {
    //   headerClassName: "cellColor",

    //   field: "animalAge",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="animalAge" />,
    //   width: 150,
    // },
    // {
    //   headerClassName: "cellColor",

    //   field: "animalColor",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="animalColor" />,
    //   width: 200,
    // },
    // {
    //   headerClassName: "cellColor",

    //   field: "status",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="status" />,
    //   // width: 200,
    //   flex: 1,
    // },

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
      width: 250,
    },

    {
      headerClassName: "cellColor",

      field: language == "en" ? "breedEn" : "breedMr",

      headerAlign: "center",
      headerName: <FormattedLabel id="petBreed" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "petName",

      headerAlign: "center",
      headerName: <FormattedLabel id="petName" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "animalAge",

      headerAlign: "center",
      headerName: <FormattedLabel id="animalAge" />,
      width: 200,
    },

    {
      headerClassName: "cellColor",

      field: "status",

      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 200,
    },
  ];

  const finalSubmit = (data) => {
    const fromDate = moment(data.fromDate).format("DD/MM/YYYY");
    const toDate = moment(data.toDate).format("DD/MM/YYYY");

    axios
      .get(
        `${URLs.VMS}/trnRenewalPetLicence/getAllByFromDateAndToDateAndPetType?fromDate=${fromDate}&toDate=${toDate}&petTypeKey=${data.petAnimalKey}`,
      )
      .then((res) => {
        setTable(
          res.data.trnRenewalPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            ...j,
            breedEn: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedMr,
          })),
        );
      });
  };

  return (
    <>
      <Head>
        <title>Pet License Renewal</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Renewal Pet License Report</div>
        {/* <Paper
          sx={{
            margin: 1,
            padding: 2,
            paddingBottom: "45px",
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
            <Grid item xs={4} className={styles.feildres}>
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>From Date</span>}
                        value={field.value}
                        onChange={(date) => {
                          console.log("dateformat", date);
                          field.onChange(date);
                          setFDate(date);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                      <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} className={styles.feildres}>
              <FormControl style={{ marginTop: 10 }}>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        label={<span style={{ fontSize: 16 }}>To Date</span>}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(date);
                          setTDate(date);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={2} className={styles.feildres}>
              <Button variant="contained" onClick={() => getData()}>
                Search
              </Button>
            </Grid>
            <Grid item xs={2} className={styles.feildres}>
              <Button
                variant="outlined"
                sx={{
                  color: "black",
                  textTransform: "capitalize",
                  // paddingLeft: "100px",
                }}
                onClick={handleToPrint}
              >
                Print
                <PrintIcon
                  sx={{
                    paddingLeft: "10px",
                    fontSize: "37px",
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </Paper> */}

        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl variant="standard" error={!!error.petAnimalKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="petAnimal" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "200px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="petAnimalKey"
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.nameEn : obj.nameMr}
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
            <FormControl error={!!error.fromDate}>
              <Controller
                control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="fromDate" required />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.fromDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{error?.fromDate ? error.fromDate.message : null}</FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              <Controller
                control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="toDate" required />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "200px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.toDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{error?.toDate ? error.toDate.message : null}</FormHelperText>
            </FormControl>

            <div style={{ display: "flex", gap: 20 }}>
              <Button variant="contained" type="submit" endIcon={<Search />}>
                <FormattedLabel id="search" />
              </Button>
              <Button variant="contained" onClick={handleToPrint} endIcon={<Print />}>
                <FormattedLabel id="print" />
              </Button>
            </div>
          </div>
        </form>

        <div ref={componentRef}>
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
              } else if (params.field === "status" && params.value == "Reassigned by Clerk") {
                return "redText";
              } else if (params.field === "status" && params.value == "Reassigned by HOD") {
                return "redText";
              } else if (params.field === "status" && params.value == "Payment Successful") {
                return "blueText";
              } else {
                return "";
              }
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

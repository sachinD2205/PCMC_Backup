import React, { useEffect, useRef, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import URLs from "../../../URLS/urls";
import style from "../transactions/opd/opd.module.css";
import styles from "./report.module.css";

import { Check, CreditCard, Description, Edit, MoreHoriz, Print, Search, Undo } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Controller } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import Head from "next/head";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const petLicenReport = () => {
  // const {
  //   methods,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   // resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const componentRef = useRef(null);

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    // documentTitle: applicationDetails.petName + " License",
  });

  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    {
      id: 1,
      petNameEn: "",
      petNameMr: "",
    },
  ]);
  const [petBreeds, setPetBreeds] = useState([{ id: 1, breedNameEn: "", breedNameMr: "" }]);
  // const [tiles, setTiles] = useState([{ id: 1, label: "", count: 0, icon: <Edit /> }]);
  const [table, setTable] = useState([{ id: 1 }]);
  const [petLicenses, setPetLicenses] = useState([]);
  // const [opdRegistrationTable, setOpdRegistrationTable] = useState([]);
  // const [area, setArea] = useState([{ id: 1, areaEn: "", areaMr: "" }]);
  // const [zone, setZone] = useState([{ id: 1, zoneEn: "", zoneMr: "" }]);
  // const [ward, setWard] = useState([{ id: 1, wardEn: "", wardMr: "" }]);
  const [petAnimal, setPetAnimal] = useState([{ id: 1, nameEn: "", nameMr: "" }]);

  const [fDate, setFDate] = useState();
  const [tDate, setTDate] = useState();

  const filDate = moment(fDate).format("DD/MM/YYYY");
  const filTDate = moment(tDate).format("DD/MM/YYYY");

  // Get date From Date and to date
  const getData = () => {
    axios
      .get(`${URLs.VMS}/trnPetLicence/getAllByFromDateAndToDate?fromDate=${filDate}&toDate=${filTDate}`)
      .then((res) => {
        console.log("0000", res.data.trnAnimalTreatmentIpdList);
        setTable(
          res.data.trnPetLicenceList.map((j, i) => ({
            srNo: i + 1,
            ...j,
            fullAddress: j.addrFlatOrHouseNo + ", " + j.addrBuildingName + ", " + j.detailAddress,
            breedEn: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedNameEn,
            breedMr: petBreeds.find((obj) => obj.id == j.animalBreedKey)?.breedNameMr,
            rabiesStatus: j.antiRabiesVaccinationStatus == "y" ? "Yes" : "No",
          })),
        );
      });
  };

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

    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimalDropDown(
        res.data.mstPetAnimalList.map((j) => ({
          id: j.id,
          petNameEn: j.nameEn,
          petNameMr: j.nameMr,
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
  }, []);

  const columnsPetLicense = [
    {
      headerClassName: "cellColor",

      field: "petLicenceNo",

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
    console.log("Data: ", data);

    const fromDate = moment(data.fromDate).format("DD/MM/YYYY");
    const toDate = moment(data.toDate).format("DD/MM/YYYY");

    axios
      .get(
        `${URLs.VMS}/trnPetLicence/getAllByFromDateAndToDateAndPetType?fromDate=${fromDate}&toDate=${toDate}&petTypeKey=${data.petAnimalKey}`,
      )
      .then((res) => {
        console.log(res.data.trnPetLicenceList);
        setTable(
          res.data.trnPetLicenceList.map((j, i) => ({
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
        <title>Pet License Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={style.title}>Pet License Report</div>
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
              display: "flex",
              alignSelf: "center",
              marginTop: "5vh",
              width: "95%",
              marginLeft: "2%",

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
              } else if (
                params.field === "status" &&
                (params.value == "Reassigned by HOD" || params.value == "Rejected by HOD")
              ) {
                return "redText";
              } else if (params.field === "status" && params.value == "Payment Successful") {
                return "blueText";
              } else {
                return "";
              }
            }}
            rows={table}
            //@ts-ignore
            columns={columnsPetLicense}
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

export default petLicenReport;

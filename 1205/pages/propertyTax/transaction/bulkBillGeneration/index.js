import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../ptaxTransactions.module.css";

import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axios from "axios";
import URLs from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import { ExitToApp, Save } from "@mui/icons-material";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [financialYear, setFinancialYear] = useState([{ id: 1, financialYearEn: "", financialYearMr: "" }]);
  const [propertyType, setPropertyType] = useState([{ id: 1, propertyTypeEn: "", propertyTypeMr: "" }]);
  const [propertySubType, setPropertySubType] = useState([
    { id: 1, propertySubTypeEn: "", propertySubTypeMr: "" },
  ]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [table, setTable] = useState([]);

  const {
    reset,
    watch,
    control,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
  });

  useEffect(() => {
    //Get Financial Year
    axios
      .get(`${URLs.CFCURL}/master/financialYearMaster/getAll`)
      .then((res) => {
        setFinancialYear(
          res.data.financialYear.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
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

    //Get Property Type
    axios
      .get(`${URLs.PTAXURL}/master/propertyType/getAll`)
      .then((res) => {
        setPropertyType(
          res.data.propertyType.map((j) => ({
            id: j.id,
            propertyTypeEn: j.propertyType,
            propertyTypeMr: j.propertyTypeMr,
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

    //Get Property Sub Type
    axios
      .get(`${URLs.PTAXURL}/master/propertySubType/getAll`)
      .then((res) => {
        setPropertySubType(
          res.data.propertySubType.map((j) => ({
            id: j.id,
            propertySubTypeEn: j.propertySubType,
            propertySubTypeMr: j.propertySubTypeMr,
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

  useEffect(() => {
    if (financialYear[0]["financialYearEn"] != "") {
      setValue("year", financialYear[0]["financialYearEn"]);
      //Table Data
      getAllForBilling(financialYear[0]["financialYearEn"]);
    }
  }, [financialYear]);

  const getAllForBilling = (year) => {
    //Table
    axios
      .post(`${URLs.PTAXURL}/transaction/property/bill/getPropertyByForBilling`, { financialYear: year })
      .then((res) => {
        res.data.forEach((element) => {
          console.log("Full name: ", element.propertyHoldersDetails[0]);
        });
        setTable(
          res.data.map((j, i) => ({
            // srNo: i + 1,
            id: j.id,
            propertyCode: j.propertyCode,
            propertyNameEn: j.propertyNameEng,
            propertyNameMr: j.propertyNameMr,
            // propertyHolderNameEn: j.propertyHoldersDetails[0].fullNameEng
            //   ? j.propertyHoldersDetails[0].fullNameEng
            //   : "---",
            // propertyHolderNameMr: j.propertyHoldersDetails ? j.propertyHoldersDetails[0].fullNameMr : "---",
            propertyHolderNameEn:
              j.propertyHoldersDetails[0] != undefined
                ? j.propertyHoldersDetails[0].fullNameEng ?? " ---"
                : "---",
            propertyHolderNameMr:
              j.propertyHoldersDetails[0] != undefined
                ? j.propertyHoldersDetails[0].fullNameMr ?? " ---"
                : "---",
          })),
        );
      });
  };

  const columns = [
    {
      headerClassName: "cellColor",
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 100,
    },
    // {
    //   headerClassName: "cellColor",
    //   align: "center",
    //   field: "srNo",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="srNo" />,
    //   width: 100,
    // },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "propertyNameEn" : "propertyNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="propertyName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "propertyHolderNameEn" : "propertyHolderNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="propertyHolderName" />,
      width: 250,
    },
  ];

  const generateBill = () => {
    const bodyForApi = {
      year: watch("year"),
      propertyCodes: selectedProperties,
    };

    axios.post(`${URLs.SLUMURL}/transaction/property/bill/generate`, bodyForApi).then((res) => {
      console.log(res.data);
    });
  };

  return (
    <>
      <Head>
        <title>Bulk Bill Generation</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Bulk Bill Generation</div>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <FormControl
            // disabled={router.query.pageMode == "view" ? true : false}
            variant="standard"
            error={!!error.year}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="financialYear" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: "250px" }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  // @ts-ignore
                  value={field.value}
                  onChange={(value) => {
                    getAllForBilling(value.target.value);
                    field.onChange(value);
                  }}
                  label="year"
                >
                  {financialYear &&
                    financialYear.map((value, index) => (
                      <MenuItem
                        key={index}
                        value={
                          //@ts-ignore
                          value.financialYearEn
                        }
                      >
                        {language == "en"
                          ? //@ts-ignore
                            value.financialYearEn
                          : // @ts-ignore
                            value?.financialYearMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="year"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{error?.year ? error.year.message : null}</FormHelperText>
          </FormControl>
        </div>
        <div className={styles.row} style={{ justifyContent: "center" }}>
          <DataGrid
            autoHeight
            sx={{
              marginTop: "2vh",
              maxWidth: "85%",

              "& .cellColor": {
                backgroundColor: "#125597",
                color: "white",
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            // disableSelectionOnClick
            onSelectionModelChange={(allRowsId) => {
              // @ts-ignore
              setSelectedProperties(allRowsId);
            }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>

        <div className={styles.buttons}>
          <Button variant="contained" endIcon={<Save />} onClick={generateBill}>
            <FormattedLabel id="save" />
          </Button>
          <Button
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.back();
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;

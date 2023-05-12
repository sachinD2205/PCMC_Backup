import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import styles from "./view.module.css";

// witness
const NewsPapers = () => {
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [newsPaper, setNewsPaper] = useState([]);
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext({ defaultValues: { newsPapersLst: [] }, });

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "newsPapersLst", // unique name for your Field Array
  });

  //  Append Function
  const appendFun = () => {
    append({

      totalNetAmount: "",
      totalTaxDeduction: "",
      totalDeduction: "",
      totalAmount: "",
      approvedRate: "",
      calculatedRate: "",
      agencyBillWiseRate: "",
      standarFormatSize: "",
      agencyPublishedDate: "",
      newsPaper: "",

      // wtitle: "",
      // witnessFName: "",
      // witnessMName: "",
      // witnessLName: "",
      // genderKey: "",
      // witnessAddressC: "",
      // aadharNo: "",
      // witnessMobileNo: "",
      // emailAddress: "",
      // witnessAge: "",
      // witnessRelation: "",
      // witnessDocumentKey: "",
      // witnessDob: null,
    });
  };

  // Call Append In UseEffect - First Time Only
  useEffect(() => {
    if (getValues(`newsPapersLst.length`) == 0) {
      appendFun();
    }
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    // 
    // 
    let npss = getValues("newsPapers").split(",");
    if (getValues(`newsPapersLst.length`) >= npss.length) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

  const getNewsPapers = () => {

    let newsPapers = getValues("newsPapers")?.split(",");

    console.log("newsPapers", newsPapers);

    axios
      .get(
        `${urls.NRMS}/newspaperMaster/getAll`,
      ).then((r) => {
        let finall = r.data.newspaperMasterList.filter((x) => newsPapers?.includes(x.id.toString()));
        console.log("finall", finall);
        setNewsPaper(finall);
      });

  };

  useEffect(() => {
    if (getValues("newsPapers")) {
      console.log("News Papers Commoa Separated", getValues("newsPapers"));
      getNewsPapers()
    }
  }, [getValues("newsPapers")]);



  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
    } else {
      setDisabled(true);
      console.log("disabled");
    }
  }, [router.query.pageMode]);

  return (
    <>
      {fields.map((witness, index) => {
        return (
          <Grid key={index}>
            <div
              className={styles.row}
            >
              <div
                className={styles.details}
                style={{
                  marginRight: "820px",
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "300px",
                  }}
                >
                  <h3
                    style={{
                      color: "white",
                      marginTop: "7px",
                    }}
                  >
                    News Paper
                    {/* {<FormattedLabel id="witness" />} */}
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>

            <Grid container>

              <Grid container>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

                  <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.newsPaper}>
                    <InputLabel id="demo-simple-select-standard-label">
                      {/* {<FormattedLabel id="Gender" required />} */}
                      News Paper
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={disabled}
                          sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={language == "en" ? "News Paper *" : "वृत्तपत्र *"}
                        >
                          {console.log("newsPaperrrrr", newsPaper) &&
                            newsPaper?.map((n, index) => (
                              <MenuItem key={index} value={n.id}>
                                {language == "en" ? n?.newspaperName : n?.newspaperNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name={`newsPapersLst.${index}.newsPaper`}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.newsPaper ? errors.newsPaper.message : null}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl error={!!errors.agencyPublishedDate} sx={{ marginTop: 0 }}>
                    <Controller
                      control={control}
                      name="agencyPublishedDate"
                      defaultValue={null}
                      format="DD/MM/YYYY"
                      key={witness.id}
                      {...register(`newsPapersLst.${index}.agencyPublishedDate`)}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={disabled}
                            maxDate={new Date()}
                            inputFormat="DD/MM/YYYY"
                            label={
                              // <span style={{ fontSize: 16 }}>{<FormattedLabel id="BirthDate" required />}</span>
                              <span style={{ fontSize: 16 }}>{language == 'en' ? 'Published Date' : 'प्रकाशन दिनांक'}</span>
                            }
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(moment(date).format("YYYY-MM-DD"));
                            }}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                    marginTop: 3,
                                    padding: 2,
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.newsPapersLst?.[index]?.agencyPublishedDate
                        ? errors?.newsPapersLst?.[index]?.agencyPublishedDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={disabled}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    label={language == 'en' ? "Standard Format Size" : "मानक स्वरूप आकार"}
                    variant="standard"
                    key={witness.id}
                    {...register(`newsPapersLst.${index}.standarFormatSize`)}
                    error={!!errors?.newsPapersLst?.[index]?.standarFormatSize}
                    helperText={
                      errors?.newsPapersLst?.[index]?.standarFormatSize
                        ? errors?.newsPapersLst?.[index]?.standarFormatSize.message
                        : null
                    }
                  />
                </Grid>
              </Grid>

              <Grid container>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "Agency Bill Wise Rate" : "एजन्सी बिलप्रमाणे दर (प्र.से.मी)"}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.agencyBillWiseRate`)}

                    error={!!errors?.agencyBillWiseRate?.[index]?.agencyBillWiseRate}

                    helperText={
                      errors?.newsPapersLst?.[index]?.agencyBillWiseRate ? errors?.newsPapersLst?.[index]?.agencyBillWiseRate.message : null
                    }

                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "Calculated Rate" : "गणना केलेला दर (प्र.से.मी)"}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.calculatedRate`)}

                    error={!!errors?.newsPapersLst?.[index]?.calculatedRate}

                    helperText={
                      errors?.newsPapersLst?.[index]?.calculatedRate ? errors?.newsPapersLst?.[index]?.calculatedRate.message : null
                    }

                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "Approved Rate" : "मंजूर दर (प्र.से.मी)"}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.approvedRate`)}

                    error={!!errors?.newsPapersLst?.[index]?.approvedRate}

                    helperText={
                      errors?.newsPapersLst?.[index]?.approvedRate ? errors?.newsPapersLst?.[index]?.approvedRate.message : null
                    }

                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "Total Amount" : "एकूण रक्कम रु."}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.totalAmount`)}

                    error={!!errors?.newsPapersLst?.[index]?.totalAmount}

                    helperText={
                      errors?.newsPapersLst?.[index]?.totalAmount ? errors?.newsPapersLst?.[index]?.totalAmount.message : null
                    }

                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "Penalty Deductions" : "वजा दंड र रु."}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.totalDeduction`)}

                    error={!!errors?.agencyBillWiseRate?.[index]?.totalDeduction}

                    helperText={
                      errors?.newsPapersLst?.[index]?.totalDeduction ? errors?.totalDeduction?.[index]?.totalDeduction.message : null
                    }

                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "TDS Deduction" : "वजा टीडीएस र रु."}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.totalTaxDeduction`)}

                    error={!!errors?.newsPapersLst?.[index]?.totalTaxDeduction}

                    helperText={
                      errors?.newsPapersLst?.[index]?.totalTaxDeduction ? errors?.newsPapersLst?.[index]?.totalTaxDeduction.message : null
                    }

                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField

                    disabled={disabled}

                    //InputLabelProps={{ shrink: (watch('newsPapersLst.${index}.aadharNo') ? true : false) }}

                    sx={{ width: 230 }}

                    id="standard-basic"
                    //  disabled={disabledrouter?.query?.disabled}

                    label={language == 'en' ? "Total Payeble" : "निव्वळ देय र रु."}

                    // label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"

                    key={witness.id}

                    {...register(`newsPapersLst.${index}.totalNetAmount`)}

                    error={!!errors?.newsPapersLst?.[index]?.totalNetAmount}

                    helperText={
                      errors?.newsPapersLst?.[index]?.totalNetAmount ? errors?.newsPapersLst?.[index]?.totalNetAmount.message : null
                    }

                  />
                </Grid>

              </Grid>
            </Grid>

          </Grid>

        );
      })}
      {router?.query?.pageMode === "Add" || router?.query?.pageMode === "Edit" ? (
        <div className={styles.row} style={{ marginTop: 50 }}>
          <Button
            disabled={fields.length > 2 ? true : btnValue}
            onClick={() => buttonValueSetFun()}
            variant="contained"
          >
            Add News Paper
            {/* {<FormattedLabel id="witnessAdd" />} */}
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default NewsPapers;
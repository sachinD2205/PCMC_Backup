import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";
import styles from "../marriageRegistration/view.module.css";
// witness
const Witness = () => {
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
    } else {
      setDisabled(true);
      console.log("disabled");
    }
  }, [router.query.pageMode]);

  // useEffect(() => {
  //   dateConverter()
  // }, [])

  // const dateConverter = (gBirthDates, marriageDate) => {
  //   const groomAge = Math.floor(
  //     moment(getValues('marriageDate')).format('YYYY') -
  //       moment(getValues('witnessDob')).format('YYYY'),
  //   )

  //   console.log('a1234', groomAge)
  // }
  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getGGenders
  const getgenderKeys = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setgenderKeys(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        })),
      );
    });
  };

  // Titles
  const [wTitles, setwTitles] = useState([]);
  // getTitles
  const getwTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setwTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titlemr: row.titleMr,
        })),
      );
    });
  };

  // Status at time mR
  const [witnessRelations, setwitnessRelations] = useState([]);

  // getStatus at time mR
  const getwitnessRelations = () => {
    axios.get(`${urls.MR}/master/relation/getAll`).then((r) => {
      setwitnessRelations(
        r.data.relation.map((row) => ({
          id: row.id,
          relation: row.relation,
          relationMar: row.relationMar,
        })),
      );
    });
  };

  useEffect(() => {
    getgenderKeys();
    getwTitles();
    getwitnessRelations();
  }, []);

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "witnesses", // unique name for your Field Array
  });

  const [witnessAddBtn, setWitnessAddBtn] = useState(false);
  // if (fields.length == 2) {
  //   setWitnessAddBtn(true);
  // }

  //  Append Function
  const appendFun = () => {
    append({
      wtitle: "",
      witnessFName: "",
      witnessMName: "",
      witnessLName: "",
      genderKey: "",
      witnessAddressC: "",
      aadharNo: "",
      witnessMobileNo: "",
      emailAddress: "",
      witnessAge: "",
      witnessRelation: "",
      witnessDocumentKey: "",
      witnessDob: null,
    });
  };

  // Call Append In UseEffect - First Time Only
  useEffect(() => {
    if (getValues(`witnesses.length`) == 0) {
      appendFun();
    }
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`witnesses.length`) >= 3) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

  useEffect(() => {
    dateConverter();
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setDisabled(false);
      console.log("enabled");
    } else {
      setValue(
        "witnessAge",
        calculateAge(
          moment(getValues("marriageDate")).format("YYYY"),
          moment(getValues("witnessDob")).format("YYYY"),
        ),
      );

      setDisabled(true);
      console.log("disabled");
    }
  }, []);

  const dateConverter = (witnessDobs) => {
    let marriageDate = new Date(getValues("marriageDate"));
    let dob = new Date(witnessDobs);
    var age = marriageDate.getFullYear() - dob.getFullYear();
    var m = marriageDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && marriageDate.getDate() < dob.getDate())) {
      age--;
    }
    console.log("age", age);
  };
  function calculateAge(marriageDate, witnessDob) {
    const duration = moment.duration(moment(marriageDate).diff(moment(witnessDob)));
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();

    return years;
  }

  const ageDiff = calculateAge(
    moment(getValues("marriageDate")).format("YYYY-MM-DD"),
    moment(getValues("witnessDob")).format("YYYY-MM-DD"),
  );

  return (
    <>
      {fields.map((witness, index) => {
        return (
          <div key={index}>
            <div
              className={styles.row}
              // style={{
              //   height: '7px',
              //   width: '200px',
              // }}
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
                    {<FormattedLabel id="witness" />}
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <FormControl variant="standard" error={!!errors.wtitle} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="title1" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          if (value.target.value == 1) {
                            console.log("`witnesses.${index}.genderKey`", `witnesses.${index}.genderKey`);
                            setValue(`witnesses.${index}.genderKey`, 1);
                          } else if (value.target.value == 2) {
                            setValue(`witnesses.${index}.genderKey`, 2);
                          }
                          // setdrop(value.target.value)
                        }}
                        label="Title *"
                        id="component-error"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {wTitles &&
                          wTitles.map((wtitle, index) => (
                            <MenuItem key={index} value={wtitle.id}>
                              {/* {title.title} */}
                              {language == "en" ? wtitle?.title : wtitle?.titlemr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.wtitle`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {/* {errors?.wtitle ? errors.wtitle.message : null} */}
                    {errors?.witnesses?.[index]?.wtitle ? errors?.witnesses?.[index]?.wtitle.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  sx={{ width: 230 }}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessFName') ? true : false) }}
                  // id="standard-basic"
                  id="component-error"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="firstName" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessFName`)}
                  error={!!errors?.witnesses?.[index]?.witnessFName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessFName
                      ? errors?.witnesses?.[index]?.witnessFName.message
                      : null
                  }
                />
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessMName') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMName`)}
                  error={!!errors?.witnesses?.[index]?.witnessMName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMName
                      ? errors?.witnesses?.[index]?.witnessMName.message
                      : null
                  }
                />
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessLName') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" required />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessLName`)}
                  error={!!errors?.witnesses?.[index]?.witnessLName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessLName
                      ? errors?.witnesses?.[index]?.witnessLName.message
                      : null
                  }
                />
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.genderKey}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="Gender" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          console.log("`witnesses.${index}.wtitle`", `witnesses.${index}.wtitle`);
                          if (value.target.value == 1) {
                            console.log("`witnesses.${index}.wtitle`", `witnesses.${index}.wtitle`);
                            setValue(`witnesses.${index}.wtitle`, 1);
                          } else if (value.target.value == 2) {
                            setValue(`witnesses.${index}.wtitle`, 2);
                          }
                        }}
                        label="Gender *"
                      >
                        {genderKeys &&
                          genderKeys.map((genderKey, index) => (
                            <MenuItem key={index} value={genderKey.id}>
                              {/* {gGender.gGender} */}
                              {language == "en" ? genderKey?.gender : genderKey?.genderMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.genderKey`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.genderKey ? errors.genderKey.message : null}</FormHelperText>
                </FormControl>
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessAddressC') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="address" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessAddressC`)}
                  error={!!errors?.witnesses?.[index]?.witnessAddressC}
                  helperText={
                    errors?.witnesses?.[index]?.witnessAddressC
                      ? errors?.witnesses?.[index]?.witnessAddressC.message
                      : null
                  }
                />
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.aadharNo') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="AadharNo" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.aadharNo`)}
                  error={!!errors?.witnesses?.[index]?.aadharNo}
                  helperText={
                    errors?.witnesses?.[index]?.aadharNo ? errors?.witnesses?.[index]?.aadharNo.message : null
                  }
                />
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessMobileNo') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="mobileNo" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMobileNo`)}
                  error={!!errors?.witnesses?.[index]?.witnessMobileNo}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMobileNo
                      ? errors?.witnesses?.[index]?.witnessMobileNo.message
                      : null
                  }
                />
              </div>
              {/* <div>
                <TextField
                   
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="phoneNo" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMobileNo`)}
                  // error={!!errors.witnessMobileNo}
                  // helperText={
                  //   errors?.witnessMobileNo
                  //     ? errors.witnessMobileNo.message
                  //     : null
                  // }
                />
              </div> */}
            </div>

            <div
              className={styles.row}
              // style={{ marginRight: '25%' }}
            >
              <div>
                <TextField
                  disabled={disabled}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.emailAddress') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="email" />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.emailAddress`)}
                  error={!!errors?.witnesses?.[index]?.emailAddress}
                  helperText={
                    errors?.witnesses?.[index]?.emailAddress
                      ? errors?.witnesses?.[index]?.emailAddress.message
                      : null
                  }
                />
              </div>
              <div>
                <FormControl error={!!errors.witnessDob} sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="witnessDob"
                    defaultValue={null}
                    format="DD/MM/YYYY"
                    key={witness.id}
                    {...register(`witnesses.${index}.witnessDob`)}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={disabled}
                          maxDate={new Date()}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>{<FormattedLabel id="BirthDate" required />}</span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                            let marriageDate = new Date(getValues("marriageDate"));
                            let dob = new Date(date);
                            var age = marriageDate.getFullYear() - dob.getFullYear();

                            console.log("age", age, marriageDate, dob);
                            setValue(`witnesses.${index}.witnessAge`, age);

                            // setValue(
                            //   `witnesses.${index}.witnessAge`,
                            //   calculateAge(
                            //     moment(getValues("marriageDate")).format("YYYY-MM-DD"),
                            //     moment(getValues("witnessDob")).format("YYYY-MM-DD"),
                            //   ),
                            // );
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
                    {errors?.witnesses?.[index]?.witnessDob
                      ? errors?.witnesses?.[index]?.witnessDob.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div>
                <TextField
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="Age" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessAge`)}
                  error={!!errors?.witnesses?.[index]?.witnessAge}
                  helperText={
                    errors?.witnesses?.[index]?.witnessAge
                      ? errors?.witnesses?.[index]?.witnessAge.message
                      : null
                  }
                />
              </div>
              <div>
                <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.witnessRelation}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="wRelation" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="  Witness Relation *"
                      >
                        {witnessRelations &&
                          witnessRelations.map((witnessRelation, index) => (
                            <MenuItem key={index} value={witnessRelation.id}>
                              {/* {witnessRelation.witnessRelation} */}
                              {language == "en" ? witnessRelation?.relation : witnessRelation?.relationMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.witnessRelation`}
                    key={witness.id}
                    control={control}
                    defaultValue=""
                  />

                  <FormHelperText>
                    {errors?.witnesses?.[index]?.witnessRelation
                      ? errors?.witnesses?.[index]?.witnessRelation.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>
              {/* <div>
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={!!errors.witnessDocumentKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="wDocument" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="  Witness Document *"
                      >
                        {witnessDocumentKeys &&
                          witnessDocumentKeys.map(
                            (witnessDocumentKey, index) => (
                              <MenuItem
                                key={index}
                                value={witnessDocumentKey.id}
                              >
                                {witnessDocumentKey.witnessDocumentKey}
                              </MenuItem>
                            ),
                          )}

                        <MenuItem value={1}>Pan Card</MenuItem>
                        <MenuItem value={2}>Aadhaar card</MenuItem>
                        <MenuItem value={3}>bonafide certificate</MenuItem>
                      </Select>
                    )}
                    name={`witnesses.${index}.witnessDocumentKey`}
                    key={witness.id}
                    control={control}
                    defaultValue=""
                  />

                  <FormHelperText>
                    {errors?.witnessDocumentKey
                      ? errors.witnessDocumentKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div> */}
            </div>
            {/* <Button
               disabled={disabledbtnValue}
              onClick={() => index + 1}
              variant='contained'
            >
              Add
            </Button> */}
          </div>
        );
      })}
      {router?.query?.pageMode === "Add" || router?.query?.pageMode === "Edit" ? (
        <div className={styles.row} style={{ marginTop: 50 }}>
          <Button
            disabled={fields.length > 2 ? true : btnValue}
            onClick={() => buttonValueSetFun()}
            variant="contained"
          >
            {<FormattedLabel id="witnessAdd" />}
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Witness;

// import {
//   Button,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   TextField,
//   Paper,
// } from '@mui/material'
// import { Controller, useFormContext, useFieldArray } from 'react-hook-form'
// import styles from '../../newMarriageRegistration/view.module.css'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import urls from '../../../../URLS/urls'
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
// import { useSelector } from 'react-redux'

// // witness
// const Witness = () => {
//   const {
//     control,
//     register,
//     reset,
//     getValues,
//     formState: { errors },
//   } = useFormContext()
//   const language = useSelector((state) => state?.labels.language)

//   // genders
//   const [genderKeys, setgenderKeys] = useState([])

//   // getGGenders
//   const getgenderKeys = () => {
//     axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
//       setgenderKeys(
//         r.data.map((row) => ({
//           id: row.id,
//           gender: row.gender,
//           genderMr: row.genderMr,
//         })),
//       )
//     })
//   }

//   // Titles
//   const [wTitles, setwTitles] = useState([])
//   // getTitles
//   const getwTitles = () => {
//     axios.get(`${urls.BaseURL}/title/getAll`).then((r) => {
//       setwTitles(
//         r.data.map((row) => ({
//           id: row.id,
//           title: row.title,
//           titlemr: row.titlemr,
//         })),
//       )
//     })
//   }

//   // // genders
//   // const [gGenders, setGGenders] = useState([]);

//   // // getGGenders
//   // const getGGenders = () => {
//   //   axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
//   //     setGGenders(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         gGender: row.gender,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // genders
//   // const [gGenders, setGGenders] = useState([]);

//   // // getGGenders
//   // const getGGenders = () => {
//   //   axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
//   //     setGGenders(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         gGender: row.gender,
//   //       })),
//   //     );
//   //   });
//   // };

//   useEffect(() => {
//     getgenderKeys()
//     getwTitles()
//   }, [])

//   //key={field.id}
//   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
//     {
//       control, // control props comes from useForm (optional: if you are using FormContext)
//       name: 'witnesses', // unique name for your Field Array
//     },
//   )

//   const [witnessAddBtn, setWitnessAddBtn] = useState(false)
//   // if (fields.length == 2) {
//   //   setWitnessAddBtn(true);
//   // }

//   //  Append Function
//   const appendFun = () => {
//     append({
//       wTitles: '',
//       witnessFName: '',
//       witnessMName: '',
//       witnessLName: '',
//       genderKey: '',
//       witnessAddressC: '',
//       aadharNo: '',
//       witnessMobileNo: '',
//       emailAddress: '',
//       witnessAge: '',
//       witnessRelation: '',
//       witnessDocumentKey: '',
//     })
//   }

//   // Call Append In UseEffect - First Time Only
//   useEffect(() => {
//     if (getValues(`witnesses.length`) == 0) {
//       appendFun()
//     }
//   }, [])

//   const [btnValue, setButtonValue] = useState(false)

//   // Disable Add Button After Three Wintess Add
//   const buttonValueSetFun = () => {
//     if (getValues(`witnesses.length`) >= 3) {
//       setButtonValue(true)
//     } else {
//       appendFun()
//       setButtonValue(false)
//     }
//   }

//   return (
//     <>
//       {fields.map((witness, index) => {
//         return (
//           <div>
//             <div
//               className={styles.row}
//               // style={{
//               //   height: '7px',
//               //   width: '200px',
//               // }}
//             >
//               <div
//                 className={styles.details}
//                 style={{
//                   marginRight: '820px',
//                 }}
//               >
//                 <div
//                   className={styles.h1Tag}
//                   style={{
//                     height: '40px',
//                     width: '300px',
//                   }}
//                 >
//                   <h3
//                     style={{
//                       color: 'white',
//                       marginTop: '7px',
//                     }}
//                   >
//                     {<FormattedLabel id="witness" />}
//                     {`: ${index + 1}`}
//                   </h3>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   error={!!errors.wtitle}
//                   sx={{ marginTop: 2 }}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="title" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="Title *"
//                         id="demo-simple-select-standard"
//                         labelId="id='demo-simple-select-standard-label'"
//                       >
//                         {wTitles &&
//                           wTitles.map((wtitle, index) => (
//                             <MenuItem key={index} value={wtitle.id}>
//                               {/* {title.title} */}
//                               {language == 'en'
//                                 ? wtitle?.title
//                                 : wtitle?.titlemr}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="wtitle"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.wtitle ? errors.wtitle.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="firstName" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessFName`)}
//                   // error={!!errors.witnessFName}
//                   // helperText={
//                   //   errors?.witnessFName ? errors.witnessFName.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="middleName" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessMName`)}
//                   // error={!!errors.witnessMName}
//                   // helperText={
//                   //   errors?.witnessMName ? errors.witnessMName.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="lastName" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessLName`)}
//                   // error={!!errors.witnessLName}
//                   // helperText={
//                   //   errors?.witnessLName ? errors.witnessLName.message : null
//                   // }
//                 />
//               </div>
//             </div>

//             <div className={styles.row}>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ marginTop: 2 }}
//                   error={!!errors.genderKey}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="Gender" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 230 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="Gender *"
//                       >
//                         {genderKeys &&
//                           genderKeys.map((genderKey, index) => (
//                             <MenuItem key={index} value={genderKey.id}>
//                               {/* {gGender.gGender} */}
//                               {language == 'en'
//                                 ? genderKey?.gender
//                                 : genderKey?.genderMr}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="genderKey"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.genderKey ? errors.genderKey.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="address" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessAddressC`)}
//                   // error={!!errors.witnessAddressC}
//                   // helperText={
//                   //   errors?.witnessAddressC
//                   //     ? errors.witnessAddressC.message
//                   //     : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="AadharNo" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.aadharNo`)}
//                   // error={!!errors.aadharNo}
//                   // helperText={errors?.aadharNo ? errors.aadharNo.message : null}
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="mobileNo" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessMobileNo`)}
//                   // error={!!errors.witnessMobileNo}
//                   // helperText={
//                   //   errors?.witnessMobileNo
//                   //     ? errors.witnessMobileNo.message
//                   //     : null
//                   // }
//                 />
//               </div>
//               {/* <div>
//                 <TextField

//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="phoneNo" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessMobileNo`)}
//                   // error={!!errors.witnessMobileNo}
//                   // helperText={
//                   //   errors?.witnessMobileNo
//                   //     ? errors.witnessMobileNo.message
//                   //     : null
//                   // }
//                 />
//               </div> */}
//             </div>

//             <div className={styles.row} style={{ marginRight: '25%' }}>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="email" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.emailAddress`)}
//                   // error={!!errors.emailAddress}
//                   // helperText={
//                   //   errors?.emailAddress ? errors.emailAddress.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="Age" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessAge`)}
//                   // error={!!errors.witnessAge}
//                   // helperText={
//                   //   errors?.witnessAge ? errors.witnessAge.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ marginTop: 2 }}
//                   // error={!!errors.witnessRelation}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="wRelation" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 230 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="  Witness Relation *"
//                       >
//                         {/* {witnessRelations &&
//                              witnessRelations.map((witnessRelation, index) => (
//                                <MenuItem key={index} value={witnessRelation.id}>
//                                  {witnessRelation.witnessRelation}
//                                </MenuItem>
//                              ))} */}

//                         <MenuItem value="Brother">Brother</MenuItem>
//                         <MenuItem value="Uncle">Uncle</MenuItem>
//                         <MenuItem value="GrandFather">Grand Father</MenuItem>
//                         <MenuItem value="GrandMother">Grand Mother</MenuItem>
//                         <MenuItem value="Sister">Sister</MenuItem>
//                         <MenuItem value="Friend">Friend</MenuItem>
//                       </Select>
//                     )}
//                     name={`witnesses.${index}.witnessRelation`}
//                     key={witness.id}
//                     control={control}
//                     defaultValue=""
//                   />
//                   {/**

//                     <FormHelperText>
//                       {errors?.witnessRelation
//                         ? errors.witnessRelation.message
//                         : null}
//                     </FormHelperText>
//                   */}
//                 </FormControl>
//               </div>
//               {/* <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ marginTop: 2 }}
//                   error={!!errors.witnessDocumentKey}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="wDocument" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 230 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="  Witness Document *"
//                       >
//                         {witnessDocumentKeys &&
//                           witnessDocumentKeys.map(
//                             (witnessDocumentKey, index) => (
//                               <MenuItem
//                                 key={index}
//                                 value={witnessDocumentKey.id}
//                               >
//                                 {witnessDocumentKey.witnessDocumentKey}
//                               </MenuItem>
//                             ),
//                           )}

//                         <MenuItem value={1}>Pan Card</MenuItem>
//                         <MenuItem value={2}>Aadhaar card</MenuItem>
//                         <MenuItem value={3}>bonafide certificate</MenuItem>
//                       </Select>
//                     )}
//                     name={`witnesses.${index}.witnessDocumentKey`}
//                     key={witness.id}
//                     control={control}
//                     defaultValue=""
//                   />

//                   <FormHelperText>
//                     {errors?.witnessDocumentKey
//                       ? errors.witnessDocumentKey.message
//                       : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div> */}
//             </div>
//             {/* <Button
//                disabled={disabledbtnValue}
//               onClick={() => index + 1}
//               variant='contained'
//             >
//               Add
//             </Button> */}
//           </div>
//         )
//       })}
//       <div className={styles.row} style={{ marginTop: 50 }}>
//         <Button
//            disabled={disabledbtnValue}
//           onClick={() => buttonValueSetFun()}
//           variant="contained"
//         >
//           {<FormattedLabel id="witnessAdd" />}
//         </Button>
//       </div>
//     </>
//   )
// }

// export default Witness

import { ThemeProvider } from "@emotion/react";
import React from "react";
import theme from "../../../../theme";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "witnesses", // unique name for your Field Array
  });

  console.log(":fields", fields);

  const language = useSelector((store) => store.labels.language);

  let onSubmitFunc = () => {
    console.log("onSubmitFunc");
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          margin: "30px",
          marginBottom:"100px"
          
        }}
        elevation={2}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              {/* <FormattedLabel id="RoadExcavation_NocPermission" /> */}
              {
                language=="en"
                ?"ROAD EXCAVATION / NOC PERMISSION"
                :"रस्ता खोदाई / एनओसी परवानगी"
              }
              
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="applicationNumber" />}
                  // variant="outlined"
                  variant="standard"
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                 <Typography>{language=="en"
                     ?"Company Name"
                     :"अर्जदाराचे नाव तपशील"
                   }</Typography>
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  // label="Company Name"
                  // variant="outlined"
                  variant="standard"
                  {...register("companyName")}
                  error={!!errors.companyName}
                  helperText={errors?.companyName ? errors.companyName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                 <FormControl>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 40, width: "250px" }}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="roadType"
                    >
                      <FormControlLabel value="BRTS ROAD" control={<Radio />} label="BRTS ROAD" />
                      <FormControlLabel value="INTERNAL ROAD" control={<Radio />} label="INTERNAL ROAD" />
                    </RadioGroup>
                  </div>
                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="First Name"
                  // variant="outlined"
                  variant="standard"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors?.firstName ? errors.firstName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Middle Name"
                  // variant="outlined"
                  variant="standard"
                  {...register("middleName")}
                  error={!!errors.middleName}
                  helperText={errors?.middleName ? errors.middleName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Surname/Lastname"
                  // variant="outlined"
                  variant="standard"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop:"20px"
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label="LandLine No."
                  variant="standard"
                  {...register("landLineNo")}
                  error={!!errors.landLineNo}
                  helperText={errors?.landLineNo ? errors.landLineNo.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                 <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Mobile No."
                  // variant="outlined"
                  variant="standard"
                  {...register("mobileNo")}
                  error={!!errors.mobileNo}
                  helperText={errors?.mobileNo ? errors.mobileNo.message : null}
                />
              </Grid>
              {/* //////////////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Email ID"
                  // variant="outlined"
                  variant="standard"
                  {...register("emailID")}
                  error={!!errors.emailID}
                  helperText={errors?.emailID ? errors.emailID.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Main Scheme"
                  // variant="outlined"
                  variant="standard"
                  {...register("mainScheme")}
                  error={!!errors.mainScheme}
                  helperText={errors?.mainScheme ? errors.mainScheme.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Sub Scheme"
                  // variant="outlined"
                  variant="standard"
                  {...register("subScheme")}
                  error={!!errors.subScheme}
                  helperText={errors?.subScheme ? errors.subScheme.message : null}
                />
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Email ID"
                  // variant="outlined"
                  variant="standard"
                  {...register("emailID")}
                  error={!!errors.emailID}
                  helperText={errors?.emailID ? errors.emailID.message : null}
                />
              </Grid> */}
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
              <FormControl>
                <Grid container spacing={1}
               >
                <Grid item  sx={{
                  marginTop:"6px"
                }}> <FormLabel id="demo-row-radio-buttons-group-label">Eligible for Scheme</FormLabel>
                  </Grid>
                <Grid item>
                <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                  </Grid>

                </Grid>
     
    
    </FormControl>
    </Grid>
              {/* ////////////////////////////////////////// */}
               <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Permit Period"
                  // variant="outlined"
                  variant="standard"
                  {...register("permitPeriod")}
                  error={!!errors.permitPeriod}
                  helperText={errors?.permitPeriod ? errors.permitPeriod.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
               <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Scope Of Work"
                  // variant="outlined"
                  variant="standard"
                  {...register("scopeOfWork")}
                  error={!!errors.scopeOfWork}
                  helperText={errors?.scopeOfWork ? errors.scopeOfWork.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              
              {/* ////////////////////////////////////////// */}
              
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}
           <Box
           sx={{
            marginLeft:"70px",
            marginTop:"20px"
           }}>
           <Typography>Excavation Details
           </Typography>
            
            
           </Box>
           <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
              <FormControl xs={12}
                sm={6}
                md={4} error={!!errors.wardId}>
                        <InputLabel>Zone</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              variant="standard"
                            >
                             
                              <MenuItem value={"zone1"}>Zone1</MenuItem>
                              <MenuItem value={"zone2"}>Zone2</MenuItem>
                              <MenuItem value={"zone3"}>Zone3</MenuItem>
                              <MenuItem value={"zone4"}>Zone4</MenuItem>
                            </Select>
                          )}
                          name="zoneId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneId ? errors.zoneId.message : null}</FormHelperText>
                      </FormControl>
                      </Grid>
                      <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
            <FormControl xs={12}
                sm={6}
                md={4} error={!!errors.wardId} >
                        <InputLabel>Ward</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              variant="standard"
                            >
                              
                              <MenuItem value={"Ward1"}>Ward1</MenuItem>
                              <MenuItem value={"Ward2"}>Ward2</MenuItem>
                              <MenuItem value={"Ward3"}>Ward3</MenuItem>
                              <MenuItem value={"Ward4"}>Ward4</MenuItem>
                            </Select>
                          )}
                          name="wardId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.wardId ? errors.wardId.message : null}</FormHelperText>
                      </FormControl>
                      </Grid>
                      <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
            <FormControl xs={12}
                sm={6}
                md={4} error={!!errors.wardId} >
                        <InputLabel>Road Type</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              variant="standard"
                            >
                              
                              <MenuItem value={"RoadType1"}>RoadType1</MenuItem>
                              <MenuItem value={"RoadType2"}>RoadType2</MenuItem>
                              <MenuItem value={"RoadType3"}>RoadType3</MenuItem>
                              <MenuItem value={"RoadType4"}>RoadType4</MenuItem>
                            </Select>
                          )}
                          name="RoadTypeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.RoadTypeId ? errors.RoadTypeId.message : null}</FormHelperText>
                      </FormControl></Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Location Of Excavation"
                  // variant="outlined"
                  variant="standard"
                  {...register("locationOfExcavation")}
                  error={!!errors.locationOfExcavation}
                  helperText={errors?.locationOfExcavation ? errors.locationOfExcavation.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Length Of Road"
                  // variant="outlined"
                  variant="standard"
                  {...register("lengthOfRoad")}
                  error={!!errors.lengthOfRoad}
                  helperText={errors?.lengthOfRoad ? errors.lengthOfRoad.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Width Of Road"
                  // variant="outlined"
                  variant="standard"
                  {...register("widthOfRoad")}
                  error={!!errors.widthOfRoad}
                  helperText={errors?.widthOfRoad ? errors.widthOfRoad.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label="Depth"
                  variant="standard"
                  {...register("depth")}
                  error={!!errors.depth}
                  helperText={errors?.depth ? errors.depth.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Excavation Pattern"
                  // variant="outlined"
                  variant="standard"
                  {...register("excavationPattern")}
                  error={!!errors.excavationPattern}
                  helperText={errors?.excavationPattern ? errors.excavationPattern.message : null}
                />
              </Grid>
              {/* //////////////////////////////////////////////////// */}
             
              
             
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="START Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  {...register("STARTLatitudeOfExcavation")}
                  error={!!errors.STARTLatitudeOfExcavation}
                  helperText={errors?.STARTLatitudeOfExcavation ? errors.STARTLatitudeOfExcavation.message : null}
                />
                </Grid>
                {/*///////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="END Latitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  {...register("ENDLatitudeOfExcavation")}
                  error={!!errors.ENDLatitudeOfExcavation}
                  helperText={errors?.ENDLatitudeOfExcavation ? errors.ENDLatitudeOfExcavation.message : null}
                />
                </Grid>
                {/*///////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="START Longitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  {...register("STARTLongitudeOfExcavation")}
                  error={!!errors.STARTLongitudeOfExcavation}
                  helperText={errors?.STARTLongitudeOfExcavation ? errors.STARTLongitudeOfExcavation.message : null}
                />
                </Grid>
                {/*///////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="END Longitude Of Excavation "
                  // variant="outlined"
                  variant="standard"
                  {...register("ENDLongitudeOfExcavation")}
                  error={!!errors.ENDLongitudeOfExcavation}
                  helperText={errors?.ENDLongitudeOfExcavation ? errors.ENDLongitudeOfExcavation.message : null}
                />
                </Grid>
                {/*///////////////////////////////////////// */}
                <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <Grid container spacing={2}>
        <Grid item>
          <Typography 
          sx={{
            marginTop:"10px"
          }}>
                Required Documents
          </Typography>
        </Grid>

        <Grid item alignItems="stretch" style={{ display: "flex" }}>
        <Button variant="contained" component="label">
        Upload
        <input hidden accept="image/*" multiple type="file" />
      </Button>        </Grid>
      </Grid>
              </Grid>
                </Grid>
                <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               <Typography> Is Location excavation is same as per PCMC order?</Typography>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}/>
                </Grid>
                </Grid>
                <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  
                }}
              >
               <Typography> Is Length excavation is same as per PCMC order?</Typography>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}/>
                </Grid>
                </Grid>
                <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               <Typography> Is Depth excavation is same as per PCMC order?</Typography>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}/>
                </Grid>
                </Grid>
                {/* ////////////////////////////////////////// */}
                <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               <Typography> Is Width excavation is same as per PCMC order?</Typography>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}/>
                </Grid>
                </Grid>
           {/* ///////////////////////////////////////// */}
           <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               <Typography> Is all excavation done as per PCMC order?</Typography>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}/>
                </Grid>
                </Grid>

                {/* //////////////////////////////////////////// */}
                <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
               <Typography> Penalty Applicable</Typography>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                 <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        
      </RadioGroup>
                </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label="Remark "
                  // variant="outlined"
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}/>
                </Grid>
                </Grid>
                <Grid
                container
                spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
                >
                   <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}> <TextField
                autoFocus
                style={{ backgroundColor: "white", width: "250px" }}
                id="outlined-basic"
                // label={<FormattedLabel id="amenities" />}
                label="Penalty Amount "
                // variant="outlined"
                variant="standard"
                {...register("penaltyAmount")}
                error={!!errors.penaltyAmount}
                helperText={errors?.penaltyAmount ? errors.penaltyAmount.message : null}/></Grid>
                   <Grid
                item> <TextField
                autoFocus
                style={{ backgroundColor: "white", width: "250px" }}
                id="outlined-basic"
                // label={<FormattedLabel id="amenities" />}
                label="Site Visit Remark "
                // variant="outlined"
                variant="standard"
                {...register("siteVisitRemark")}
                error={!!errors.siteVisitRemark}
                helperText={errors?.siteVisitRemark ? errors.siteVisitRemark.message : null}/></Grid>
                </Grid>
                  {/* //////////////////////////////////// */}
                 
                <Grid 
                container
                xs
                md={6} mdOffset={3}
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                }}>
                <Grid item><Button variant="outlined">Save</Button></Grid>
                <Grid item><Button variant="outlined">Clear</Button></Grid>
                <Grid item><Button variant="outlined">Exit</Button></Grid>
                </Grid>
                {/* //////////////////////////////////// */}
                
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;

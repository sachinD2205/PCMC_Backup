import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import dayjs from "dayjs";
import { useRouter } from "next/router";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

import styles from "../../../styles/fireBrigadeSystem/view.module.css";

const ApplicantDetails = ({ readOnly = false }) => {
  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const {
    control,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  // useEffect - Reload On update , delete ,Saved on refresh
  //   useEffect(() => {
  //     getBusinessTypes();
  //   }, []);

  //   useEffect(() => {
  //     getBusinesSubType();
  //   }, [businessTypes]);

  //   const getBusinessTypes = () => {
  //     axios.get(`${urls.FbsURL}/businessType/getBusinessTypeData`).then((r) => {
  //       setBusinessTypes(
  //         r.data.map((row) => ({
  //           id: row.id,br
  //           businessType: row.businessType,
  //         }))
  //       );
  //     });
  //   };
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  function getSteps() {
    return [
      // "",
      "Applicant Details",
      "Forms Details",
      "Purpose Of Building Use",
      "Other Details",
    ];
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };
  const [btnValue, setButtonValue] = useState(false);

  // Reset Values Cancell
  // const resetValuesCancell = {
  //   applicantName: "",
  //   applicantMiddleName: "",
  //   applicantLastName: "",
  //   applicationDate: "",
  //   officeContactNo: "",
  //   workingSiteOnsitePersonMobileNo: "",
  //   emailId: "",
  // };

  // Reset Values Exit
  // const resetValuesExit = {
  //   applicantName: "",
  //   applicationDate: "",
  //   officeContactNo: "",
  //   workingSiteOnsitePersonMobileNo: "",
  //   emailId: "",
  // };

  return (
    <>
      <form>
        <>
          <div>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              // className={styles.feildres}
              sx={{ marginLeft: "6%" }}
            ></Grid>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantName" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantName")}
                  error={!!errors.applicantName}
                  helperText={
                    errors?.applicantName ? errors.applicantName.message : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantMiddleName")}
                  error={!!errors.applicantMiddleName}
                  helperText={
                    errors?.applicantMiddleName
                      ? errors.applicantMiddleName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantLastName")}
                  error={!!errors.applicantLastName}
                  helperText={
                    errors?.applicantLastName
                      ? errors.applicantLastName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantNameMr" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantNameMr")}
                  error={!!errors.applicantNameMr}
                  helperText={
                    errors?.applicantNameMr
                      ? errors.applicantNameMr.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantMiddleNameMr" />}
                  variant="standard"
                  {...register("applicantDTLDao.applicantMiddleNameMr")}
                  // key={groupDetails.id}
                  error={!!errors.applicantMiddleNameMr}
                  helperText={
                    errors?.applicantMiddleNameMr
                      ? errors.applicantMiddleNameMr.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantLastNameMr" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantLastNameMr")}
                  error={!!errors.applicantLastNameMr}
                  helperText={
                    errors?.applicantLastNameMr
                      ? errors.applicantLastNameMr.message
                      : null
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantMobileNo")}
                  // type="number"
                  error={!!errors.officeContactNo}
                  helperText={
                    errors?.officeContactNo
                      ? errors.officeContactNo.message
                      : null
                  }
                />
              </Grid>
              {/* <Grid item xs={4} className={styles.feildres}>
                   <TextField
  disabled={readOnly}
  sx={{width: "80%"}}           id="standard-basic"
                    label={
                      <FormattedLabel id="workingSiteOnsitePersonMobileNo" />
                    }
                    variant="standard"
                    // type="number"
                    key={groupDetails.id}
                    {...register(
                      `groupDetails.${index}.workingSiteOnsitePersonMobileNo`
                    )}
                    error={!!errors.workingSiteOnsitePersonMobileNo}
                    helperText={
                      errors?.workingSiteOnsitePersonMobileNo
                        ? errors.workingSiteOnsitePersonMobileNo.message
                        : null
                    }
                  />
                </Grid> */}
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  disabled={readOnly}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  // key={groupDetails.id}
                  {...register("applicantDTLDao.applicantEmailId")}
                  error={!!errors.emailId}
                  helperText={errors?.emailId ? errors.emailId.message : null}
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}></Grid>
              {/* <Grid item xs={4} className={styles.feildres}>
               <TextField
  disabled={readOnly}
  sx={{width: "80%"}}       id="standard-basic"
                label={<FormattedLabel id="firmName" />}
                variant="standard"
                // key={groupDetails.id}
                {...register("applicantDTLDao.firmName")}
                error={!!errors.firmName}
                helperText={errors?.firmName ? errors.firmName.message : null}
              />
            </Grid> */}
            </Grid>
          </div>
        </>
      </form>

      <br></br>
      <br></br>
      <br></br>
    </>
  );
};

export default ApplicantDetails;

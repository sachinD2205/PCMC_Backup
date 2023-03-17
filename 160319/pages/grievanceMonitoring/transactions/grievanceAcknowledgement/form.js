import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import { Button, Paper, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import axios from 'axios'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import sweetAlert from 'sweetalert'
import urls from '../../../../URLS/urls'

import styles from './view.module.css'
const Form = () => {
  let documentsUpload = null

  let appName = 'MR'
  let serviceName = 'M-MBR'
  let applicationFrom = 'Web'
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [businessTypes, setBusinessTypes] = useState([])
  const router = useRouter()
  const [activeStep, setActiveStep] = useState()
  const [checked, setChecked] = useState(true)
  //   const steps = getSteps();
  const dispach = useDispatch()

  // useEffect - Reload On update , delete ,Saved on refresh
  //   useEffect(() => {
  //     getBusinessTypes();
  //   }, []);

  //   useEffect(() => {
  //     getBusinesSubType();
  //   }, [businessTypes]);

  //   const getBusinessTypes = () => {
  //     axios.get(`${urls.BaseURL}/businessType/getBusinessTypeData`).then((r) => {
  //       setBusinessTypes(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           businessType: row.businessType,
  //         }))
  //       );
  //     });
  //   };

  const editRecord = (rows) => {
    setBtnSaveText('Update'),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true)
    reset(rows)
  }

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      //   fromDate,
      //   toDate,
    }
    if (btnSaveText === 'Save') {
      axios
        .post(
          `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Saved!', 'Record Saved successfully !', 'success')
            getBusinesSubType()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    } else if (btnSaveText === 'Update') {
      axios
        .post(
          `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert('Updated!', 'Record Updated successfully !', 'success')
            getBusinesSubType()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
  }

  const deleteById = (value) => {
    swal({
      title: 'Delete?',
      text: 'Are you sure you want to delete this Record ? ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`,
          )
          .then((res) => {
            if (res.status == 226) {
              swal('Record is Successfully Deleted!', {
                icon: 'success',
              })
              setButtonInputState(false)
              //getcast();
            }
          })
      } else {
        swal('Record is Safe')
      }
    })
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    subject: '',
    description: '',
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    complaintType: '',
    businessSubType: '',
    businessSubTypePrefix: '',
    remark: '',
    id: null,
  }
  const locateButton = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('ActiveSteps' + activeStep + 'StepsLength' + steps.length)
      console.log('Latitude is :', position.coords.latitude)
      console.log('Longitude is :', position.coords.longitude)
    })
  }
  const handleNext = (data) => {
    dispach(addIsssuanceofHawkerLicense(data))
    console.log(data)
    if (activeStep == steps.length - 1) {
      fetch('https://jsonplaceholder.typicode.com/comments')
        .then((data) => data.json())
        .then((res) => {
          console.log(res)
          setActiveStep(activeStep + 1)
        })
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }
  const handleFile1 = async (e, labelName) => {
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    axios
      .post(
        `http://localhost:8090/cfc/api/file/upload?appName=${appName}&serviceName=${serviceName}`,
        formData,
      )
      .then((r) => {
        if (r.status == 200) {
          console.log(r.data)
          console.log(r.data.filePath)
          if (labelName === 'documentsUpload') {
            console.log('File path sapadala Ka---?>', r.data.filePath)
            setValue('documentsUpload', r.data.filePath)
          }
        } else {
          sweetAlert('Error')
        }
      })
  }
  // View
  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {/* {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >  */}

        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <div className={styles.row}>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Citizen Name"
                      variant="standard"
                      // { type: 'search'}
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Grievance Date"
                      variant="standard"
                      // { type: 'search'}
                      // {...register("date")}
                      // error={!!errors.date}
                      // helperText={
                      //   errors?.date
                      //     ? errors.date.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Subject"
                      variant="standard"
                      // {...register("subject")}
                      // error={!!errors.subject}
                      // helperText={
                      //   errors?.subject
                      //     ? errors.subject.message
                      //     : null
                      // }
                      // value={"Complaint type + sub type"}
                    />
                  </div>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Location"
                      variant="standard"
                      {...register('businessSubTypePrefix')}
                      error={!!errors.businessSubTypePrefix}
                      helperText={
                        errors?.businessSubTypePrefix
                          ? errors.businessSubTypePrefix.message
                          : null
                      }
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <label>Description</label>
                    <br />
                    <TextField
                      multiline
                      minRows={2}
                      maxRows={2}
                      style={{
                        width: 250,
                        resize: 'vertical',
                        overflow: 'auto',
                      }}
                      autoFocus
                      sx={{ width: 250 }}
                      maxlength="50"
                      id="standard-basic"
                      variant="outlined"
                      // {...register("complaintDescription")}
                      // error={!!errors.complaintDescription}
                      // helperText={
                      //   errors?.complaintDescription
                      //     ? errors.complaintDescription.message
                      //     : null
                      // }
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label=" Department"
                      variant="standard"
                      // {...register("department")}
                      // error={!!errors.department}
                      // helperText={
                      //   errors?.department
                      //     ? errors.department.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label=" Sub Department"
                      variant="standard"
                      // {...register("subDepartment")}
                      // error={!!errors.subDepartment}
                      // helperText={
                      //   errors?.subDepartment
                      //     ? errors.subDepartment.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Assigned To"
                      variant="standard"
                      // {...register("assignedTo")}
                      // error={!!errors.assignedTo}
                      // helperText={
                      //   errors?.assignedTo
                      //     ? errors.assignedTo.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Category"
                      variant="standard"
                      // {...register("category")}
                      // error={!!errors.category}
                      // helperText={
                      //   errors?.category
                      //     ? errors.category.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Event"
                      variant="standard"
                      // {...register("event")}
                      // error={!!errors.event}
                      // helperText={
                      //   errors?.event
                      //     ? errors.event.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Media"
                      variant="standard"
                      // {...register("media")}
                      // error={!!errors.media}
                      // helperText={
                      //   errors?.media
                      //     ? errors.media.message
                      //     : null
                      // }
                      // value={"My Name"}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.btn}>
                <br />
                <br />
                <Button
                  sx={{ marginRight: 4 }}
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                >
                  {btnSaveText}
                </Button>{' '}
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  Clear
                </Button>
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => {
                    router.push({
                      pathname:
                        '/grievanceMonitoring/transactions/grievanceAcknowledgement/',
                    })
                  }}
                >
                  Exit
                </Button>
                {/* <Button
                       
                  variant='contained'
                  color='primary'
                  // onClick={handleNext}
                  type='submit'
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>       */}
              </div>
            </form>
          </FormProvider>
        </div>
        {/* </Slide> */}
        {/* )} */}
        {/* <div className={styles.addbtn}>
  <Button
     variant="contained"
     endIcon={<AddIcon />}
     type="primary"
     disabled={buttonInputState}
     onClick={() => {
       reset({
         ...resetValuesExit,
       });
       setEditButtonInputState(true);
       setDeleteButtonState(true);
       setBtnSaveText("Save");
       setButtonInputState(true);
       setSlideChecked(true);
       setIsOpenCollapse(!isOpenCollapse);
     }}
   >
     Add{" "}
   </Button>
 </div>  */}
      </Paper>
      {/* </BasicLayout> */}
    </>
  )
}

export default Form

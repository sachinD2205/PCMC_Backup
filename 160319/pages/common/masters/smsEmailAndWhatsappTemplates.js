import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slide,
    TextField,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { Controller, FormProvider, useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import router from "next/router";
  import BasicLayout from "../../../containers/Layout/BasicLayout";
  import styles from "../../../styles/view.module.css";
  import { Divider } from "antd";
  import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
  import { DataGrid } from "@mui/x-data-grid";
  import axios from "axios";
  import Head from "next/head";
  import sweetAlert from "sweetalert";
  import urls from "../../../URLS/urls";
  
  import EditIcon from "@mui/icons-material/Edit";
  import ToggleOnIcon from "@mui/icons-material/ToggleOn";
  import ToggleOffIcon from "@mui/icons-material/ToggleOff";
  import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
  const NewIndex = () => {
    let schema = yup.object().shape({
      // departmentId: yup.string().required("Please select a department name."),
      // serviceId: yup.string().required("Please select a service name."),
      templateType: yup.string().required("Please select a templateType"),
    //   type: yup.string().required("Please select type."),
    //   remarkMr: yup.string().required("Please enter smsTemplate in English."),
    //   smsTemplate: yup.string().required("Please enter smsTemplate in Marathi."),
    });
    const {
      register,
      handleSubmit,
      control,
      // @ts-ignore
      methods,
      reset,
      watch,
      formState: { errors },
    } = useForm({
      criteriaMode: "all",
      resolver: yupResolver(schema),
    });
  
    let isDisabled = false,
      DataBharaychaKiNahi,
      isAcknowledgement,
      isSave;
  
    if (router.query.pageMode === "view") {
      DataBharaychaKiNahi = true;
      isDisabled = true;
      isAcknowledgement = true;
      isSave = false;
    }
    const [btnSaveText, setBtnSaveText] = useState("Save");
    const [id, setID] = useState();
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [slideChecked, setSlideChecked] = useState(false);
    const [editButtonInputState, setEditButtonInputState] = useState(false);
    const [buttonInputState, setButtonInputState] = useState();
    const [deleteButtonInputState, setDeleteButtonState] = useState(false);
    const [departmentDropDown, setDepartmentDropDown] = useState([]);
    const [serviceDropDown, setServiceDropDown] = useState([]);
    const [remarkTable, setRemarkTable] = useState([]);
    const [collapse, setCollapse] = useState(false);
    const [runAgain, setRunAgain] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    
    useEffect(() => {
      setRunAgain(false);
  
      axios
        .get(`${urls.CFCURL}/master/department/getAll`)
        .then((r) => {
          console.log("Department cha: ", r.data);
          setDepartmentDropDown(
            // @ts-ignore
            r.data.department.map((j, i) => ({
              id: j.id,
              departmentId: j.department, //This is Department Name, not id
            }))
          );
        });
    }, [runAgain]);
  
    useEffect(() => {
      axios
        .get(`${urls.CFCURL}/master/service/getAll`)
        .then((r) => {
          console.log("Service cha data:", r.data);
          setServiceDropDown(
            r.data.service.map((j, i) => ({
              id: j.id,
              serviceId: j.serviceName,
            }))
          );
        });
    }, [departmentDropDown]);
  
    //APPROVAL REJECTION REMARKS
  
    useEffect(() => {
      setRunAgain(false);
      getApprovalRejectionRemarks();
    },[]);
    const getApprovalRejectionRemarks = () => {
      axios
        .get(`${urls.CFCURL}/master/smsEmailAndWhatsappTemplates/getAll` )
        
        .then((r) => {
          console.log("smsTemplate data:", r.data);
          setDataSource(
            r.data.smsEmailAndWhatsappTemplates.map((j, id) => ({
              id: j.id,
              srNo: id + 1,
              // serviceId: j.serviceId ? getServiceName(j.service) : '-',
              // departmentId: j.departmentId ? getDepartmentName(j.department) :'-',
              // serviceEvent: j.serviceEvent,
              // sms:j.sms,
  // departmentId:getDepartmentName(j.departmentId),
  // serviceId:getServiceName(j.serviceId),
              departmentId: departmentDropDown?.find((obj) => obj?.id === j.department)
              ?.departmentId,
              serviceId: serviceDropDown?.find((obj) => obj?.id === j.service)
              ?.serviceId,
              // smsTemplate:j.smsTemplate, 
              // email :j.email ,
              // emailTemplate:j.emailTemplate ,
              // whatsApp :j.whatsApp ,
              // whatsAppTemplate:j.whatsAppTemplate ,
            
templateType:j.templateType,
              remarks: j.remarks,
              activeFlag:j.activeFlag,
            }))
          );
        });
    };
  
    function getDepartmentName(value) {
      // @ts-ignore
      return departmentDropDown.find((obj) => obj?.id === value)?.departmentId;
    }
    function getServiceName(value) {
      // @ts-ignore
      return serviceDropDown.find((obj) => obj?.id === value)?.serviceId;
    }
  
    const columns = [
      {
        field: "srNo",
        headerName: "Sr No.",
        width: 10,
      },
      {
        field: "departmentId",
        headerName: "Department Name",
       flex:1
      },
      {
        field: "serviceId",
        headerName: "Service Name",
      flex:1
      },
      // {
      //   field: "sms",
      //   headerName: "SMS",
      //   width: 30,
      // },
      // {
      //   field: "smsTemplate",
      //   headerName: "SMS Template",
      //   width: 150,
      // },
      // {
      //   field: "email",
      //   headerName: "Email",
      //   width: 30,
      // },
      // {
      //   field: "emailTemplate",
      //   headerName: "Email Template",
      //   width: 150,
      // },
      // {
      //   field: "whatsApp",
      //   headerName: " WhatsApp ",
      //   width: 100,
      // },
      // {
      //   field: "whatsAppTemplate",
      //   headerName: " WhatsApp Template",
      //   width: 150,
      // },
 {
        field: "templateType",
        headerName: " Template Type",
     flex:1
      },

      {
        field: "remarks",
        headerName: "Remark",
       flex:1,
      },
      
    
      {
        field: "actions",
        headerName: <FormattedLabel id="actions" />,
        width: 120,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <>
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setCollapse(true);
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </IconButton>
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                {params.row.activeFlag == "Y" ? (
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                ) : (
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                )}
              </IconButton>
            </>
          );
        },
      },
  
    ];
  
    const editById = (values) => {
      console.log("Edit sathi: ", values);
  
      const deptId = departmentDropDown.find(
        // @ts-ignore
        (obj) => obj?.departmentId === values.departmentId
        // @ts-ignore
      )?.id;
      const serviceId = serviceDropDown.find(
        // @ts-ignore
        (obj) => obj?.serviceId === values.serviceId
        // @ts-ignore
      )?.id;
  
      reset({ ...values, departmentId: deptId, serviceId: serviceId });
      setCollapse(true);
    };
  
    // const deleteById = async (id) => {
    //   sweetAlert({
    //     title: "Are you sure?",
    //     text: "Once deleted, you will not be able to recover this record!",
    //     icon: "warning",
    //     buttons: ["Cancel", "Delete"],
    //     dangerMode: true,
    //   }).then((willDelete) => {
    //     if (willDelete) {
    //       axios
    //         .delete(
    //           `${urls.CFCURL}/master/smsEmailAndWhatsappTemplates/save/${id}`
    //         )
    //         .then((res) => {
    //           if (res.status == 226) {
    //             sweetAlert(
    //               "Deleted!",
    //               "Record Deleted successfully !",
    //               "success"
    //             );
    //             setRunAgain(true);
    //           }
    //         });
    //     }
    //   });
    // };
  

    const deleteById = (value, _activeFlag) => {
      let body = {
        activeFlag: _activeFlag,
        id: value,
      };
      console.log("body", body);
      if (_activeFlag === "N") {
        swal({
          title: "Deactivate?",
          text: "Are you sure you want to deactivate this Record ? ",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          console.log("inn", willDelete);
          if (willDelete === true) {
            axios
              .post(`${urls.CFCURL}/master/smsEmailAndWhatsappTemplates/save`, body)
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 200) {
                  swal("Record is Successfully Deactivated!", {
                    icon: "success",
                  });
                  
                  getApprovalRejectionRemarks();
                  setButtonInputState(false);
                }
              });
          } else if (willDelete == null) {
            swal("Record is Safe");
          }
        });
      } else {
        swal({
          title: "Activate?",
          text: "Are you sure you want to activate this Record ? ",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          console.log("inn", willDelete);
          if (willDelete === true) {
            axios
              .post(`${urls.CFCURL}/master/smsEmailAndWhatsappTemplates/save`, body)
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 200) {
                  swal("Record is Successfully activated!", {
                    icon: "success",
                  });
                 
                  getApprovalRejectionRemarks();
                  setButtonInputState(false);
                }
              });
          } else if (willDelete == null) {
            swal("Record is Safe");
          }
        });
      }
    };
    const onBack = () => {
      setCollapse(false);
  
      // const urlLength = router.asPath.split('/').length
      // const urlArray = router.asPath.split('/')
      // let backUrl = ''
      // if (urlLength > 2) {
      //   for (let i = 0; i < urlLength - 1; i++) {
      //     backUrl += urlArray[i] + '/'
      //   }
      //   console.log('Final URL: ', backUrl)
      //   router.push(`${backUrl}`)
      // } else {
      //   router.push('/dashboard')
      // }
    };
  
    // Reset Values Cancell
    const resetValuesCancell = {
      id: null,
      departmentId: "",
      serviceId: "",
      type: "",
      remarks: "",
      remarkMr: "",
      templateType:""
    };
  
    const cancellButton = () => {
      reset({
        ...resetValuesCancell,
      });
    };
  
    // const onSubmit = async (data) => {
    //   console.log("Form Data: ", data);
  
    //   const bodyForAPI = {
    //     ...data,
    //   };
  
    //   console.log("Sagla data append kelya nantr: ", bodyForAPI);
  
    //   await axios
    //     .post(
    //       `${urls.CFCURL}/master/approvalRejectionRemarks/save`,
    //       bodyForAPI
    //     )
    //     .then((response) => {
    //       if (response.status === 200 || response.status === 200) {
    //         if (data.id) {
    //           sweetAlert("Updated!", "Record Updated successfully !", "success");
    //         } else {
    //           sweetAlert("Saved!", "Record Saved successfully !", "success");
    //         }
    //         setRunAgain(true);
    //         reset({ ...resetValuesCancell, id: null });
    //       }
    //     });
    // };
  
  
  
    const onSubmit = (formData) => {
      // console.log("231",formData);
      const finalBodyForApi = {
        ...formData,
       
      };
  
      axios.post(`${urls.CFCURL}/master/smsEmailAndWhatsappTemplates/save`, finalBodyForApi).then((res) => {
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
            // getDepartmentName();
            getApprovalRejectionRemarks();
            // getServiceName();
            // setRunAgain();
  
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          setEditButtonInputState(false);
          // setDeleteButtonState(false);
        }
      });
    };
  
  
    return (
      <>
        {/* <Head>
          <title>Approval/Rejection Remarks</title>
        </Head> */}
        <div
          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#757ce8",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
            
          }}
        >
   Sms Email And Whatsapp Templates
          {/* <FormattedLabel id='aadharAuthentication' /> */}
        </div>
       
          <Paper className={styles.main}>
            {/* <Divider orientation='left' style={{ marginBottom: '2%' }}>
              <h3>Approval/Rejection Remarks</h3>
            </Divider> */}
            {/* <Button
              sx={{ marginBottom: 2, marginLeft: 5 }}
              onClick={() => {
                if (!collapse) {
                  setCollapse(true);
                } else {
                  setCollapse(false);
                }
              }}
              variant="contained"
              endIcon={<Add />}
            >
            ADD
            </Button> */}
  <Button
              variant="contained"
              endIcon={<Add />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesCancell,
                });
                setEditButtonInputState(true);
                setCollapse(true);
                setDeleteButtonState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>
            
            {collapse && (
              <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
                <Paper style={{ padding: "3% 3%" }}>
                  <>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.row}>
                          <FormControl
                            sx={{ width: "300px", marginTop: "2%" }}
                            variant="standard"
                            error={!!errors.departmentId}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              Department Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.departmentId
                                      ? router.query.departmentId
                                      : field.value
                                  }
                                  onChange={(value) => field.onChange(value)}
                                  label="departmentId"
                                >
                                  {departmentDropDown &&
                                    departmentDropDown.map((value, index) => (
                                      <MenuItem
                                        key={index}
                                        value={
                                          // @ts-ignore
                                          value?.id
                                        }
                                      >
                                        {
                                          // @ts-ignore
                                          value?.departmentId
                                        }
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="department"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.departmentId ? errors.departmentId.message : null}
                            </FormHelperText>
                          </FormControl>

                          <FormControl
                            sx={{ width: "250px", marginTop: "2%" }}
                            variant="standard"
                            error={!!errors.serviceId}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              disabled={isDisabled}
                            >
                              Service Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // value={field.value}
                                  disabled={isDisabled}
                                  value={
                                    router.query.serviceId
                                      ? router.query.serviceId
                                      : field.value
                                  }
                                  onChange={(value) => field.onChange(value)}
                                  label="serviceId"
                                >
                                  {serviceDropDown &&
                                    serviceDropDown.map((value, index) => (
                                      <MenuItem
                                        key={index}
                                        value={
                                          // @ts-ignore
                                          value?.id
                                        }
                                      >
                                        {
                                          // @ts-ignore
                                          value?.serviceId
                                        }
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="service"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.serviceId
                                ? errors.serviceId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        


                        </div>
  

                        {/* <div
                          className={styles.row}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="Sms Template*"
                            variant="standard"
                            {...register("smsTemplate")}
                            error={!!errors.smsTemplate}
                            helperText={
                              errors?.smsTemplate ? errors.smsTemplate.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.smsTemplate ? router.query.smsTemplate : ""
                            }
                          />
 
 

 
 <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="Email Template*"
                            variant="standard"
                            {...register("emailTemplate")}
                            error={!!errors.emailTemplate}
                            helperText={
                              errors?.emailTemplate ? errors.emailTemplate.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.emailTemplate ? router.query.emailTemplate : ""
                            }
                          />

                          </div> */}


                          <div
                          className={styles.row}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >

                          {/* <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="WhatsApp Template *"
                            variant="standard"
                            {...register("whatsAppTemplate")}
                            error={!!errors.whatsAppTemplate}
                            helperText={
                              errors?.whatsAppTemplate ? errors.whatsAppTemplate.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.whatsAppTemplate ? router.query.whatsAppTemplate : ""
                            }
                          /> */}

                          <TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="Template Type *"
                            variant="standard"
                            {...register("templateType")}
                            error={!!errors.templateType}
                            helperText={
                              errors?.templateType ? errors.templateType.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.templateType ? router.query.templateType : ""
                            }
                          />

<TextField
                            sx={{
                              width: "250px",
                              // marginRight: '5%',
                              marginTop: "2%",
                            }}
                            id="standard-basic"
                            label="Remark *"
                            variant="standard"
                            {...register("remarks")}
                            error={!!errors.remarks}
                            helperText={
                              errors?.remarks ? errors.remarks.message : null
                            }
                            disabled={isDisabled}
                            defaultValue={
                              router.query.remarks ? router.query.remarks : ""
                            }
                          />


                        </div>



                        {/* <div>
                        <FormControlLabel
  sx={{ width: "150px", marginTop: "2%" }}
          value="start"
          control={<Checkbox />}
          label="SMS"
          labelPlacement="start"
        />
 <FormControlLabel
  sx={{ width: "150px", marginTop: "2%" }}
          value="start"
          control={<Checkbox />}
          label="Email"
          labelPlacement="start"
        />
 <FormControlLabel
  sx={{ width: "150px", marginTop: "2%" }}
          value="start"
          control={<Checkbox />}
          label="WhatsApp"
          labelPlacement="start"
        />
                        </div> */}


                        <div className={styles.buttons}>
                          <Button
                            sx={{
                              width: "100px",
                              height: "40px",
                            }}
                            variant="contained"
                            type="submit"
                            endIcon={<Save />}
                          >
                            {btnSaveText}
                       
                          </Button>
                          <Button
                            sx={{
                              width: "100px",
                              height: "40px",
                            }}
                            variant="outlined"
                            color="error"
                            endIcon={<Clear />}
                            onClick={cancellButton}
                          >
                            Clear
                          </Button>
                          <Button
                            sx={{
                              width: "100px",
                              height: "40px",
                            }}
                            variant="contained"
                            color="error"
                            onClick={onBack}
                            endIcon={<ExitToApp />}
                          >
                            Exit
                          </Button>
                        </div>
                      </form>
                    </FormProvider>
                  </>
                </Paper>
              </Slide>
            )}
  
            <div
              className={styles.table}
              style={{ display: "flex", alignItems: "center" }}
            >
              <DataGrid
                sx={{
                  marginTop: "5vh",
                  marginBottom: "3vh",
                  height: 370.5,
                  width: 1005,
                }}
                rows={dataSource}
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
  
  export default NewIndex;
  
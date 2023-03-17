//import { Button, Card, Col, Form, Input, message, Row, Upload } from 'antd'
//import TextField from '@mui/material/TextField'

import { Button, IconButton, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
//import moment from 'moment'
import { DataGrid } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
//import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
//import styles from '../newMarriageRegistration/view.module.css'
import moment from 'moment'
import { useRouter } from 'next/router'
import styles from '../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css'
import urls from '../../../../URLS/urls'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import FormControl from '@mui/material/FormControl'
// import Select from '@mui/material/Select'
// import KeyPressEvents from '../../../../util/KeyPressEvents'
// import ApplicatReissueDetail from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/ApplicatDetailsReissue'
// import GroomDetails from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/GroomDetails'
// import GroomFatherDetails from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/GroomFatherDetails'
// import BrideDetails from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/BrideDetails'
// import BrideFatherDetails from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/BrideFatherDetails'
// import PriestDetails from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/PriestDetails'
// import WitnessDetails from '../../../../containers/reuseableComponents/forms/MarriageResgistrationForms/WitnessDetails'

//import BasicLayout from '../../../../containers/Layout/BasicLayout'
//import {
//  clearFormMR,
//  saveNewRegistration,
//} from '../../../../features/MarriageRegistrationSlices/marriageRegistrationSlice'

// const newRegistration = () => {
//   const router = useRouter()
//   const ref = useRef()
//   const disptach = useDispatch()
//   const [form] = Form.useForm()
//   const resetForm = () => {
//     form.resetFields()
//   }

//   let pageType = false
//   useEffect(() => {
//     if (router.query.pageMode === 'View') {
//       pageType = true
//       console.log('pageType True set')
//     }
//   }, [])

//   const getRecordById = (record) => {
//     console.log('record', record)
//     disptach(groomFormEdit(record))
//   }

//   useEffect(() => {
//     console.log('id ->', router.query.id, router.query.pageMode)

//     axios
//       .get(
//         `http://localhost:8091/mr/api/applicant/applicantRegistration/${router.query.id}`,
//       )
//       .then((r) => {
//         GroomForm.setFieldsValue({
//           hFName: r.data.hFName,
//         })
//         disptach(savegroomFormEdit(r.data))
//         form.setFieldsValue({
//           remark: r.data.remark,
//           serviceCharges: r.data.serviceCharges,
//           applicationAcceptanceCharge: r.data.applicationAcceptanceCharge,
//         })
//       })
//   }, [])

//   const [activeTabKey2, setActiveTabKey2] = useState('ApplicatDetails')

//   const tabListNoTitle = [
//     {
//       key: 'ApplicatDetails',
//       tab: 'Applicat Details',
//     },
//     {
//       key: 'groomDetails',
//       tab: 'Groom Details',
//     },

//     {
//       key: 'groomFatherDetails',
//       tab: 'Groom Father Details',
//     },

//     {
//       key: 'brideDetails',
//       tab: `Bride Details`,
//     },

//     {
//       key: 'brideFatherDetails',
//       tab: `Bride Father Details`,
//     },

//     {
//       key: 'priestDetails',
//       tab: 'Priest Details',
//     },
//     {
//       key: 'witnessDetails',
//       tab: 'Witness Details',
//     },
//   ]
//   const onTab2Change = (key) => {
//     setActiveTabKey2(key)
//   }

//   const finalBodyForApi = useSelector(
//     (state) => state.marraigeRegistrationPortal.bodyToSend.values,
//   )

//   const ApplicatDetailsStatus = useSelector(
//     (state) => state.marraigeRegistrationPortal.ApplicatReissueForm.status,
//   )

//   const groomFormStatus = useSelector(
//     (state) => state.marraigeRegistrationPortal.groomForm.status,
//   )

//   const groomFatherFormStatus = useSelector(
//     (state) => state.marraigeRegistrationPortal.groomFatherForm.status,
//   )

//   const brideFormStatus = useSelector(
//     (state) => state.marraigeRegistrationPortal.brideForm.status,
//   )

//   const brideFatherFormStatus = useSelector(
//     (state) => state.marraigeRegistrationPortal.brideFatherForm.status,
//   )

//   const prisetFormStatus = useSelector(
//     (state) => state.marraigeRegistrationPortal.priestForm.status,
//   )

//   // Edit -Status
//   const statusEdit = useSelector((state) => {
//     state.marriageRegistrationEdit.groomFormEdit.status
//   })

//   // Edit -Values
//   const statusEditValues = useSelector((state) => {
//     state.marriageRegistrationEdit.groomFormEdit.values
//   })

//   useEffect(() => {
//     console.log('id', router.query.id)
//     if (router.query.pageMode === 'edit') {
//       setPageModeToSend('Edit')
//     }
//   }, [])

//   useEffect(() => {
//     if (ApplicatDetailsStatus) {
//       setActiveTabKey2('groomDetails')
//     }

//     if (groomFormStatus) {
//       setActiveTabKey2('groomFatherDetails')
//     }

//     if (groomFatherFormStatus) {
//       setActiveTabKey2('brideDetails')
//     }

//     if (brideFormStatus) {
//       setActiveTabKey2('brideFatherDetails')
//     }

//     if (brideFatherFormStatus) {
//       setActiveTabKey2('priestDetails')
//     }

//     if (prisetFormStatus) {
//       setActiveTabKey2('witnessDetails')
//     }
//   }, [
//     ApplicatDetailsStatus,
//     groomFormStatus,
//     groomFatherFormStatus,
//     brideFormStatus,
//     brideFatherFormStatus,
//     prisetFormStatus,
//   ])

//   const handleSaveClick = () => {
//     let newfields = form.getFieldsValue()
//     let apiBody = {
//       ...finalBodyForApi,
//       ...newfields,
//     }
//     disptach(saveNewRegistration())

//     axios
//       .post(
//         `http://localhost:8091/mr/api/applicant/saveApplicantRegistration`,
//         apiBody,
//       )
//       .then((r) => {
//         if (r.status === 200) {
//           message.success('Marriage Registartion Record Saved Successfully')
//           disptach(clearFormMR())
//         }
//       })
//   }

//   const contentListNoTitle = {
//     ApplicatDetails: (
//       <>
//         <ApplicatReissueDetail page="new" />
//       </>
//     ),
//     groomDetails: (
//       <>
//         <GroomDetails page="new" />
//       </>
//     ),
//     groomFatherDetails: (
//       <>
//         <GroomFatherDetails page="new" />
//       </>
//     ),

//     brideDetails: (
//       <>
//         <BrideDetails page="new" />
//       </>
//     ),
//     brideFatherDetails: (
//       <>
//         <BrideFatherDetails page="new" />
//       </>
//     ),

//     priestDetails: (
//       <>
//         <PriestDetails page="new" />
//       </>
//     ),
//     witnessDetails: (
//       <>
//         <WitnessDetails />
//       </>
//     ),
//   }
//   return (
//     <div>
//       <BasicLayout titleProp={'Reissuance of Marriage Certificate'}>
//         {/* <Card>
//           <Row>
//             <Col xl={4} lg={4} md={4} sm={4}></Col>
//             <Col xl={3} lg={3} md={3} sm={24} xs={24}>
//               <FormControl
//                 // disabled={formState}
//                 variant="standard"
//                 required
//                 sx={{ m: 1, minWidth: 250 }}
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Please Select zone Office',
//                   },
//                 ]}
//               >
//                 <InputLabel id="demo-simple-select-standard-label">
//                   Zone Office
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-standard-label"
//                   id="demo-simple-select-standard"
//                   //name="zoneOffice"
//                   // onChange={handleChangeSelect}
//                 >
//                   <MenuItem value={'pimpri'}>pimpri </MenuItem>
//                   <MenuItem value={'pune'}>pune</MenuItem>
//                 </Select>
//               </FormControl>
//             </Col>

//             <Col xl={4} lg={4} md={4} sm={4}></Col>
//             <Col xl={4} lg={4} md={4} sm={24} xs={24}>
//               <FormControl
//                 // disabled={formState}
//                 variant="standard"
//                 required
//                 sx={{ m: 1, minWidth: 250 }}
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Please Select ward Office',
//                   },
//                 ]}
//               >
//                 <InputLabel id="demo-simple-select-standard-label">
//                   Ward Office
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-standard-label"
//                   id="demo-simple-select-standard"
//                   //name="zoneOffice"
//                   // onChange={handleChangeSelect}
//                 >
//                   <MenuItem value={'ganesh colony'}>ganesh colony </MenuItem>
//                   <MenuItem value={'shreeram colony'}>shreeram colony</MenuItem>
//                 </Select>
//               </FormControl>
//             </Col>
//           </Row>
//         </Card> */}
//         <Card
//           style={{ width: '100%' }}
//           tabList={tabListNoTitle}
//           activeTabKey={activeTabKey2}
//           onTabChange={(key) => {
//             onTab2Change(key)
//           }}
//         >
//           {contentListNoTitle[activeTabKey2]}
//         </Card>

//         <Form layout="vertical" title="form" form={form}>
//           <Card>
//             {/* <Row>
//               <Col xl={4} lg={1} md={2} sm={1}></Col>
//               <Col xl={5} lg={5} md={5} sm={24} xs={24}>
//                 <Form.Item
//                   name={'remark'}
//                   initialValue={pageType ? router.query.remark : ''}
//                   rules={[
//                     {
//                       message: 'Please Enter Remarks',
//                     },
//                   ]}
//                 >
//                   <TextField
//                     id="standard-basic"
//                     label="Remarks"
//                     variant="standard"
//                     onKeyPress={KeyPressEvents.isInputChar}
//                     value={pageType ? router.query.remark : ''}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col xl={1} lg={1} md={2} sm={1}></Col>
//               <Col xl={4} lg={4} md={4} sm={24} xs={24}>
//                 <Form.Item
//                   name={'serviceCharges'}
//                   initialValue={pageType ? router.query.serviceCharges : ''}
//                   rules={[
//                     {
//                       required: true,
//                       message: 'Please Enter Service Charges',
//                     },
//                   ]}
//                 >
//                   <TextField
//                     required
//                     id="standard-basic"
//                     label="Service Charges"
//                     variant="standard"
//                     onKeyPress={KeyPressEvents.isInputNumber}
//                     value={pageType ? router.query.serviceCharges : ''}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col xl={1} lg={1} md={2} sm={1}></Col>
//               <Col xl={5} lg={4} md={4} sm={24} xs={24}>
//                 <Form.Item
//                   name={'applicationAcceptanceCharge'}
//                   initialValue={
//                     pageType ? router.query.applicationAcceptanceCharge : ''
//                   }
//                   rules={[
//                     {
//                       required: true,
//                       message: 'Please Enter Application Acceptance Charges',
//                     },
//                   ]}
//                 >
//                   <TextField
//                     required
//                     id="standard-basic"
//                     label="Application Acceptance Charges"
//                     variant="standard"
//                     onKeyPress={KeyPressEvents.isInputNumber}
//                     value={
//                       pageType ? router.query.applicationAcceptanceCharge : ''
//                     }
//                   />
//                 </Form.Item>
//               </Col>
//             </Row> */}
//             {/* <Row>
//               <Col xl={4} lg={1} md={2} sm={1}></Col>
//               <Col xs={1} sm={1} md={1} lg={2} xl={2}>
//                 <Button type="primary">Receipt print</Button>
//               </Col>
//               <Col xl={4} lg={4} md={4} sm={1}></Col>
//               <Col xs={1} sm={1} md={1} lg={2} xl={2}>
//                 <Button type="primary">LOI Receipt Print</Button>
//               </Col>
//               <Col xl={3} lg={3} md={3} sm={3} xs={1}></Col>
//               <Col xs={1} sm={1} md={1} lg={2} xl={2}>
//                 <Button type="primary">Certificate print</Button>
//               </Col>
//             </Row> */}

//             <Row>
//               <Col sm={2} md={4} lg={4} xl={8}></Col>
//               <Col xs={1} sm={1} md={1} lg={2} xl={2}>
//                 <Button
//                   type="primary"
//                   //disabled={saveBtnStatus}
//                   onClick={handleSaveClick}
//                 >
//                   Save
//                 </Button>
//               </Col>
//               <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
//               <Col xl={2} lg={2} md={1} sm={1} xs={1}>
//                 <Button onClick={resetForm}>Reset</Button>
//               </Col>
//               <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
//               <Col xl={2} lg={2} md={1} sm={1} xs={1}>
//                 <Button
//                   danger
//                   onClick={() =>
//                     router.push(
//                       `/marriageRegistration/transactions/ReissuanceofMarriageCertificate`,
//                     )
//                   }
//                 >
//                   Cancel
//                 </Button>
//               </Col>
//             </Row>
//           </Card>
//         </Form>
//       </BasicLayout>
//     </div>
//   )
// }

// export default newRegistration

const Index = () => {
  const dispach = useDispatch()

  const router = useRouter()

  let user = useSelector((state) => state.user.user)

  let language = useSelector((state) => state.labels.language)
  let selectedMenuFromDrawer = localStorage.getItem('selectedMenuFromDrawer')
  const [authority, setAuthority] = useState([])
  const [serviceId, setServiceId] = useState(null)

  const [tableData, setTableData] = useState([])
  const [applicantTableData, setApplicantTableData] = useState([])

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles
    let service = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)
      ?.serviceId
    console.log('serviceId-<>', service)
    console.log('auth0000', auth)
    setAuthority(auth)
    setServiceId(service)
  }, [])

  const getReissuanceofMCertificateDetails = () => {
    axios
      .get(
        `${urls.MR}/transaction/reIssuanceM/getreissueDetail?serviceId=${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      .then((res) => {
        console.log('Reissue table', res.data)
        setTableData(
          res.data.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            }
          }),
        )
      })
  }

  useEffect(() => {
    console.log('authority', authority)
    getReissuanceofMCertificateDetails()
  }, [authority])

  const issueCertificate = (record) => {
    // const finalBody = {
    //   id: Number(record.id),

    // }
    console.log('yetoy', record)
    router.push({
      pathname: '/marriageRegistration/reports/marriageCertificate',
      query: {
        // ...body,
        applicationId: record.trnApplicantId,
        serviceId: 10,
        // role: "CERTIFICATE_ISSUER",
      },
    })
    // saveApproval(finalBody)
  }

  // const saveApproval = (body) => {
  //   axios
  //     .post(`${urls.MR}/transaction/applicant/saveApplicationApprove`, body, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.status === 200) {
  //         if (body.role === 'LOI_GENERATION') {
  //           router.push({
  //             pathname:
  //               '/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi',
  //             query: {
  //               ...body,
  //             },
  //           })
  //         } else if (body.role === 'CERTIFICATE_ISSUER') {
  //           router.push({
  //             pathname: '/marriageRegistration/reports/marriageCertificate',
  //             query: {
  //               ...body,
  //               // role: "CERTIFICATE_ISSUER",
  //             },
  //           })
  //         }
  //       }
  //     })
  // }

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      headerAlign: 'center',
    },
    {
      field: 'applicationNumber',
      headerName: <FormattedLabel id="applicationNo" />,
      width: 240,
      headerAlign: 'center',
    },
    {
      field: 'applicationDate',
      headerName: <FormattedLabel id="applicationDate" />,
      width: 150,
      headerAlign: 'center',
      valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

    {
      field: 'applicantName',
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      headerAlign: 'center',
    },

    {
      field: 'applicationStatus',
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      headerAlign: 'center',
    },

    {
      field: 'actions',
      headerName: <FormattedLabel id="actions" />,
      width: 280,
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {/* {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
                (authority?.includes('DOCUMENT_CHECKLIST') ||
                  authority?.includes('ADMIN')) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname: 'scrutiny/scrutiny',
                        query: {
                          disabled: true,
                          applicationId: record.row.id,
                          serviceId: record.row.serviceId,
                          // ...record.row,
                          role: 'DOCUMENT_CHECKLIST',
                          pageMode: 'DOCUMENT CHECKLIST',
                          pageModeMr: 'कागदपत्र तपासणी',
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: '30px',
                        width: '250px',
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Document Checklist
                    </Button>
                  </IconButton>
                )} */}

              {record?.row?.applicationStatus === 'PAYEMENT_SUCCESSFULL' && (
                <IconButton>
                  {/* <Buttonremarks */}
                  <Button
                    variant="contained"
                    style={{
                      height: 'px',
                      width: '250px',
                    }}
                    color="success"
                    onClick={() => issueCertificate(record.row)}
                  >
                    GENERATE CERTIFICATE
                  </Button>
                  {/* </Buttonremarks> */}
                </IconButton>
              )}

              {record?.row?.applicationStatus === 'CERTIFICATE_ISSUED' && (
                <IconButton>
                  <Button
                    variant="contained"
                    style={{
                      height: 'px',
                      width: '250px',
                    }}
                    color="success"
                    onClick={() => issueCertificate(record.row)}
                  >
                    DOWNLOAD CERTIFICATE
                  </Button>
                </IconButton>
              )}
            </div>
          </>
        )
      },
    },
  ]

  const applicantColumns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id="srNo" />,

      width: 40,
    },

    {
      field: 'applicationNo',
      headerName: <FormattedLabel id="applicationNo" />,
      flex: 1,
    },

    {
      field: 'applicationDate',
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 1,
    },
    {
      field: 'applicantName',
      headerName: <FormattedLabel id="applicantName" />,
      flex: 1,
    },
    {
      field: 'statusDetails',
      headerName: <FormattedLabel id="statusDetails" />,
      flex: 1,
    },

    {
      field: 'actions',
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {/* <IconButton onClick={() => viewRecord(record.row)}>
                  <Button
                    style={{
                      height: '30px',
                      width: '50px',
                    }}
                    variant="contained"
                    // endIcon={<FlakyIcon />}
                    color="success"
                  >
                    verify
                  </Button>
                </IconButton> */}
              {/* {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
                authority?.find((r) => r === 'DOCUMENT CHECKLIST') && (
                  // &&
                  // console.log(
                  //   'Role->',
                  //   authority?.find((r) => r === 'DOCUMENT CHECKLIST'),
                  // )
                  <IconButton onClick={() => checklistRecord(record.row)}>
                    <Button
                      style={{
                        height: '30px',
                        width: '180px',
                      }}
                      variant="contained"
                      // endIcon={<FlakyIcon />}
                      color="primary"
                    >
                      Document Verification
                    </Button>
                    {/* <VisibilityIcon /> */}
              {/* </IconButton> */}
              {/* )} */}

              {record?.row?.applicationStatus === 'APPOINTMENT_SCHEDULED' &&
                authority?.find((r) => r === 'DOCUMENT VERIFICATION') && (
                  <>
                    <IconButton onClick={() => viewRecord(record.row)}>
                      <Button
                        style={{
                          height: '30px',
                          width: '50px',
                        }}
                        variant="contained"
                        // endIcon={<FlakyIcon />}
                        color="success"
                      >
                        verify
                      </Button>
                    </IconButton>

                    <IconButton>
                      <Button
                        variant="contained"
                        style={{
                          height: '30px',
                          width: '120px',
                        }}
                        color="success"
                        onClick={() =>
                          router.push(
                            `/marriageRegistration/transactions/newMarriageRegistration/cleark/applicationDtlAndDoc`,
                          )
                        }
                      >
                        document Tab
                      </Button>
                    </IconButton>
                  </>
                )}

              {record?.row?.applicationStatus ===
                'APPLICATION_SENT_TO_SR_CLERK' &&
                authority?.find((r) => r === 'APPOINTMENT_SCHEDULE') && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: '30px',
                        width: '105px',
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                          query: {
                            appId: record.row.id,
                          },
                        })
                      }
                    >
                      Schedule
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === 'LOI_GENERATED' &&
                authority?.find((r) => r === 'CASHIER' || r === '') && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: '30px',
                        width: '50px',
                      }}
                      color="success"
                      onClick={() => {
                        setmodalforAprov(true)
                      }}
                    >
                      Pay
                    </Button>
                  </IconButton>
                )}
            </div>
          </>
        )
      },
    },
  ]

  return (
    <>
      <div>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 2,
            marginTop: 10,
            marginBottom: 5,
            padding: 1,
            border: 1,
            borderColor: 'grey.500',
          }}
        >
          <br />
          <div className={styles.detailsTABLE}>
            <div className={styles.h1TagTABLE}>
              <h2
                style={{
                  fontSize: '20',
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {' '}
                {<FormattedLabel id="newRMItable" />}
              </h2>
            </div>
          </div>
          <DataGrid
            sx={{
              marginLeft: 9,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              overflowY: 'scroll',

              '& .MuiDataGrid-virtualScrollerContent': {},
              '& .MuiDataGrid-columnHeadersInner': {
                backgroundColor: '#556CD6',
                color: 'white',
              },

              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
            density="compact"
            autoHeight
            scrollbarSize={17}
            rows={tableData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Paper>
      </div>
      {/* <div>
        <Paper
          sx={{
            marginLeft: 10,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 20,
            padding: 1,
            border: 1,
            borderColor: 'grey.500',
          }}
        >
          <br />
          <div className={styles.detailsTABLE}>
            <div className={styles.h1TagTABLE}>
              <h2
                style={{
                  fontSize: '20',
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {' '}
                {<FormattedLabel id="onlyApplDetail" />}
              </h2>
            </div>
          </div>
          <DataGrid
            sx={{
              marginLeft: 9,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              overflowY: 'scroll',

              '& .MuiDataGrid-virtualScrollerContent': {},
              '& .MuiDataGrid-columnHeadersInner': {
                backgroundColor: '#556CD6',
                color: 'white',
              },

              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
            density="compact"
            autoHeight
            scrollbarSize={17}
            rows={applicantTableData}
            columns={applicantColumns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Paper>
      </div> */}
    </>
  )
}

export default Index

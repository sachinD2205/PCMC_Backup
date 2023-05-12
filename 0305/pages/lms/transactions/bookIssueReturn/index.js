import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import InIcon from '@mui/icons-material/Input'
import OutIcon from '@mui/icons-material/Output'
import SaveIcon from '@mui/icons-material/Save'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { DatePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import swal from 'sweetalert'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
// import styles from '../../../../pages/marriageRegistration/transactions/newMarriageRegistration/scrutiny/view.module.css'
import styles from '../../../../styles/lms/[bookIssueReturn]view.module.css'
import urls from '../../../../URLS/urls'
// import { bookIssueSchema } from '../../../../containers/schema/libraryManagementSystem/transaction/bookIssueReturn'
import theme from '../../../../theme'
import { useRouter } from 'next/router'

const DepartmentalProcess = () => {
  const [btnSaveText, setBtnSaveText] = useState('save')
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapseIssue, setIsOpenCollapseIssue] = useState(false)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [libraryIdsList, setLibraryIdsList] = useState([])
  const [selectedLibraryId, setSelectedLibraryId] = useState(null)
  const [membersList, setMembersList] = useState([])
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [booksAvailableList, setBooksAvailableList] = useState([])
  const [selectedIssueBookId, setSelectedIssueBookId] = useState(null)
  const [issueDate, setIssueDate] = useState(new Date())
  const [formMode, setFormMode] = useState(null)

  const [booksMasterList, setBooksMasterList] = useState([])
  const [returnBooksAvailableList, setReturnBooksAvailableList] = useState([])
  const [remark, setRemark] = useState('')
  const [memberName, setMemberName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tempId, setTempId] = useState();
  const router = useRouter()

  useEffect(() => {
    setAllLibrariesList()
    getAllBooks()
  }, [])



  const getAllBooks = () => {
    // const url = urls.LMSURL + '/bookMaster/getAll'
    const url = urls.LMSURL + '/bookMaster/getAllAvailableBook'
    axios
      .get(url)
      .then((response) => {
        if (!response.data || !response.data.bookMasterList) {
          throw new Error('Books not found')
        }
        setBooksMasterList(response.data.bookMasterList)

      })
      .catch((err) => {
        console.error(err)
        swal(err.message, { icon: 'error' })
      })
  }

  const setAllLibrariesList = () => {
    const url = urls.LMSURL + '/libraryMaster/getAll'
    axios
      .get(url)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Error getting libraries')
        }
        if (
          !response.data ||
          !response.data.libraryMasterList ||
          response.data.libraryMasterList.length === 0
        ) {
          throw new Error('No libraries found')
        }
        setLibraryIdsList(response.data.libraryMasterList.sort((a, b) => a.id - b.id))
      })
      .catch((err) => {
        console.error(err)
        swal(err.message, { icon: 'error' })
      })
  }

  const setMembersListByLibraryId = (library) => {
    setSelectedLibraryId(library)
    if (!library) {
      swal('No library selected', { icon: 'warning' })
      return
    }
    const url =
      urls.LMSURL +
      '/libraryMemberMaster/getAllMemberByLibraryId?libraryId=' +
      library.id
    axios
      .get(url)
      .then((response) => {
        // if (
        //   !response.data ||
        //   !response.data.libraryMemberMasterList ||
        //   response.data.libraryMemberMasterList.length === 0
        // ) {
        //   throw new Error('Members not found for the library')
        // }
        setMembersList(response.data.libraryMemberMasterList)
      })
      .catch((err) => {
        console.error(err)
        swal(err.message, { icon: 'error' })
      })
  }

  const getAllAvailableBooks = () => {
    const url = urls.LMSURL + '/bookMaster/getAllAvailableBook'
    axios
      .get(url)
      .then((response) => {
        if (
          !response.data ||
          !response.data.bookMasterList ||
          response.data.bookMasterList.length === 0
        ) {
          throw new Error('No books found')
        }
        setBooksAvailableList(response.data.bookMasterList)
      })
      .catch((err) => {
        console.error(err)
        swal(err.message, { icon: 'error' })
      })
  }

  useEffect(() => {
    if (memberName && watch('membershipNo')) {
      console.log('yetoy')
      getReturnBooksByMemberId()
    }
  }, [memberName])

  const getReturnBooksByMemberId = (member) => {
    setReturnBooksAvailableList([])
    setSelectedMemberId(member)
    const url =
      urls.LMSURL +
      '/trnBookIssueReturn/getAllIssueBookToMember?membershipNo=' +
      watch('membershipNo')
    axios
      .get(url)
      .then((response) => {
        setReturnBooksAvailableList(response.data.trnBookIssueReturnList)
        if (response?.data?.trnBookIssueReturnList?.length > 0) {
          setButtonInputState(true)
        }
        else {
          setButtonInputState(false)
        }
      })
      .catch((err) => {
        console.error(err)
        swal(err.message, { icon: 'error' })
      })
  }

  const submitTransaction = async () => {
    let url = "";
    const payload = {
      libraryMasterKey: +selectedLibraryId.id,
      // libraryMemberMasterKey: selectedMemberId.id,
      // libraryMemberName: selectedMemberId.libraryMemberFirstName,
      membershipNo: watch('membershipNo'),
      bookMasterKey: +selectedIssueBookId.id,
      bookName: selectedIssueBookId.bookName,
      status: formMode,
      issuedAt: null,
      returnedAt: null,
      issueRemark: null,
      returnRemark: null,
      fine: 0,
      bookLostStatus: '',
      bookLostRemark: '',
      bookLostAt: null,
      createdUserId: 1,
      updateDtTm: null,
      updateUserid: 1,
      version: 1,
    }
    if (formMode === 'I') {
      payload.issuedAt = issueDate.toISOString()
      payload.issueRemark = remark
      url = urls.LMSURL + '/trnBookIssueReturn/save'
      return axios.post(url, payload)

    }
    else if (formMode == 'L') {
      console.log("selectedIssueBookId", selectedIssueBookId, formMode)

      // url = urls.LMSURL + '/trnBookIssueReturn/markBookAsLost?id=' + selectedIssueBookId.id
      // return axios.post(url)
    } else {
      // payload.returnedAt = issueDate.toISOString()
      // payload.returnRemark = remark
      console.log("selectedIssueBookId", selectedIssueBookId, formMode)
      // url = urls.LMSURL + '/trnBookIssueReturn/delete/'+selectedIssueBookId.id
      url = urls.LMSURL + '/trnBookIssueReturn/calculateFineOfIssueBook?id=' + selectedIssueBookId.id
      return axios.get(url)

    }
    console.log('Payload:', payload)
    // return axios.post(url, payload)

  }

  const returnBook = ({ id, bookName }) => {
    setSelectedIssueBookId({ id, bookName })
    setEditButtonInputState(true)
    setDeleteButtonState(true)
    setBtnSaveText('Return')
    setFormMode('R')
    setButtonInputState(true)
    setSlideChecked(true)
    setIsOpenCollapseIssue(true)
    document.querySelector('#paper-top')?.scrollIntoView({ behavior: 'smooth' })
  }

  const lostBook = ({ id, bookName }) => {
    // setSelectedIssueBookId({ id, bookName })
    setTempId(id);
    setSelectedIssueBookId(booksAvailableList.find((item) => item.bookName == bookName))
    setEditButtonInputState(true)
    setDeleteButtonState(true)
    setBtnSaveText('Lost')
    setFormMode('L')
    setButtonInputState(true)
    setSlideChecked(true)
    setIsOpenCollapseIssue(true)
    document.querySelector('#paper-top')?.scrollIntoView({ behavior: 'smooth' })
  }

  const issueBook = () => {
    setEditButtonInputState(true)
    setDeleteButtonState(true)
    setBtnSaveText('Issue')
    setFormMode('I')
    setButtonInputState(true)
    setSlideChecked(true)
    setIsOpenCollapseIssue(true)
  }

  useEffect(() => {
    if (selectedIssueBookId) {
      console.log('Book selected', booksAvailableList, selectedIssueBookId);
      reset(selectedIssueBookId)
    }

  }, [selectedIssueBookId])
  const submit = () => {
    // if (
    //   !selectedLibraryId ||
    //   // !selectedMemberId ||
    //   !selectedIssueBookId ||
    //   !issueDate
    // ) {
    //   swal('Please enter all details', { icon: 'warning' })
    //   return
    // }
    if (formMode == 'L') {

      console.log("aala re", selectedIssueBookId);



      router.push({
        pathname: `/lms/transactions/bookIssueReturn/PaymentCollection`,
        query: {
          temp: selectedIssueBookId.bookPrice,
          id: tempId ? tempId : selectedIssueBookId.id,
          membershipNo: watch('membershipNo'),
          memberName: memberName,
          remark: remark
        },
      })
    } else {
      submitTransaction()
        .then((resp) => {

          console.log("aala re", formMode, resp);
          if (formMode == "R") {
            if (resp.data.isFinePending) {
              swal('Fine Pending!', 'Please Collect Fine !', 'success')

              router.push({
                pathname: `/lms/transactions/bookIssueReturn/PaymentCollectionReturn`,
                query: {
                  temp: resp?.data?.fine,
                  id: tempId ? tempId : selectedIssueBookId.id,
                  membershipNo: watch('membershipNo'),
                  memberName: memberName,
                  remark: remark
                },
              })
            }
            else {
              let url = urls.LMSURL + '/trnBookIssueReturn/bookReturn?id=' + selectedIssueBookId.id

              axios
                .post(url)
                .then((res) => {
                  if (res.status == 201 || res.status == 200) {
                    swal('Saved!', 'Record Saved successfully !', 'success')
                    // router.push({
                    //     pathname: `/dashboard`,
                    // })
                    let temp = res?.data?.message;
                    swal(`Book successfully Returned.`, {
                      icon: 'success',
                    })

                    resetBookIssueForm(false)

                    setValue('membershipNo', '')
                    setMemberName()
                  }
                })
            }
          }
          else {
            resetBookIssueForm(false)
            swal(`Book successfully ${formMode === 'I' ? 'issued' : (formMode === 'L' ? 'lost' : 'returned')}.`, {
              icon: 'success',
            })
            setValue('membershipNo', '')
            setMemberName()
          }
        })
        .catch((err) => {
          console.error("yetoy", err)
          if (err?.response.data.status == 409) {
            swal(err?.response?.data?.message ? err?.response?.data?.message : "Membership Expired ! Please Renew..", { icon: 'error' })
          }
          else {
            swal(err?.message, { icon: 'error' })

          }
        })
    }
  }

  const bookIssueForm = useForm({
    // resolver: yupResolver(bookIssueSchema),
    mode: 'onChange',
  })

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = bookIssueForm
  const columns = [
    {
      field: 'bookName',
      // headerName: 'Book Name',
      headerName: <FormattedLabel id="bookName" />,
      // flex: 3
      width: 480,
    },
    {
      field: 'issuedAt',
      // headerName: 'Issued At',
      headerName: <FormattedLabel id="issuedAt" />,
      width: 480,
      //  flex: 3 
    },
    {
      field: 'actions',
      // headerName: 'Actions',
      headerName: <FormattedLabel id="actions" />,
      width: 420,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Button
                onClick={() => {
                  returnBook(params.row)
                }}
              >
                <InIcon /> Return
              </Button>
              <Button
                onClick={() => {
                  lostBook(params.row)
                }}
              >
                <InIcon /> Book Lost
              </Button>
            </div>
          </>
        )
      },
    },
  ]

  const resetBookIssueForm = (modalState, formModeType) => {
    bookIssueForm.reset({})
    setEditButtonInputState(modalState)
    setDeleteButtonState(modalState)
    if (formModeType !== undefined) {
      setBtnSaveText(formModeType === 'I' ? 'Issue' : 'Return')
      setFormMode(formModeType)
    }
    setButtonInputState(modalState)
    setSlideChecked(modalState)
    setIsOpenCollapseIssue(modalState)
    setSelectedLibraryId('')
    setSelectedIssueBookId('')
    setSelectedMemberId('')
    setMembersList([])
    setBooksAvailableList([])
    setReturnBooksAvailableList([])
    setIssueDate(null)
    setRemark('')
  }

  const getMembershipDetails = () => {
    if (watch('membershipNo')) {
      const url =
        urls.LMSURL +
        '/libraryMembership/getByMembershipNoAndLibraryKey?membershipNo=' + watch('membershipNo') + '&libraryKey=' + selectedLibraryId?.id
      axios
        .get(url)
        .then((response) => {
          // if (
          //   !response.data ||
          //   !response.data.trnBookIssueReturnList ||
          //   response.data.trnBookIssueReturnList.length === 0
          // ) {
          //   throw new Error('No books found')
          // }
          // setReturnBooksAvailableList(response.data.trnBookIssueReturnList)
          setMemberName(response.data.applicantName);
          setStartDate(response.data.startDate);
          setEndDate(response.data.endDate);
          setIssueDate(new Date());
        })
        .catch((err) => {
          console.error(err)
          swal(err.response.data.message, { icon: 'error' })
        })
    }
  }
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {/* <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px',
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              'linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)',
          }}
        >
          <h2>
            <FormattedLabel id="bookIssueReturn" />
          </h2>
        </Box> */}
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
            id="paper-top"
          >
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
                  {<FormattedLabel id="bookIssueReturnTitle" />}
                  {/* Book Issue/Return */}
                </h2>
              </div>
            </div>
            <Grid
              container
              spacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
              style={{ marginTop: '1vh', marginLeft: '1vh' }}
              columns={16}
            >
              <Grid item xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}>
                <Autocomplete
                  sx={{ m: 1 }}
                  // label="Library ID *"
                  label={<FormattedLabel id="libraryCSC" />}
                  disabled={isOpenCollapseIssue}
                  disablePortal
                  options={libraryIdsList}
                  value={selectedLibraryId || ''}
                  onChange={(_e, id) => {
                    setMembersListByLibraryId(id)
                    getAllAvailableBooks()
                  }}
                  getOptionLabel={({ libraryName }) => libraryName || ''}
                  isOptionEqualToValue={(opt, sel) => {
                    return opt.id === sel.id
                  }}
                  renderOption={(props, option) => (
                    <span {...props}>{option.libraryName}</span>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label={<FormattedLabel id="libraryCSC" />} />
                  )}
                />
              </Grid>
              <Grid
                style={{ marginTop: '1vh' }}
                item
                xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}
              >

                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="membershipNo" required />}
                  // label="Membership No"
                  variant="standard"
                  {...register('membershipNo')}
                  error={!!errors.membershipNo}
                  helperText={
                    errors?.membershipNo ? errors.membershipNo.message : null
                  }
                />
              </Grid>
              <Grid
                style={{ marginTop: '4vh' }}
                item
                xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}
              >
                <Button
                  variant="contained"
                  endIcon={<OutIcon />}
                  style={{ marginRight: '20px' }}
                  type="primary"
                  disabled={buttonInputState}
                  onClick={() => {
                    getMembershipDetails()
                  }}
                >
                  {/* Search Member */}
                  {<FormattedLabel id="searchMember" />}
                </Button>
              </Grid>
              {/* <Grid item xl={8} lg={8} md={8} sm={16} xs={16}>
                <Autocomplete
                  sx={{ m: 1 }}
                  label="Member *"
                  disabled={membersList.length === 0 || isOpenCollapseIssue}
                  disablePortal
                  options={membersList}
                  value={selectedMemberId}
                  onChange={(_e, id) => {
                    // getReturnBooksByMemberId(id)
                  }}
                  getOptionLabel={(opt) => {
                    if (!opt) {
                      return ''
                    }
                    const {
                      libraryMemberFirstName,
                      libraryMemberLastName,
                    } = opt
                    return libraryMemberFirstName + ' ' + libraryMemberLastName
                  }}
                  isOptionEqualToValue={(opt, sel) => opt.id === sel.id}
                  renderOption={(props, option) => (
                    <span {...props}>
                      {option.libraryMemberFirstName +
                        ' ' +
                        option.libraryMemberLastName}
                    </span>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose a member" />
                  )}
                />
              </Grid> */}
            </Grid>
            {memberName &&
              <Grid
                container
                spacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                style={{ marginTop: '1vh', marginLeft: '1vh' }}
                columns={16}
              >
                <Grid item xl={4}
                  lg={4}
                  md={4}
                  sm={12}
                  xs={12}>
                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: 230 }}
                    id="standard-basic"
                    label={<FormattedLabel id="memberName" required />}
                    // label="Member Name"
                    variant="standard"
                    value={memberName}
                  // error={!!errors.membershipNo}
                  // helperText={
                  //   errors?.membershipNo ? errors.membershipNo.message : null
                  // }
                  />
                </Grid>
                <Grid item xl={4}
                  lg={4}
                  md={4}
                  sm={12}
                  xs={12}>
                  <FormControl
                    sx={{ marginTop: 0 }}
                    error={!!errors.startDate}
                  >
                    <Controller
                      control={control}
                      name="startDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider
                          dateAdapter={AdapterMoment}
                        >
                          <DatePicker
                            disabled
                            // maxDate={new Date()}
                            // disabled={disable}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {' '}
                                {/* Membership Start Date */}
                                {<FormattedLabel id="startDate" />}
                              </span>
                            }
                            value={startDate}
                            onChange={(date) =>
                              field.onChange(
                                moment(date).format('YYYY-MM-DD'),
                              )
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                // disabled={disabled}
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
                    <FormHelperText>
                      {errors?.startDate
                        ? errors.startDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xl={4}
                  lg={4}
                  md={4}
                  sm={12}
                  xs={12}>
                  <FormControl
                    sx={{ marginTop: 0 }}
                    error={!!errors.endDate}
                  >
                    <Controller
                      control={control}
                      name="endDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider
                          dateAdapter={AdapterMoment}
                        >
                          <DatePicker
                            disabled
                            // maxDate={new Date()}
                            // disabled={disable}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {' '}
                                {/* Membership Start Date */}
                                {<FormattedLabel id="endDate" />}
                              </span>
                            }
                            value={endDate}
                            onChange={(date) =>
                              field.onChange(
                                moment(date).format('YYYY-MM-DD'),
                              )
                            }
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                // disabled={disabled}
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
                    <FormHelperText>
                      {errors?.endDate
                        ? errors.endDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            }

            {isOpenCollapseIssue && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <div className={styles.details}>
                    <div className={styles.h1Tag}>
                      <h3
                        style={{
                          color: 'white',
                          marginTop: '7px',
                        }}
                      >

                        {/* {btnSaveText} Form */}
                        {<FormattedLabel id={btnSaveText} />} {<FormattedLabel id="form" />}
                      </h3>
                    </div>
                  </div>
                  <FormProvider {...bookIssueForm.methods}>
                    <form>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ marginTop: '1vh', marginLeft: '1vh' }}
                        columns={12}
                      >
                        {(formMode === 'I' || formMode == 'L') ? (
                          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                            <Autocomplete
                              sx={{ m: 1 }}
                              label="Book *"
                              disabled={booksAvailableList.length === 0}
                              disablePortal
                              options={booksAvailableList}
                              value={selectedIssueBookId}
                              onChange={(_e, id) => {
                                setSelectedIssueBookId(id)
                              }}
                              getOptionLabel={({ bookName }) => bookName || ''}
                              isOptionEqualToValue={(opt, sel) =>
                                opt.id === sel.id
                              }
                              renderOption={(props, option) => (
                                <span {...props}>{option.bookName}</span>
                              )}
                              renderInput={(params) => (
                                <TextField {...params}
                                  // label="Choose a book" 
                                  label={<FormattedLabel id="chooseBook" />}
                                />
                              )}
                            />
                          </Grid>
                        ) : ""}
                        <Grid
                          item
                          style={{ marginTop: '1vh' }}
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <DesktopDatePicker
                            sx={{ m: 1 }}
                            label={`Date of ${btnSaveText} *`}
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(value) => {
                              setIssueDate(value.toDate())
                            }}
                            value={issueDate}
                          />
                        </Grid>
                        <Grid
                          style={{ marginTop: '1vh' }}
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                        >
                          <TextField
                            value={remark}
                            // label="Remark"
                            label={<FormattedLabel id="remark" />}
                            onChange={(e) => {
                              setRemark(e.target.value)
                            }}
                          />
                        </Grid>
                      </Grid>
                      {selectedIssueBookId && (formMode == 'I' || formMode == 'L') ? (
                        <>
                          <div className={styles.details}>
                            <div className={styles.h1Tag}>
                              <h3
                                style={{
                                  color: 'white',
                                  marginTop: '7px',
                                }}
                              >

                                {/* Book Details */}
                                {<FormattedLabel id="bookDetails" />}
                              </h3>
                            </div>
                          </div>

                          <Grid
                            container
                            spacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                            columns={12}
                          >
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField

                                disabled
                                id="standard-basic"
                                // label="Book Classification"
                                label={<FormattedLabel id="bookClassification" />}
                                variant="standard"
                                {...register("bookClassification")}
                                error={!!errors.bookClassification}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("bookClassification") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.bookClassification
                                    ? errors.bookClassification.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Book Type"
                                label={<FormattedLabel id="bookType" />}
                                variant="standard"
                                {...register("bookType")}
                                error={!!errors.bookType}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("bookType") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.bookType
                                    ? errors.bookType.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Book Sub Type"
                                label={<FormattedLabel id="bookSubType" />}
                                variant="standard"
                                {...register("bookSubType")}
                                error={!!errors.bookSubType}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("bookSubType") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.bookSubType
                                    ? errors.bookSubType.message
                                    : null
                                }
                              />
                            </Grid>

                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                            columns={12}
                          >
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Publication"
                                label={<FormattedLabel id="publication" />}
                                variant="standard"
                                {...register("publication")}
                                error={!!errors.publication}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("publication") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.publication
                                    ? errors.publication.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Author"
                                label={<FormattedLabel id="author" />}
                                variant="standard"
                                {...register("author")}
                                error={!!errors.author}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("author") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.author
                                    ? errors.author.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Book Edition"
                                label={<FormattedLabel id="bookEdition" />}
                                variant="standard"
                                {...register("bookEdition")}
                                error={!!errors.bookEdition}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("bookEdition") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.bookEdition
                                    ? errors.bookEdition.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                            style={{ marginTop: '1vh', marginLeft: '1vh' }}
                            columns={12}
                          >
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Book Price"
                                label={<FormattedLabel id="bookPrice" />}
                                variant="standard"
                                {...register("bookPrice")}
                                error={!!errors.bookPrice}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("bookPrice") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.bookPrice
                                    ? errors.bookPrice.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xl={4}
                              lg={4}
                              md={4}
                              sm={12}
                              xs={12}
                            >
                              <TextField
                                disabled
                                id="standard-basic"
                                // label="Available Books Copy"
                                label={<FormattedLabel id="totalAvailableBookCopy" />}
                                variant="standard"
                                {...register("totalAvailableBookCopy")}
                                error={!!errors.totalAvailableBookCopy}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink:
                                    (watch("totalAvailableBookCopy") ? true : false)
                                  // ||(router.query.bookName ? true : false),
                                }}
                                helperText={
                                  errors?.totalAvailableBookCopy
                                    ? errors.totalAvailableBookCopy.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      ) : ""}
                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            onClick={() => submit()}
                            type="button"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {/* {btnSaveText} */}
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => resetBookIssueForm(true)}
                          >
                            {/* Clear */}
                            {<FormattedLabel id="clear" />}

                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => resetBookIssueForm(false)}
                          >
                            {/* Exit */}
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </Slide>
            )}
            <div className={styles.addbtn}>
              <Button
                variant="contained"
                endIcon={<OutIcon />}
                style={{ marginRight: '20px' }}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  issueBook()
                }}
              >
                {/* Issue */}
                {<FormattedLabel id="issue" />}
              </Button>
            </div>
            <DataGrid
              autoHeight
              rowHeight={100}
              sx={{
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3,
                overflowY: 'scroll',
                overflowX: 'scroll',

                '& .MuiDataGrid-virtualScrollerContent': {},
                '& .MuiDataGrid-columnHeadersInner': {
                  backgroundColor: '#556CD6',
                  color: 'white',
                },

                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
              }}
              rows={returnBooksAvailableList.map((item) => ({
                ...item,
                issuedAt: moment(item.issuedAt).format('DD/MM/YYYY'),
              }))}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Paper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  )
}
export default DepartmentalProcess
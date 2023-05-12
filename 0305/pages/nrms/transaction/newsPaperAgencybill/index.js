import { EyeFilled } from '@ant-design/icons'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ForwardIcon from '@mui/icons-material/Forward'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import SaveIcon from '@mui/icons-material/Save'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import {
  DataGrid
} from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import sweetAlert from "sweetalert"
import { GridToolbar } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { useRouter } from "next/router"
import urls from "../../../../URLS/urls"

const Index = () => {

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [id, setID] = useState();
  const [department, setDepartment] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);


  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const user = useSelector((state) => state.user.user);
  console.log("user", user);

  // selected menu from drawer
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user
  const authority = user?.menus?.find((r) => { return r.id == selectedMenuFromDrawer })?.roles;
  console.log("authority", authority);

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department)
      // console.log("res.data", r.data);
    })
  };

  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaper(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperName: r.newspaperName,
        }))
      );
    });
  };


  // Get Table - Data
  const getAllBillData = (_pageSize = 100, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir
        },
        headers: {
          Authorization: `Bearer ${user?.token}`,
          serviceId: selectedMenuFromDrawer,
        }
      })
      .then((r) => {

        let _res = r?.data?.trnNewspaperAgencyBillSubmissionList?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
          }
        })

        // let _res = result.map((r, i) => {
        //   console.log("4e4", r);
        //   let str = r.newsAdvertismentPublishedDate?.split("T")
        //   console.log("jj", str)
        //   let val = str && str[0]
        //   console.log("hh", val)

        //   return {
        //     activeFlag: r.activeFlag,
        //     devisionKey: r.divisionKey,
        //     srNo: i + 1,
        //     id: r.id,
        //     newspaperName: r.newspaperName,
        //     billAmount: r.billAmount,
        //     newsAdvertismentPublishedDate: val,
        //     wardKey: r.wardKey,
        //     wardName: r.wardName,
        //     departmentKey: r.departmentKey,
        //     departmentName: r.departmentName,
        //     priority: r.priority,
        //     newsAdvertisementSubject: r.newsAdvertisementSubject,
        //     workName: r.workName,
        //     workCost: r.workCost,
        //     newsAdvertismentDescription: r.newsAdvertismentDescription,
        //     attachement: r.attachement,
        //     createDtTm: r.createDtTm,
        //     newsPublishedInSqMeter: r.newsPublishedInSqMeter,
        //     newsRotationNumber: r.newsRotationNumber,
        //     status: r.status === null ? "Pending" :
        //       r.status === 0 ? "Save As Draft" :
        //         r.status === 1 ? "Approved By HOD" :
        //           r.status === 2 ? "Reject By NR HOD" :
        //             r.status === 3 ? "Pending For Payment" :
        //               r.status === 4 ? "Reject By  Department Clerk" :
        //                 r.status === 5 ? "Approved By NR HOD" :
        //                   r.status === 6 ? "Rejected By Department HOD" :
        //                     r.status === 7 ? "Approved By Assistant Commissioner" :
        //                       r.status === 8 ? "Completed" :
        //                         r.status === 9 ? "Closed" :
        //                           r.status === 10 ? "Duplicate" : "Invalid",
        //   };
        // });

        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        })
      })
  }

  useEffect(() => {
    getDepartment();
    getNewsPaper();
  }, []);


  useEffect(() => {
    getAllBillData();
  }, []);


  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr No',
      align: 'center',
      headerAlign: 'center',
      width: 50,

    },

    {
      field: "newspaperName",
      headerName: "Newspaper Name",
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      minWidth: 150,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },


    {
      field: "billAmount",
      headerName: "Bill Amount",
      width: 80,

      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "newsAdvertismentPublishedDate",
      headerName: "News Advertisement Publish Date",
      // width: 250,
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: "status",
      headerName: "Status",
      // width: 250,
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      // minWidth: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("432", params.row.activeFlag);
        return (
          <Box>

            {authority && authority[0] === "ENTRY" && params.row.status == "Pending For Payment" ? (
              <>  <IconButton
                // disabled={editButtonInputState}
                onClick={() => {

                  const record = params.row
                  router.push({
                    pathname: "/nrms/transaction/newsPaperAgencybill/payment/",
                    query: {
                      pageMode: 'View',
                      ...record,
                    },
                  })
                  console.log('row', params.row)
                    ; ('')
                }}
              >
                <ForwardIcon style={{ color: "#556CD6" }} />
              </IconButton>
              </>) :

              (
                <>        {authority && authority[0] === "ENTRY" ? (
                  <>
                    <IconButton
                      // disabled={editButtonInputState}
                      onClick={() => {
                        setBtnSaveText("Update"),
                          setID(params.row.id)
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </>)
                  :
                  <></>}



                  <IconButton
                    // disabled={editButtonInputState}
                    onClick={() => {
                      const record = params.row

                      router.push({
                        pathname: "/nrms/transaction/newsPaperAgencybill/approval/",
                        query: {
                          pageMode: 'View',
                          ...record,
                        },
                      })
                      console.log('row', params.row)
                        ; ('')
                    }}
                  >
                    <EyeFilled style={{ color: '#556CD6' }} />
                  </IconButton>



                  {/* Billl */}


                  <IconButton
                    // disabled={editButtonInputState}
                    onClick={() => {
                      const record = params.row

                      router.push({
                        pathname: "/nrms/transaction/releasingOrder/payment/",
                        query: {
                          pageMode: 'View',
                          ...record,
                        },
                      })
                      console.log('row', params.row)
                        ; ('')
                    }}
                  >
                    <LocalPrintshopOutlinedIcon style={{ color: '#556CD6' }} />
                  </IconButton>
                </>)}
          </Box>
        )
      },
    },
  ]

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log('body', body)
    if (_activeFlag === 'N') {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 201) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                getAllBillData()
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    } else {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/trnNewspaperAgencyBillSubmission/save`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 201) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                // getPaymentRate();
                getAllBillData()
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    }
  }


  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: 'grey.500',
          marginLeft: '10px',
          marginRight: '10px',
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px',
            background:
              'linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)',
          }}
        >
          <h2>

            Bill Submission

            {/* <FormattedLabel id="addHearing" /> */}
          </h2>
        </Box>
        <Divider />

        <div
          // className={styles.addbtn}
          style={{
            display: 'flex',
            justifyContent: 'right',
            marginTop: 10,
            marginRight: 40,
            marginBottom: 10,
          }}
        >

          <div >
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              // type='primary'
              // disabled={buttonInputState}
              onClick={() => {
                router.push({
                  pathname: "/nrms/transaction/newsPaperAgencybill/create",
                  query: {
                    pageMode: 'Add',
                  },
                })
              }}
            >
              Add
              {/* <FormattedLabel id="add" /> */}
            </Button>
          </div>


        </div>

        <div>
          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              height: 500,
              // width: 1000,
              // marginLeft: 10,

              // width: '100%',

              overflowX: 'auto',
            }}
          >
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getAllBillData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllBillData(_data, data.page);
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  )
}

export default Index

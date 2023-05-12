import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import theme from "../../../../theme.js";


import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  ThemeProvider,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {bankDetailsSchema,advocateDetailsSchema} from "../../../../containers/schema/LegalCaseSchema/advocateSchema";
import { EyeFilled } from "@ant-design/icons";
import urls from "../../../../URLS/urls";
import { setLocale } from "yup";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });


    
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [titles, settitles] = useState([]);
  const [dataValidation, setDataValidation] = useState(advocateDetailsSchema)




  
  // useEffect(() => {
  //   console.log('steps', activeStep)
  //   if (activeStep == '0') {
  //     setDataValidation(advocateDetailsSchema)
  //   } else if (activeStep == '1') {
  //     setDataValidation(bankDetailsSchema)
  //   } 
  // }, [activeStep])




  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    localStorage.removeItem("mstAdvocateAttachmentDao")
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getDepartmentName();
    gettitles()
  }, []);

  useEffect(() => {
//     if(dataSource?.mstAdvocateAttachmentDao != null || dataSource?.mstAdvocateAttachmentDao
// != ""||  dataSource?.mstAdvocateAttachmentDao != undefined    ){
//   localStorage.setItem("mstAdvocateAttachmentDao",dataSource?.mstAdvocateAttachmentDao
//   )
// }
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAdvocate();
  }, [courtNames, advocateNames,titles]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  const getAdvocate = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(
        `${urls.LCMSURL}/master/advocate/getAll`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        }
      )
      .then((r) => {
        console.log("r", r);
        let result = r.data.advocate;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,

            // srNo: i + 1,
            srNo: i + 1 + _pageSize * _pageNo,


            FullName: r.firstName + " " +  r.middleName + " " +r.lastName, 
            FullNameMr: r.firstNameMr + " " +  r.middleNameMr + " " +r.lastNameMr, 
            firstName:r.firstName,
            firstNameMr:r.firstNameMr,
            middleName:r.middleName,
            middleNameMr:r.middleNameMr,
            lastName:r.lastName,
            lastNameMr:r.lastNameMr,

            nameOfBarCouncil:r.nameOfBarCouncil,
            nameOfBarCouncilMr:r.nameOfBarCouncilMr,


            address:r.area +" " +r.city +" "+r.pinCode,
            addressMr:r.areaMr +" " +r.cityMr +" "+r.pinCode,

            mobileNo:r.mobileNo,

            advocateCategory:r.advocateCategory,

            title:r.title,

            aadhaarNo:r.aadhaarNo,
            panNo:r.panNo,
            nameOfBarCouncil:r.nameOfBarCouncil,
            nameOfBarCouncilMr:r.nameOfBarCouncilMr,
            bankName:r.bankName,
            branchName:r.branchName,
            accountNo:r.accountNo,
            bankIFSCCode:r.bankIFSCCode,
            bankMICRCode:r.bankMICRCode,
            city:r.city,
            cityMr:r.cityMr,
            area:r.area,
            areaMr:r.areaMr,
            roadName:r.roadName,
            roadNameMr:r.roadNameMr,
            landmark:r.landmark,
            landmarkMr:r.landmarkMr,
            pinCode:r.pinCode,
            phoneNo:r.phoneNo,
            mobileNo:r.mobileNo,
            emailAddress:r.emailAddress,
            
         
            // mstAdvocateAttachmentDao: JSON.stringify(
            //   r.mstAdvocateAttachmentDao.map((r, i) => {
            //     return { ...r, srNo: i + 1 };
            //   }),
            // ),
         
            mstAdvocateAttachmentDao:r.mstAdvocateAttachmentDao,

          

            

         








            status: r.activeFlag === "Y" ? "Active" : "Inactive",
           
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  // get Court Name
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`)
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      });
  };
  
  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`)
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      });
  };

  const [departmentNames, setDepartmentNames] = useState([]);

  const getDepartmentName = () => {
    axios
      .get(`${urls.LCMSURL}/master/department/getAll`)
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      });
  };

  // get Title
    const gettitles =() =>{
      axios
      .get(`${urls.CFCURL}/master/title/getAll`)
      .then((res) => {
        console.log('22',res);
        settitles(
          res.data.title.map((r, i) => ({
            id: r.id,
            title: r.title,
            titleMr:r.titleMr
          }))
        );
      });
  
    }
 
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${urls.LCMSURL}/master/advocate/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAdvocate()
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
            .post(
              `${urls.LCMSURL}/master/advocate/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getAdvocate()
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // get Case Type
  const [caseTypes, setCaseTypes] = useState([]);

  const getCaseTypes = () => {
    axios
      .get(`${urls.LCMSURL}/caseMainType/getCaseMainTypeData`)
      .then((res) => {
        setCaseTypes(
          res.data.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
          }))
        );
      });
  };

  const [caseSubTypes, setCaseSubTypes] = useState([]);

  const getCaseSubType = () => {
    axios
      .get(`${urls.LCMSURL}/CaseSubType/getCaseSubTypeData`)
      .then((res) => {
        setCaseSubTypes(
          res.data.map((r, i) => ({
            id: r.id,
            subType: r.subType,
          }))
        );
      });
  };

  const [years, setYears] = useState([]);

  const getYears = () => {
    axios
      .get(`${urls.LCMSURL}/master/year/getAll`)
      .then((res) => {
        setYears(
          res.data.year.map((r, i) => ({
            id: r.id,
            year: r.year,
          }))
        );
      });
  };

  // Edit Record
  const actionOnRecord = (record, pageMode) => {
    console.log("Record : ---> ", record);
    router.push({
      pathname: "/LegalCase/master/advocate/view",
      query: {
        pageMode: pageMode,
        ...record,
      },
    });
  };


  const columns = [
 
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      
      field: language === 'en' ? 'FullName' : 'FullNameMr',
      align: "center",
      headerAlign: "center",

      headerName: <FormattedLabel id="name" />,
      width: 250,
    },
    // {
    //   field:"advocateCategory",
    //   headerName: <FormattedLabel id="advocateCategory" />,
    //   width: 200,
    // },
    {
      // field: language === 'en' ? 'fullNameEn' : 'fullNameMr',

      // field:"nameOfBarCouncil",

      field: language === 'en'? 'nameOfBarCouncil':'nameOfBarCouncilMr',
      align: "center",
      headerAlign: "center",

      headerName: <FormattedLabel id="nameOfBarCouncil" />,
      width: 250,
    },

    {
      // field: language === 'en' ? 'fullNameEn' : 'fullNameMr',

      // field:"address",
      field:language === 'en'?'address':'addressMr',
      align: "center",
      headerAlign: "center",

      headerName: <FormattedLabel id="address" />,
      width: 290,
    },

    {

      field:"mobileNo",

      headerName: <FormattedLabel id="mobile" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      // headerName: "Actions",
      headerName:<FormattedLabel id="actions"/>,
      width:200,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseMainType" : "caseMainTypeMr"
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;
              const  mstAdvocateAttachmentDao= JSON.stringify(
                record?.mstAdvocateAttachmentDao?.map((r, i) => {
                    return { ...r, srNo: i + 1 };
                  }),
                )
              
                localStorage.setItem("mstAdvocateAttachmentDao",mstAdvocateAttachmentDao)
             
              console.log("record123",record?.row)
                router.push({
                  pathname: "/LegalCase/master/advocate/view",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  // setButtonInputState(true);
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

            {/* for View Icon */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                alert("View Icon")
                const record = params.row;
                const  mstAdvocateAttachmentDao= JSON.stringify(
                  record?.mstAdvocateAttachmentDao?.map((r, i) => {
                    return { ...r, srNo: i + 1 };
                  }),
                )
              
                localStorage.setItem("mstAdvocateAttachmentDao",mstAdvocateAttachmentDao)

                router.push({
                  pathname: "/LegalCase/master/advocate/view",
                  query: {
                    pageMode: "View",
                    ...record,
                  },
                });
                console.log(":...row", params.row);
                ("");
              }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton>

          </Box>
        );
      },
    },
  ];

  return (
    <>
      {/* <ThemeProvider theme={theme}> */}

    <Paper
        elevation={8}
        variant="outlined"
        sx={{
          // border: 1,
          // borderColor: "grey.500",
          border: "1px solid",
          borderColor:"blue",
          // marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
          <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
          
            <FormattedLabel id="advocate" />
          </h2>
        </Box>

        <Divider />
        <div>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: 10,
            marginRight:"9px",

          }}
        >
          <Button
            // type="primary"
            variant="contained"
            onClick={() =>{

              localStorage.removeItem("MstAdvocateAttachmentDao"),
              router.push(`/LegalCase/master/advocate/view`)
            }
            }
          >
            <FormattedLabel id="add" />
          </Button>
        </div>

        {/* </Paper> */}

        {/* New Table */}
        <Box
          sx={{
            height: "100%",
            marginTop:"10px",
            // border:"color: red",
            // width: 1000,
            // marginLeft: 10,

            // width: '100%',

            // overflowX: 'auto',
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
                printOptions: { disableToolbarButton: true },
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
            border: "1px solid",
            borderColor:"blue",


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
              // getCaseType(data.pageSize, _data);
              getAdvocate(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAdvocate(_data, data.page);
            }}
          />
        </Box>
      </div>
      </Paper>
      {/* </ThemeProvider> */}
    </>
  );
};

export default Index;

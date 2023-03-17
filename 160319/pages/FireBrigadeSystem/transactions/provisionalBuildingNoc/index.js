import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
// import styles from "./view.module.css";
// import schema from "./schema";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [nocTypes, setNocTypes] = useState([]);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const language = useSelector((state) => state?.labels.language);

  // Get Table - Data
  useEffect(() => {
    getData();
    getNocTypes();
  }, []);

  // get Noc Types
  const getNocTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfNOCMaster/getTypeOfNOCMasterData`)
      .then((res) => {
        console.log("resssss res", res.data);

        if (res.data) getData(10, 0, res.data);
        setNocTypes(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        let _res = res.data.provisionBuilding.map((r, i) => ({
          activeFlag: r.activeFlag,
          id: r.id,
          serialNo: r.id,
          applicationNo: r.applicationNo,
          applicantName: r.applicantName,
          applicantNameMr: r.applicantNameMr,
          applicantMiddleName: r.applicantMiddleName,
          applicantMiddleNameMr: r.applicantMiddleNameMr,
          applicantLastName: r.applicantLastName,
          applicantLastNameMr: r.applicantLastNameMr,
          applicationDate: r.applicationDate,
          officeContactNo: r.officeContactNo,
          workingSiteOnsitePersonMobileNo: r.workingSiteOnsitePersonMobileNo,
          emailId: r.emailId,
          appliedFor: r.appliedFor,
          architectName: r.architectName,
          architectNameMr: r.architectNameMr,
          architectFirmName: r.architectFirmName,
          architectFirmNameMr: r.architectFirmNameMr,
          architectRegistrationNo: r.architectRegistrationNo,
          applicantPermanentAddress: r.applicantPermanentAddress,
          applicantPermanentAddressMr: r.applicantPermanentAddressMr,
          siteAddress: r.siteAddress,
          siteAddressMr: r.siteAddressMr,
          applicantContactNo: r.applicantContactNo,
          finalPlotNo: r.finalPlotNo,
          revenueSurveyNo: r.finalPlotNo,
          buildingLocation: r.buildingLocation,
          townPlanningNo: r.townPlanningNo,
          blockNo: r.blockNo,
          opNo: r.opNo,
          citySurveyNo: r.citySurveyNo,
          typeOfBuilding: r.typeOfBuilding,
          residentialUse: r.residentialUse,
          commercialUse: r.commercialUse,
          nOCFor: r.nOCFor,
          buildingHeightFromGroundFloorInMeter:
            r.buildingHeightFromGroundFloorInMeter,
          noOfBasement: r.noOfBasement,
          totalBuildingFloor: r.totalBuildingFloor,
          basementAreaInsquareMeter: r.basementAreaInsquareMeter,
          noOfVentilation: r.noOfVentilation,
          noOfTowers: r.noOfTowers,
          plotAreaSquareMeter: r.plotAreaSquareMeter,
          constructionAreSqMeter: r.constructionAreSqMeter,
          noOfApprochedRoad: r.noOfApprochedRoad,
          drawingProvided: r.drawingProvided,
          highTensionLine: r.highTensionLine,
          highTensionLineMr: r.highTensionLineMr,
          areaZone: r.areaZone,
          previouslyAnyFireNocTaken: r.previouslyAnyFireNocTaken,
          underTheGroundWaterTankCapacityLighter:
            r.underTheGroundWaterTankCapacityLighter,
          underTheGroundWaterTankCapacityLighterMr:
            r.underTheGroundWaterTankCapacityLighterMr,
          l: r.l,
          b: r.b,
          h: r.h,
          volumeLBHIn: r.volumeLBHIn,
          approvedMapOfUndergroundWaterTank:
            r.approvedMapOfUndergroundWaterTank,
          overHeadWaterTankCapacityInLiter: r.overHeadWaterTankCapacityInLiter,
          overHearWaterTankCoApprovedMaps: r.overHearWaterTankCoApprovedMaps,
          overHearWaterTankCoApprovedMapsMr:
            r.overHearWaterTankCoApprovedMapsMr,
          approvedKeyPlan: r.approvedKeyPlan,
          approvedLayoutPlanPCMC: r.approvedLayoutPlanPCMC,
          approvedApproachRoadPCMC: r.approvedApproachRoadPCMC,
          measurementOfTank: r.measurementOfTank,
          explosiveLicense: r.explosiveLicense,
          permissionLetterOfPCMC: r.permissionLetterOfPCMC,
          completionCertificate: r.completionCertificate,
          structuralStabilityCertificate: r.structuralStabilityCertificate,
          escalatorApprovedByGovtCertificate:
            r.escalatorApprovedByGovtCertificate,
          fireDrawingFloorWiseAlsoApprovedByComplianceAuthority:
            r.fireDrawingFloorWiseAlsoApprovedByComplianceAuthority,
          activeFlag: r.activeFlag,
          nocfor: r.nocfor,

          // typeOfVardiId: dataSource?.find((obj) => {
          //   console.log("obj", obj);
          //   return obj.id === r.typeOfVardiId;
          // })?.vardiName
          //   ? dataSource?.find((obj) => {
          //       return obj.id === r.typeOfVardiId;
          //     })?.vardiName
          //   : "-",

          // slipHandedOverTo: r.slipHandedOverTo,

          // slipHandedOverToMr: r.slipHandedOverToMr,

          // dateAndTimeOfVardi: moment(
          //   r.dateAndTimeOfVardi,
          //   "YYYY-MM-DD HH:mm:ss"
          // ).format("YYYY-MM-DD HH:mm:ss"),

          // departureTime: moment(r.departureTime, "hh:mm (a/p)m").format(
          //   "hh:mm (a/p)m"
          // ),
        }));

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  // const getData = (_pageSize = 10, _pageNo = 0, data) => {
  //   console.log("daatatat", data);
  //   axios
  //     .get(`${urls.BaseURL}/transaction/provisionalBuildingFireNOC/getAll`, {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //       },
  //     })
  //     // .then((res) => {
  //     //   setDataSource(res?.data);
  //     // });
  //     .then((res) => {
  //       console.log("dattaaa", res.data);
  //       // setDataSource(res?.data);

  //       let _res = res.data.provisionBuilding.map((val, index) => {
  //         console.log("resssss noc val", val);
  //         var noc = "";
  //         data &&
  //           data.filter((item) => {
  //             if (
  //               val.nOCFor &&
  //               item.id &&
  //               item.id.toString().includes(val.nOCFor.toString())
  //             )
  //               noc = language == "en" ? item.nOCName : item.nOCNameMr;
  //           });
  //         console.log("resssss noc", noc);
  //         return {
  //           ...val,
  //           serialNo: val.id,
  //           nOCFor: noc,
  //         };
  //       });
  //       setData({
  //         rows: _res,
  //         totalRows: res.data.totalElements,
  //         rowsPerPageOptions: [10, 20, 50, 100],
  //         pageSize: res.data.pageSize,
  //         page: res.data.pageNo,
  //       });
  //       // setDataSource(_res);

  //       // setDataSource(val
  //       //   res.data.map((r, i) => {
  //       //     console.log("321", r, nocTypes, r.appliedFor);
  //       //     // return {
  //       //       return r,
  //       //       // ...r?.data,
  //       //       // appliedFor: "",
  //       //       // nOCFor: "",
  //       //       // nOCFor: nocTypes[r.appliedFor] ? nocTypes[r.appliedFor] : "-",
  //       //       // ...res?.data,
  //       //     // };
  //       //   })
  //       // );
  //     });
  // };

  // const getData = (_pageSize = 10, _pageNo=0) => {
  //   axios
  //     .get(
  //       `${urls.BaseURL}/transaction/provisionalBuildingFireNOC/getAll`, {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //       },
  //     }
  //     )
  //     // .then((res) => {
  //     //   setDataSource(res?.data);
  //     // });
  //     .then((res) => {
  //       console.log("dattaaa", res.data);
  //       // setDataSource(res?.data);
  //         return {
  //           ...val,
  //           serialNo: index,
  //           nOCFor:val.nOCFor,
  //         };
  //       });
  //       setData({
  //         rows: _res,
  //         totalRows: res.data.totalElements,
  //         rowsPerPageOptions: [10, 20, 50, 100],
  //         pageSize: res.data.pageSize,
  //         page: res.data.pageNo,
  //       });
  //       // setDataSource(_res);

  //       // setDataSource(val
  //       //   res.data.map((r, i) => {
  //       //     console.log("321", r, nocTypes, r.appliedFor);
  //       //     // return {
  //       //       return r,
  //       //       // ...r?.data,
  //       //       // appliedFor: "",
  //       //       // nOCFor: "",
  //       //       // nOCFor: nocTypes[r.appliedFor] ? nocTypes[r.appliedFor] : "-",
  //       //       // ...res?.data,
  //       //     // };
  //       //   })
  //       // );
  //     });
  // };

  console.log("33", dataSource);

  const viewRecord = (record) => {
    router.push({
      pathname: "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  //   setBtnSaveText("Update"),
  //     setID(rows.id),
  //     setIsOpenCollapse(true),
  //     setSlideChecked(true);
  //   reset(rows);
  // };

  const deleteById = async (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    swal({
      title: `${_activeFlag === "N" ? "Inactivate" : "Activate"}?`,
      text: `Are you sure you want to ${
        _activeFlag === "N" ? "inactivate" : "activate"
      } this Record ? `,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      console.log("inn", willDelete);
      if (willDelete === true) {
        axios
          .post(
            `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
            body
          )
          .then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
            }
          });
      } else if (willDelete == null) {
        swal("Record is Safe");
      }
    });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    applicantName: "",
    applicantMiddleName: "",
    applicantLastName: "",
    applicationDate: "",
    officeContactNo: "",
    workingSiteOnsitePersonMobileNo: "",
    emailId: "",
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    citySurveyNo: "",
    typeOfBuilding: "",
    residentialUse: "",
    commercialUse: "",
    nOCFor: "",
    buildingHeightFromGroundFloorInMeter: "",
    noOfBasement: "",
    totalBuildingFloor: "",
    basementAreaInsquareMeter: "",
    noOfVentilation: "",
    noOfTowers: "",
    plotAreaSquareMeter: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    applicantName: "",
    applicantMiddleName: "",
    applicantLastName: "",
    applicationDate: "",
    officeContactNo: "",
    workingSiteOnsitePersonMobileNo: "",
    emailId: "",
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    citySurveyNo: "",
    typeOfBuilding: "",
    residentialUse: "",
    commercialUse: "",
    nOCFor: "",
    buildingHeightFromGroundFloorInMeter: "",
    noOfBasement: "",
    totalBuildingFloor: "",
    basementAreaInsquareMeter: "",
    noOfVentilation: "",
    noOfTowers: "",
    plotAreaSquareMeter: "",
  };

  // define colums table
  const columns = [
    {
      headerName: <FormattedLabel id="srNoF" />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      width: 70,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      align: "center",
      headerAlign: "center",
      width: 200,
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="applicantNameI" />,
      width: 200,
    },

    {
      field: "applicantContactNo",
      headerName: <FormattedLabel id="applicantContactNo" />,
      width: 180,
    },
    {
      field: language == "en" ? "architectName" : "architectNameMr",
      headerName: <FormattedLabel id="architectName" />,
      width: 200,
    },
    // {
    //   field: "architectFirmName",
    //   headerName: <FormattedLabel id="architectName" />,
    //   width: 200,
    // },
    {
      field: "appliedFor",
      headerName: <FormattedLabel id="appliedFor" />,
      width: 170,
    },
    {
      field: "nOCFor",
      headerName: <FormattedLabel id="NOCFor" />,
      width: 170,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      textAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={params.row.activeFlag === "Y" ? false : true}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname:
                    "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <EditIcon style={{ color: "#556CD6" }} />
              ) : (
                <EditIcon />
              )}
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
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
          </Box>
        );
      },
    },
  ];

  // View
  return (
    // <BasicLayout>
    //   <div className={styles.addbtn}>
    //     <Button
    //       variant="contained"
    //       endIcon={<AddIcon />}
    //       type="primary"
    //       disabled={buttonInputState}
    //       // onClick={() => {
    //       //   reset({
    //       //     ...resetValuesExit,
    //       //   });
    //       //   setEditButtonInputState(true);
    //       //   setDeleteButtonState(true);
    //       //   setBtnSaveText("Save");
    //       //   setButtonInputState(true);
    //       //   setSlideChecked(true);
    //       //   setIsOpenCollapse(!isOpenCollapse);
    //       // }}
    //       onClick={() =>
    //         router.push({
    //           pathname:
    //             "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
    //         })
    //       }
    //     >
    //       Add{" "}
    //     </Button>
    //   </div>
    //   <DataGrid
    //     autoHeight
    //     sx={{
    //       marginLeft: 5,
    //       marginRight: 5,
    //       marginTop: 5,
    //       marginBottom: 5,
    //     }}
    //     rows={dataSource}
    //     columns={columns}
    //     pageSize={5}
    //     rowsPerPageOptions={[5]}
    //     //checkboxSelection
    //   />
    // </BasicLayout>
    <>
      <Box style={{ display: "flex", marginTop: "2%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            <Typography
              sx={{
                color: "white",
                padding: "2%",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              {<FormattedLabel id="provisionalBuilding" />}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            sx={{
              borderRadius: 100,
              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
            disabled={buttonInputState}
            onClick={() =>
              router.push({
                pathname:
                  "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
              })
            }
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      {/* <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "1%",
            paddingRight: "1%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box> */}

      <Box style={{ height: 400, width: "100%" }}>
        {/* For Pagination Changes in Code */}
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            paddingLeft: "1%",
            paddingRight: "1%",
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getData(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;

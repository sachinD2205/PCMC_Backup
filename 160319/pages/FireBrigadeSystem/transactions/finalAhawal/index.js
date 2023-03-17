import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Container, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import PrintIcon from "@mui/icons-material/Print";
import PendingIcon from "@mui/icons-material/Pending";

// import schema from "./form";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Modal from "@mui/material/Modal";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

// style For Loi Buttons Modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const Index = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  // loi receipt
  const viewRecord4 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      pathname: "/FireBrigadeSystem/transactions/finalAhawal/loiRecipt",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  // loi generation
  const viewRecord5 = (record) => {
    console.log("genrecord", JSON.stringify(record));
    router.push({
      pathname:
        "/FireBrigadeSystem/transactions/finalAhawal/loiGenerationComponent",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  // loi collection
  const viewRecord6 = (record) => {
    console.log("record", JSON.stringify(record));
    router.push({
      pathname:
        "/FireBrigadeSystem/transactions/finalAhawal/loiCollectionComponent",
      query: {
        pageMode: "Edit",
        ...record,
      },
    });
  };

  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();
  const [id, setID] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  console.log("data", data);

  useEffect(() => {
    getVardiTypes();
    getData();
  }, []);

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.BaseURL}/vardiTypeMaster/getVardiTypeMasterData`)
      .then((r) => {
        let vardi = {};
        r.data.map((r) => (vardi[r.id] = r.vardiName));
        setVardiTypes(vardi);
      });
  };

  // For Paginantion
  // get Table Data
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/saveTrnEmergencyServices`
  //     )
  //     .then((res) => {
  //       setDataSource(
  //         res.data.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           informerName: r.informerName,
  //           contactNumber: r.contactNumber,
  //           occurancePlace: r.occurancePlace,
  //           typeOfVardiId: r.typeOfVardiId,
  //           dateAndTimeOfVardi: moment(
  //             r.dateAndTimeOfVardi,
  //             "DD-MM-YYYY  HH:mm"
  //           ).format("DD-MM-YYYY  HH:mm"),
  //           // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
  //           // businessType: r.businessType,
  //           // businessTypeName: businessTypes?.find(
  //           //   (obj) => obj?.id === r.businessType
  //           // )?.businessType,
  //           // businessSubType: r.businessSubType,
  //           // remark: r.remark,
  //         }))
  //       );
  //     });
  // };

  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.FbsURL}/transaction/trnEmergencyServices/getByID${id}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log("form data", res.data.emergencyService);
        let _res = res?.data?.emergencyService
          // .filter((u) => u.activeFlag === "Y")
          .map((r, i) => {
            console.log("121", r);
            return {
              applicationStatus: r.applicationStatus,
              activeFlag: r.activeFlag,
              isPayment: r?.finalAhawal?.isPayment,
              chargesApply: r?.finalAhawal?.chargesApply,

              // application date
              dateAndTimeOfVardi: moment(
                r.dateAndTimeOfVardi,
                "YYYY-MM-DDTHH:mm:ss"
              ).format("YYYY-MM-DDTHH:mm:ss"),

              // required
              srNo: i + 1,
              activeFlag: r.activeFlag,
              id: r.id,
              serialNo: r.id,
              finalAhawalId: r?.finalAhawalId?.id,

              // Vardi Slip
              informerName: r?.vardiSlip?.informerName,
              informerNameMr: r?.vardiSlip?.informerNameMr,
              informerMiddleName: r?.vardiSlip?.informerMiddleName,
              informerMiddleNameMr: r?.vardiSlip?.informerMiddleNameMr,
              informerLastName: r?.vardiSlip?.informerLastName,
              informerLastNameMr: r?.vardiSlip?.informerLastNameMr,
              area: r?.vardiSlip?.area,
              areaMr: r?.vardiSlip?.areaMr,
              city: r?.vardiSlip?.city,
              cityMr: r?.vardiSlip?.cityMr,
              contactNumber: r?.vardiSlip?.contactNumber,
              mailID: r?.vardiSlip?.mailID,

              // vardi details
              vardiPlace: r?.vardiSlip?.vardiPlace,
              vardiPlaceMr: r?.vardiSlip?.vardiPlaceMr,
              landmark: r?.vardiSlip?.landmark,
              landmarkMr: r?.vardiSlip?.landmarkMr,
              typeOfVardiId: r?.vardiSlip?.typeOfVardiId,
              otherVardiType: r?.vardiSlip?.otherVardiType,
              subTypesOfVardi: r?.vardiSlip?.subTypesOfVardi,
              slipHandedOverTo: r?.vardiSlip?.slipHandedOverTo,
              fireStationName: r?.vardiSlip?.fireStationName,
              employeeName: r?.vardiSlip?.employeeName,

              // application date
              departureTime: moment(
                r?.firstAhawal?.departureTime,
                "hh:mm (a/p)m"
              ).format("hh:mm (a/p)m"),

              // first Ahawal
              vardiDispatchTime: r?.firstAhawal?.vardiDispatchTime,
              reasonOfFire: r?.firstAhawal?.reasonOfFire,
              otherReasonOfFire: r?.firstAhawal?.otherReasonOfFire,
              nameOfSubFireOfficer: r?.firstAhawal?.nameOfSubFireOfficer,
              nameOfMainFireOfficer: r?.firstAhawal?.nameOfMainFireOfficer,
              manPowerLoss: r?.firstAhawal?.manPowerLoss,
              isTenantHaveAnyLoss: r?.firstAhawal?.isTenantHaveAnyLoss,
              isLossInAmount: r?.firstAhawal?.isLossInAmount,
              fireStations: r?.firstAhawal?.fireStations,
              fireStationCrews: r?.firstAhawal?.fireStationCrews,
              isExternalPersonAddedInDuty:
                r?.firstAhawal?.isExternalPersonAddedInDuty,
              offDutyEmployees: r?.firstAhawal?.offDutyEmployees,
              // Table

              isExternalServiceProvide:
                r?.firstAhawal?.isExternalServiceProvide,
              // add more feild
              externalServiceId: r?.firstAhawal?.externalServiceId,
              ename: r.ename,
              econatact: r.econtactNo,
              //  eaddress: r.eaddress,

              firedThingsDuringAccuse: r?.firstAhawal?.firedThingsDuringAccuse,
              firedThingsDuringAccuseMr:
                r?.firstAhawal?.firedThingsDuringAccuseMr,
              insurancePolicyApplicable:
                r?.firstAhawal?.insurancePolicyApplicable,
              insurancePolicyDetails: r?.firstAhawal?.insurancePolicyDetails,
              insurancePolicyDetailsMr:
                r?.firstAhawal?.insurancePolicyDetailsMr,
              isFireEquipmentsAvailable:
                r?.firstAhawal?.isFireEquipmentsAvailable,
              fireEquipments: r?.firstAhawal?.fireEquipments,
              fireEquipmentsMr: r?.firstAhawal?.fireEquipmentsMr,

              // final ahawal
              outSidePcmcArea: r?.finalAhawal?.outSidePcmcArea,
              citizenNeedToPayment: r?.finalAhawal?.citizenNeedToPayment,
              pumpingCharge: r?.finalAhawal?.pumpingCharge,
              numberOfTrip: r?.finalAhawal?.numberOfTrip,
              rescueVardi: r?.finalAhawal?.rescueVardi,
              thirdCharge: r?.finalAhawal?.thirdCharge,
              otherChargesName: r?.finalAhawal?.otherChargesName,
              otherChargesAmount: r?.finalAhawal?.otherChargesAmount,
              typeOfFire: r?.finalAhawal?.typeOfFire,
              fireLossInformationDetails:
                r?.finalAhawal?.fireLossInformationDetails,
              fireLossInformationDetailsMr:
                r?.finalAhawal?.fireLossInformationDetailsMr,
              constructionLoss: r?.finalAhawal?.constructionLoss,
              levelOfFire: r?.finalAhawal?.levelOfFire,

              finacialLoss: r?.finalAhawal?.finacialLoss,
              finacialLossMr: r?.finalAhawal?.finacialLossMr,
              lossOfBuildingMaterial: r?.finalAhawal?.lossOfBuildingMaterial,
              lossOfBuildingMaterialMr:
                r?.finalAhawal?.lossOfBuildingMaterialMr,
              otherOutsideLoss: r?.finalAhawal?.otherOutsideLoss,
              otherOutsideLossMr: r?.finalAhawal?.otherOutsideLossMr,
              actual: r?.finalAhawal?.actual,
              saveOfLoss: r?.finalAhawal?.saveOfLoss,

              // Bill Payer Details
              billPayerName: r?.finalAhawal?.billPayerName,
              billPayerNameMr: r?.finalAhawal?.billPayerNameMr,
              billPayerMiddleName: r?.finalAhawal?.billPayerMiddleName,
              billPayerMiddleMr: r?.finalAhawal?.billPayerMiddleMr,
              billPayerLastName: r?.finalAhawal?.billPayerLastName,
              billPayerLastNameMr: r?.finalAhawal?.billPayerLastNameMr,
              billPayeraddress: r?.finalAhawal?.billPayeraddress,
              billPayeraddressMr: r?.finalAhawal?.billPayeraddressMr,
              billPayerVillage: r?.finalAhawal?.billPayerVillage,
              billPayerVillageMr: r?.finalAhawal?.billPayerVillageMr,
              billPayerContact: r?.finalAhawal?.billPayerContact,
              billPayerEmail: r?.finalAhawal?.billPayerEmail,

              //end

              locationArrivalTime: r?.finalAhawal?.locationArrivalTime,
              reasonOfFire: r?.finalAhawal?.reasonOfFire,
              firedThingsDuringAccuse: r?.finalAhawal?.firedThingsDuringAccuse,
              firedThingsDuringAccuseMr:
                r?.finalAhawal?.firedThingsDuringAccuseMr,
              lossInAmount: r?.finalAhawal?.lossInAmount,
              insurancePolicyDetails: r?.finalAhawal?.insurancePolicyDetails,
              insurancePolicyDetailsMr:
                r?.finalAhawal?.insurancePolicyDetailsMr,
              fireEquipments: r?.finalAhawal?.fireEquipments,
              fireEquipmentsMr: r?.finalAhawal?.fireEquipmentsMr,
              manPowerLoss: r?.finalAhawal?.manPowerLoss,
              manPowerLossMr: r?.finalAhawal?.manPowerLossMr,
              employeeDetailsDuringFireWorks:
                r?.finalAhawal?.employeeDetailsDuringFireWorks,
              chargesCollected: r?.finalAhawal?.chargesCollected,
              chargesCollectedMr: r?.finalAhawal?.chargesCollectedMr,
              billPayerDetails: r?.finalAhawal?.billPayerDetails,
              billPayerDetailsMr: r?.finalAhawal?.billPayerDetailsMr,
              nameOfSubFireOfficer: r?.finalAhawal?.nameOfSubFireOfficer,
              nameOfMainFireOfficer: r?.finalAhawal?.nameOfMainFireOfficer,
              employeeName: r?.finalAhawal?.employeeName,
              employeeNameMr: r?.finalAhawal?.employeeNameMr,
              nameOfOwner: r?.finalAhawal?.nameOfOwner,
              nameOfOwnerMr: r?.finalAhawal?.nameOfOwnerMr,
              nameOfTenant: r?.finalAhawal?.nameOfTenant,
              nameOfTenantMr: r?.finalAhawal?.nameOfTenantMr,
              firstVehicleReachAtLocationTime:
                r?.finalAhawal?.firstVehicleReachAtLocationTime,
              distanceFromMainFireStation:
                r?.finalAhawal?.distanceFromMainFireStation,
              distanceFromSubFireStation:
                r?.finalAhawal?.distanceFromSubFireStation,
              insuranced: r?.finalAhawal?.insuranced,
              fireType: r?.finalAhawal?.fireType,
              fireTypeMr: r?.finalAhawal?.fireTypeMr,
              fireReason: r?.finalAhawal?.fireReason,
              fireReasonMr: r?.finalAhawal?.fireReasonMr,

              firstVehicleLeftAtLocationDateAndTime:
                r?.finalAhawal?.firstVehicleLeftAtLocationDateAndTime,
              // bill payement Details

              subMenu: r?.finalAhawal?.subMenu,

              chequeDate: moment(
                r?.finalAhawal?.chequeDate,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD"),
              chequeNo: r?.finalAhawal?.chequeNo,
              modeOfPayment: r?.finalAhawal?.modeOfPayment,
              bankName: r?.finalAhawal?.bankName,
              amountInWord: r?.finalAhawal?.amountInWord,

              applicationNo: r?.applicationNo,
              totalAmount: r?.finalAhawal?.totalAmount,
              finalAhawalId: r?.finalAhawal?.id,
            };
          });

        // let _res = res.data.emergencyService.map((r, i) => ({
        //   activeFlag: r.activeFlag,
        //   id: r.id,
        //   serialNo: r.id,
        //   informerName: r.informerName,
        //   informerNameMr: r.informerNameMr,
        //   informerMiddleName: r.informerMiddleName,
        //   informerMiddleNameMr: r.informerMiddleNameMr,
        //   informerLastName: r.informerLastName,
        //   informerLastNameMr: r.informerLastNameMr,
        //   contactNumber: r.contactNumber,
        //   occurancePlace: r.occurancePlace,
        //   occurancePlaceMr: r.occurancePlaceMr,
        //   area: r.area,
        //   areaMr: r.areaMr,
        //   landmark: r.landmark,
        //   landmarkMr: r.landmarkMr,
        //   city: r.city,
        //   cityMr: r.cityMr,
        //   pinCode: r.pinCode,
        //   typeOfVardiId: r.typeOfVardiId,

        //   // typeOfVardiId: dataSource?.find((obj) => {
        //   //   console.log("obj", obj);
        //   //   return obj.id === r.typeOfVardiId;
        //   // })?.vardiName
        //   //   ? dataSource?.find((obj) => {
        //   //       return obj.id === r.typeOfVardiId;
        //   //     })?.vardiName
        //   //   : "-",

        //   slipHandedOverTo: r.slipHandedOverTo,

        //   slipHandedOverToMr: r.slipHandedOverToMr,
        //   // dateAndTimeOfVardi: moment(
        //   //   r.dateAndTimeOfVardi,
        //   //   "YYYY-MM-DD HH:mm:ss"
        //   // ).format("YYYY-MM-DD HH:mm:ss"),

        //   dateAndTimeOfVardi: moment(
        //     r.dateAndTimeOfVardi,
        //     "YYYY-MM-DD HH:mm:ss"
        //   ).format("YYYY-MM-DD HH:mm:ss"),

        //   // departureTime: r.departureTime,

        //   departureTime: moment(r.departureTime, "hh:mm (a/p)m").format(
        //     "hh:mm (a/p)m"
        //   ),
        // }));

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  // Delete
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
            .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setEditButtonInputState(true);
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getData();
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
            .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setEditButtonInputState(false);
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getSubType()
                getData();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // View Record
  // const viewRecord = (record) => {
  //   console.log("rec", record);
  //   router.push({
  //     pathname: "/FireBrigadeSystem/transactions/emergencyService/form",
  //     query: {
  //       btnSaveText: "Update",
  //       pageMode: "Edit",
  //       ...record,
  //     },
  //   });
  // };

  // define colums table
  const columns = [
    {
      headerName: <FormattedLabel id='srNoF' />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 80,
    },
    {
      headerName: <FormattedLabel id='informerNameF' />,
      // headerName: "Informer Name",
      field: language == "en" ? "informerName" : "informerNameMr",
      flex: 1,
      width: 150,
    },
    {
      headerName: <FormattedLabel id='informerLastNameF' />,
      field: language == "en" ? "informerLastName" : "informerLastNameMr",
      flex: 1,
      width: 150,
    },

    {
      field: "contactNumber",
      width: 230,
      headerName: <FormattedLabel id='contactNumberF' />,
      flex: 1,
    },

    // {
    //   headerName: <FormattedLabel id="typeOfVardiIdF" />,
    //   field: language == "en" ? "typeOfVardiId" : "typeOfVardiIdMr",
    //   flex: 1,
    // },
    {
      headerName: <FormattedLabel id='dateAndTimeOfVardiF' />,
      field: "dateAndTimeOfVardi",
      width: 180,
    },
    // For Paginantion Change Code
    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id='actions' />,
      width: 280,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row.applicationStatus);
        return (
          <Box>
            {/* {params.row.applicationStatus ===
              "APPLICATION_SENT_TO_MAIN_FIRE_OFFICER" && (
              <IconButton
                // disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/finalAhawal/form",
                    query: {
                      pageMode: "Edit",
                      ...record,
                    },
                  });
                  console.log("row action", params.row);
                  ("");
                }}
              >
                <Button
                  size="small"
                  // variant="contained"
                  // className={styles.click}

                  sx={{
                    border: "1px solid #5499C7",
                    backgroundColor: "#ecf0f1",
                  }}
                >
                  <CheckBoxOutlinedIcon size="4em" />
                </Button>
              </IconButton>
            )} */}

            {/* {params.row.applicationStatus ===
              "APPLICATION_SENT_TO_SUB_FIRE_OFFICER" && ( */}
            <IconButton
              // disabled={params.row.activeFlag === "Y" ? false : true}
              onClick={() => {
                const record = params.row;
                router.push({
                  pathname: "/FireBrigadeSystem/transactions/finalAhawal/form",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row action", params.row);
                ("");
              }}
            >
              <Button
                size='small'
                // variant="contained"
                // className={styles.click}

                sx={{
                  border: "1px solid #5499C7",
                  backgroundColor: "#ecf0f1",
                }}
              >
                Action
              </Button>
            </IconButton>
            {/* )} */}

            {/* {params.row.applicationStatus === "LOI_GENERATED" && (
              <IconButton
                // disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/finalAhawal/form",
                    query: {
                      pageMode: "Edit",
                      ...record,
                    },
                  });
                }}
              >
                <Button
                  size="small"
                  sx={{
                    border: "1px solid #5499C7",
                    backgroundColor: "#ecf0f1",
                  }}
                >
                  Completed
                </Button>
              </IconButton>
            )} */}

            {params.row.applicationStatus ===
              "APPLICATION_SENT_TO_MAIN_FIRE_OFFICER" &&
              params.row.applicationStatus === "LOI_GENERATED" && (
                <IconButton
                  // disabled={params.row.activeFlag === "Y" ? false : true}
                  onClick={() => {
                    const record = params.row;
                    router.push({
                      pathname:
                        "/FireBrigadeSystem/transactions/finalAhawal/form",
                      query: {
                        pageMode: "Edit",
                        ...record,
                        finalAhawalId: record.finalAhawal.id,
                      },
                    });
                    console.log("row action", params.row);
                    ("");
                  }}
                >
                  <Button
                    size='small'
                    className={styles.click}
                    variant='outlined'
                  >
                    Action
                  </Button>
                </IconButton>
              )}

            {params.row.applicationStatus === "LOI_GENERATED" ? (
              <IconButton>
                <Button
                  size='small'
                  variant='contained'
                  sx={{ width: "150px" }}
                >
                  LOI Generated
                </Button>
              </IconButton>
            ) : (
              <IconButton
                // disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/finalAhawal/loiGenerationComponent",
                    query: {
                      pageMode: "Edit",
                      ...record,
                    },
                  });
                  console.log("pkk", record);
                  ("");
                }}
              >
                <Button
                  size='small'
                  className={styles.click}
                  variant='outlined'
                >
                  Payment verification
                </Button>
              </IconButton>
            )}

            {/* <IconButton>
              <Button
                onClick={() => {
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/finalAhawal/loiCollectionComponent",
                  });
                }}
                size="small"
                className={styles.click}
                variant="outlined"
              >
                LOI Collection
              </Button>
            </IconButton> */}
          </Box>
        );
      },
    },
    {
      field: "paymentStatus",
      headerAlign: "center",
      align: "center",
      // headerName: <FormattedLabel id="paymentStatus" />,
      headerName: "Payment Status",
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("0000", params.row.isPayment);
        return (
          <Box>
            {params.row.isPayment === "Y" ? (
              <Button>
                <CheckCircleIcon color='success' />
              </Button>
            ) : (
              <IconButton
                // disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/finalAhawal/paymentDetails",
                    query: {
                      pageMode: "Edit",
                      isPayment: "N",
                      ...record,
                    },
                  });
                  ("");
                }}
              >
                <Button
                  size='small'
                  sx={{ color: "blue", textTransform: "capitalize" }}
                >
                  Pending
                </Button>
              </IconButton>
            )}
          </Box>
        );
      },
    },
    {
      field: "print",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id='print' />,
      // headerName: "Print",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("iiiiii", params.row);
        return (
          <Box>
            {params.row.isPayment === "Y" ? (
              // <Button>
              //   <CheckCircleIcon color="success" />
              // </Button>
              <IconButton
                // disabled={params.row.activeFlag === "Y" ? false : true}
                onClick={() => {
                  const record = params.row;
                  console.log("0000", params.row);

                  router.push({
                    pathname:
                      "/FireBrigadeSystem/transactions/finalAhawal/print",
                    query: {
                      pageMode: "Edit",
                      isPayment: "N",
                      ...record,
                    },
                  });
                  ("");
                }}
              >
                <Button
                  size='small'
                  // className={styles.click}
                  // variant="outlined"
                >
                  <PrintIcon sx={{ color: "black" }} />
                </Button>
              </IconButton>
            ) : (
              // <>Payment Incompleted</>
              <Button
                aria-readonly
                size='small'
                // className={styles.click}
                sx={{ color: "#CCD1D1" }}
              >
                <PendingIcon />
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id='finalVardi' />}
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", height: "100%" }}>
        {/* For Pagination Changes in Code */}
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density='compact'
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
          paginationMode='server'
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
    </Box>
  );
};

export default Index;

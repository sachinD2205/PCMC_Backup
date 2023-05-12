import { Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { Failed } from "../../streetVendorManagementSystem/components/commonAlert";
/** Sachin Durge */
// FormsDetials
const FormsDetails = ({ view = false, readOnly = false }) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [roadWidth, setRoadWidth] = useState([]);

  // formDTLDao -
  // states - Ptax
  const [propertyDetailsTableData, setPropertyDetailsTableData] = useState([]);
  const [buttonInputStatePtax, setButtonInputStatePtax] = useState(false);
  const [isOpenCollapsePtax, setIsOpenCollapsePtax] = useState(false);
  const [editButtonInputStatePtax, setEditButtonInputStatePtax] = useState(false);
  const [deleteButtonInputStatePtax, setDeleteButtonStatePtax] = useState(false);
  const [slideCheckedPtax, setSlideCheckedPtax] = useState(false);
  const [btnSaveTextPtax, setBtnSaveTextPtax] = useState("Save");
  const [viewButtonInputStatePtax, setViewButtonInputStatePtax] = useState(false);
  const [disabledInputStatePtax, setDisabledInputStatePtax] = useState(false);
  const [visibilityIconStatePtax, setVisibilityIconStatePtax] = useState(false);

  //  statex - WaterTank
  const [buttonInputStateWaterTank, setButtonInputStateWaterTank] = useState(false);
  const [isOpenCollapseWaterTank, setIsOpenCollapseWaterTank] = useState(false);
  const [editButtonInputStateWaterTank, setEditButtonInputStateWaterTank] = useState(false);
  const [deleteButtonInputStateWaterTank, setDeleteButtonStateWaterTank] = useState(false);
  const [slideCheckedWaterTank, setSlideCheckedWaterTank] = useState(false);
  const [btnSaveTextWaterTank, setBtnSaveTextWaterTank] = useState("Save");
  const [viewButtonInputStateWaterTank, setViewButtonInputStateWaterTank] = useState(false);
  const [disabledInputStateWaterTank, setDisabledInputStateWaterTank] = useState(false);
  const [visibilityIconStateWaterTank, setVisibilityIconStateWaterTank] = useState(false);
  const [waterTankDetailsTableData, setWaterTankDetailsTableData] = useState([]);

  // getRoadWidth
  const getRoadWidth = () => {
    axios
      .get(`${urls.FbsURL}/master/accessRoadWidth/getAll`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setRoadWidth(res?.data?.accessRoadWidth);
        } else {
          <Failed />;
        }
      })
      .catch((error) => {
        console.log(error);
        <Failed />;
      });
  };

  // SetPropertyDetailsValues
  const SetPropertyDetailsValues = (props) => {
    console.log("setOwnerValues", props);
    setValue("propertyId", props?.id);
    setValue("formDtlId", props?.formDtlId);
    setValue("propertyNo", props?.propertyNo);
    setValue("propertyActiveFlag", props?.activeFlag);
  };

  // SetWaterTankDetailsValues
  const SetWaterTankDetailsValues = (props) => {
    console.log("SetWaterTankDetailsValuesProps4545", props);
    setValue("length", props?.length);
    setValue("breadth", props?.breadth);
    setValue("height", props?.height);
    setValue("capacity", props?.capacity);
    setValue("waterTankId", props?.id);
    setValue("waterTankActiveFlag", props?.activeFlag);
    setValue("formDtlId", props?.formDtlId);
  };

  // resetOwnerValuesWithIdPtax
  const resetOwnerValuesIdPtax = () => {
    setValue("propertyId", null);
    setValue("formDtlId", null);
    setValue("propertyNo", "");
    setValue("propertyActiveFlag", null);
  };

  // resetOwnerValuesWithIdWaterTank
  const resetOwnerValuesIdWaterTank = () => {
    setValue("length", "");
    setValue("breadth", "");
    setValue("height", "");
    setValue("capacity", "");
    setValue("waterTankId", null);
    setValue("waterTankActiveFlag", null);
  };

  // exitFunctionPtax
  const exitFunctionPtax = () => {
    // editButtonState
    setEditButtonInputStatePtax(false);
    // deleteButtonState
    setDeleteButtonStatePtax(false);
    // addButtonState
    setButtonInputStatePtax(false);
    // visibilityIcon
    setVisibilityIconStatePtax(false);
    // viewIconState
    setViewButtonInputStatePtax(false);
    // save/updateButtonText
    setBtnSaveTextPtax("Save");
    // conditionalRendering
    setSlideCheckedPtax(true);
    // collpaseOpen/Close
    setIsOpenCollapsePtax(false);
    // resetValuesWithId
    resetOwnerValuesIdPtax();
    // disabledInputStatePtax
    setDisabledInputStatePtax(false);
  };

  // exitFunctionPtax
  const exitFunctionWaterTax = () => {
    // editButtonState
    setEditButtonInputStateWaterTank(false);
    // deleteButtonState
    setDeleteButtonStateWaterTank(false);
    // addButtonState
    setButtonInputStateWaterTank(false);
    // visibilityIcon
    setVisibilityIconStateWaterTank(false);
    // viewIconState
    setViewButtonInputStateWaterTank(false);
    // save/updateButtonText
    setBtnSaveTextWaterTank("Save");
    // conditionalRendering
    setSlideCheckedWaterTank(true);
    // collpaseOpen/Close
    setIsOpenCollapseWaterTank(false);
    // resetValuesWithId
    resetOwnerValuesIdWaterTank();
    // disabledInputStateWaterTank
    setDisabledInputStateWaterTank(false);
  };

  // propertyDetailsTableColumn
  const propertyDetailsTableColumn = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "propertyNo",
      headerName: "Property No.",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={visibilityIconStatePtax}
              onClick={() => {
                SetPropertyDetailsValues(params?.row);
                // editButtonState
                setEditButtonInputStatePtax(true);
                // deleteButtonState
                setDeleteButtonStatePtax(true);
                // addButtonState
                setButtonInputStatePtax(true);
                // visibilityIcon
                setVisibilityIconStatePtax(true);
                // viewIconState
                setViewButtonInputStatePtax(true);
                // conditionalRendering
                setSlideCheckedPtax(true);
                // collpaseOpen/Close
                setIsOpenCollapsePtax(true);
                // disabledInputStatePtax
                setDisabledInputStatePtax(true);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputStatePtax}
                onClick={() => {
                  // setValues
                  SetPropertyDetailsValues(params?.row);

                  // editButtonState
                  setEditButtonInputStatePtax(true);
                  // deleteButtonState
                  setDeleteButtonStatePtax(true);
                  // addButtonState
                  setButtonInputStatePtax(true);

                  // visibilityIcon
                  setVisibilityIconStatePtax(true);
                  // viewIconState
                  setViewButtonInputStatePtax(false);
                  // save/updateButtonText
                  setBtnSaveTextPtax("Update");
                  // conditionalRendering
                  setSlideCheckedPtax(true);
                  // collpaseOpen/Close
                  setIsOpenCollapsePtax(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputStatePtax}
                onClick={() => {
                  deleteByIdPtax(params?.row?.id);
                  // editButtonState
                  setEditButtonInputStatePtax(true);
                  // deleteButtonState
                  setDeleteButtonStatePtax(true);
                  // addButtonState
                  setButtonInputStatePtax(true);
                  // visibility
                  setVisibilityIconStatePtax(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton>
                <Visibility />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // tankDetailsTableColumn
  const tankDetailsTableColumn = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "length",
      headerName: "Length",
      flex: 1,
    },
    {
      field: "height",
      headerName: "Height",
      flex: 1,
    },
    {
      field: "breadth",
      headerName: "Breadth",
      flex: 1,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={visibilityIconStateWaterTank}
              onClick={() => {
                SetWaterTankDetailsValues(params?.row);
                // editButtonState
                setEditButtonInputStateWaterTank(true);
                // deleteButtonState
                setDeleteButtonStateWaterTank(true);
                // addButtonState
                setButtonInputStateWaterTank(true);
                // visibilityIcon
                setVisibilityIconStateWaterTank(true);
                // viewIconState
                setViewButtonInputStateWaterTank(true);
                // conditionalRendering
                setSlideCheckedWaterTank(true);
                // collpaseOpen/Close
                setIsOpenCollapseWaterTank(true);
                // disabledInputStateWaterTank
                setDisabledInputStateWaterTank(true);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputStateWaterTank}
                onClick={() => {
                  // setValues
                  SetWaterTankDetailsValues(params?.row);

                  // editButtonState
                  setEditButtonInputStateWaterTank(true);
                  // deleteButtonState
                  setDeleteButtonStateWaterTank(true);
                  // addButtonState
                  setButtonInputStateWaterTank(true);

                  // visibilityIcon
                  setVisibilityIconStateWaterTank(true);
                  // viewIconState
                  setViewButtonInputStateWaterTank(false);
                  // save/updateButtonText
                  setBtnSaveTextWaterTank("Update");
                  // conditionalRendering
                  setSlideCheckedWaterTank(true);
                  // collpaseOpen/Close
                  setIsOpenCollapseWaterTank(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputStateWaterTank}
                onClick={() => {
                  deleteByIdWaterTank(params?.row?.id);
                  // editButtonState
                  setEditButtonInputStateWaterTank(true);
                  // deleteButtonState
                  setDeleteButtonStateWaterTank(true);
                  // addButtonState
                  setButtonInputStateWaterTank(true);
                  // visibilityIcon
                  setVisibilityIconStateWaterTank(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton>
                <Visibility />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // savePropertyDetails
  const savePropertyDetails = () => {
    // currentOwnerDTLDao
    const currentPropertyDetails = {
      propertyNo: getValues("propertyNo"),
      id: getValues("propertyId"),
      activeFlag: getValues("propertyActiveFlag"),
      formDtlId: getValues("formDtlId"),
    };

    console.log("currentPropertyDetails", currentPropertyDetails?.id);

    // getAlredyData
    let tempPropertyDTLDao = watch("formDTLDao.propertyDTLDao");
    console.log("tempPropertyDTLDao", tempPropertyDTLDao);
    const tempPropertyDTLDaoLegnth = Number(tempPropertyDTLDao.length);

    // OwnerTableList
    if (tempPropertyDTLDao != null && tempPropertyDTLDao != undefined && tempPropertyDTLDaoLegnth != 0) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (currentPropertyDetails?.id == null || currentPropertyDetails?.id == undefined) {
        // ifAlredyRecordNotExit - Save
        setValue("formDTLDao.propertyDTLDao", [...tempPropertyDTLDao, currentPropertyDetails]);
      } else {
        // ifAlredyRecordExit - Update
        const tempDataPtax = tempPropertyDTLDao.filter((data, index) => {
          if (data?.id != currentPropertyDetails?.id) {
            return data;
          }
        });
        setValue("formDTLDao.propertyDTLDao", [...tempDataPtax, currentPropertyDetails]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("formDTLDao.propertyDTLDao", [currentPropertyDetails]);
    }

    // finalBodyForApi
    const finalBodyForApi = {
      id: getValues("provisionalBuildingNocId "),
      // applicantDTLDao
      applicantDTLDao: watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLDao
      ownerDTLDao: watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],
      // formDTLDao
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
      // buildingDTLDao
      buildingDTLDao: watch("buildingDTLDao") == undefined ? [] : [...watch("buildingDTLDao")],
      // attachments
      attachments: watch("attachments") == undefined ? [] : [...watch("attachments")],
    };

    console.log("finalBodyForApiPtax", finalBodyForApi);

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("res?.data", res?.data);
          // setId
          console.log("provisionalBuildingNocId", res?.data?.status?.split("$")[1]);
          setValue("provisionalBuildingNocId", res?.data?.status?.split("$")[1]);
          // collpaseOpen/Close
          setIsOpenCollapsePtax(false);
          // editButtonState
          setEditButtonInputStatePtax(false);
          // deleteButtonState
          setDeleteButtonStatePtax(false);
          // addButtonState
          setButtonInputStatePtax(false);
          // visibilityIcon
          setVisibilityIconStatePtax(false);
          // viewIconState
          setViewButtonInputStatePtax(false);
          // disabledInputStatePtax
          setDisabledInputStatePtax(false);
          // resetOwnerValuesWithID
          resetOwnerValuesIdPtax();
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          <Failed />;
        }
      })
      .catch((error) => {
        console.log("Error", error);
        <Failed />;
      });
  };

  // saveTankDetails
  const saveTankDetails = () => {
    // currentOwnerDTLDao
    const currentUnderGroundWaterTankDao = {
      length: getValues("length"),
      breadth: getValues("breadth"),
      height: getValues("height"),
      capacity: getValues("capacity"),
      id: getValues("waterTankId"),
      activeFlag: getValues("waterTankActiveFlag"),
      formDtlId: getValues("formDtlId"),
    };

    console.log("currentUnderGroundWaterTankDaoId", currentUnderGroundWaterTankDao?.id);

    // getAlredyData
    let tempWaterTankDTLDao = watch("formDTLDao.underGroundWaterTankDao");
    console.log("tempWaterTankDTLDao", tempWaterTankDTLDao);
    const tempWaterTankDTLDaolength = Number(tempWaterTankDTLDao.length);

    // OwnerTableList
    if (tempWaterTankDTLDao != null && tempWaterTankDTLDao != undefined && tempWaterTankDTLDaolength != 0) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (currentUnderGroundWaterTankDao?.id == null || currentUnderGroundWaterTankDao?.id == undefined) {
        // ifAlredyRecordNotExit - Save
        setValue("formDTLDao.underGroundWaterTankDao", [
          ...tempWaterTankDTLDao,
          currentUnderGroundWaterTankDao,
        ]);
      } else {
        // ifAlredyRecordExit - Update
        const tempDataWaterTank = tempWaterTankDTLDao.filter((data, index) => {
          if (data?.id != currentUnderGroundWaterTankDao?.id) {
            return data;
          }
        });
        setValue("formDTLDao.underGroundWaterTankDao", [
          ...tempDataWaterTank,
          currentUnderGroundWaterTankDao,
        ]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("formDTLDao.underGroundWaterTankDao", [currentUnderGroundWaterTankDao]);
    }

    // finalBodyForApi
    const finalBodyForApi = {
      id: getValues("provisionalBuildingNocId "),
      // applicantDTLDao
      applicantDTLDao: watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLDao
      ownerDTLDao: watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],
      // formDTLDao
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
      // buildingDTLDao
      buildingDTLDao: watch("buildingDTLDao") == undefined ? [] : [...watch("buildingDTLDao")],
      // attachments
      attachments: watch("attachments") == undefined ? [] : [...watch("attachments")],
    };

    console.log("finalBodyForApiPtax", finalBodyForApi);

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, finalBodyForApi)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("res?.data", res?.data);
          // setId
          console.log("provisionalBuildingNocId", res?.data?.status?.split("$")[1]);
          setValue("provisionalBuildingNocId", res?.data?.status?.split("$")[1]);
          // collpaseOpen/Close
          setIsOpenCollapseWaterTank(false);
          // editButtonState
          setEditButtonInputStateWaterTank(false);
          // deleteButtonState
          setDeleteButtonStateWaterTank(false);
          // addButtonState
          setButtonInputStateWaterTank(false);
          // visibilityIcon
          setVisibilityIconStateWaterTank(false);
          // viewIconState
          setViewButtonInputStateWaterTank(false);
          // disabledInputStateWaterTank
          setDisabledInputStateWaterTank(false);
          // resetOwnerValuesWithID
          resetOwnerValuesIdWaterTank();
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          <Failed />;
        }
      })
      .catch((error) => {
        console.log("Error", error);
        <Failed />;
      });
  };

  // deleteByIDPtax
  const deleteByIdPtax = async (value) => {
    let propertyDetailsId = value;
    console.log("propertyDetailsId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempPropertyDTLDaoPtax = watch("formDTLDao.propertyDTLDao");
        let tempPropertyDTLDaoPtaxLength = tempPropertyDTLDaoPtax.length;

        console.log("tempPropertyDTLDaoPtax", tempPropertyDTLDaoPtax);
        console.log("tempPropertyDTLDaoPtaxLength", tempPropertyDTLDaoPtaxLength);

        if (
          tempPropertyDTLDaoPtax != null &&
          tempPropertyDTLDaoPtax != undefined &&
          tempPropertyDTLDaoPtaxLength != 0
        ) {
          //activeFlagYRecords
          const tempDataYPtax = tempPropertyDTLDaoPtax.filter((data, index) => {
            if (data?.id != propertyDetailsId) {
              return data;
            }
          });

          console.log("tempDataYPtax", tempDataYPtax);

          // wantToDeletRecord
          const tempDataPtax = tempPropertyDTLDaoPtax.filter((data, index) => {
            if (data?.id == propertyDetailsId) {
              return data;
            }
          });

          console.log("tempDataPtax", tempDataPtax);

          // activeFlagNRecord
          const tempDataNPtax = tempDataPtax.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          console.log("tempDataNPtax", tempDataNPtax);

          // updateRecord
          setValue("formDTLDao.propertyDTLDao", [...tempDataYPtax, ...tempDataNPtax]);

          console.log("sdfdskfdsfjdslkfjadsklfjdsklfjskldfjdslkfj", watch("formDTLDao.propertyDTLDao"));

          // states
          // editButtonState
          setEditButtonInputStatePtax(false);
          // deleteButtonState
          setDeleteButtonStatePtax(false);
          // addButtonState
          setButtonInputStatePtax(false);
          // viewIconState
          setVisibilityIconStatePtax(false);
        }
      } else {
        setEditButtonInputStatePtax(false);
        // deleteButtonState
        setDeleteButtonStatePtax(false);
        // addButtonState
        setButtonInputStatePtax(false);
        // viewIconState
        setVisibilityIconStatePtax(false);
      }
    });
  };

  // deleteByIDPtax
  const deleteByIdWaterTank = async (value) => {
    let waterTankDetailsId = value;
    console.log("waterTankDetailsId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempPropertyDTLDaoWaterTank = watch("formDTLDao.underGroundWaterTankDao");
        let tempPropertyDTLDaoWaterTankLength = tempPropertyDTLDaoWaterTank.length;

        console.log("tempPropertyDTLDaoWaterTank", tempPropertyDTLDaoWaterTank);
        console.log("tempPropertyDTLDaoWaterTankLength", tempPropertyDTLDaoWaterTankLength);

        if (
          tempPropertyDTLDaoWaterTank != null &&
          tempPropertyDTLDaoWaterTank != undefined &&
          tempPropertyDTLDaoWaterTankLength != 0
        ) {
          //activeFlagYRecords
          const tempDataYWaterTank = tempPropertyDTLDaoWaterTank.filter((data, index) => {
            if (data?.id != waterTankDetailsId) {
              return data;
            }
          });

          console.log("tempDataYWaterTank", tempDataYWaterTank);

          // wantToDeletRecord
          const tempDataWaterTank = tempPropertyDTLDaoWaterTank.filter((data, index) => {
            if (data?.id == waterTankDetailsId) {
              return data;
            }
          });

          console.log("tempDataWaterTank", tempDataWaterTank);

          // activeFlagNRecord
          const tempDataNWaterTank = tempDataWaterTank.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          console.log("tempDataNWaterTank", tempDataNWaterTank);

          // updateRecord
          setValue("formDTLDao.underGroundWaterTankDao", [...tempDataYWaterTank, ...tempDataNWaterTank]);

          // states
          // editButtonState
          setEditButtonInputStateWaterTank(false);
          // deleteButtonState
          setDeleteButtonStateWaterTank(false);
          // addButtonState
          setButtonInputStateWaterTank(false);
          // viewIconState
          setVisibilityIconStateWaterTank(false);
        }
      } else {
        // editButtonState
        setEditButtonInputStateWaterTank(false);
        // deleteButtonState
        setDeleteButtonStateWaterTank(false);
        // addButtonState
        setButtonInputStateWaterTank(false);
        // viewIconState
        setVisibilityIconStateWaterTank(false);
      }
    });
  };

  // ================================> useEffect ==>

  useEffect(() => {
    getRoadWidth();
  }, []);

  useEffect(() => {
    console.log("Tank", tank);
  }, [tank]);

  // ptax
  useEffect(() => {
    // ======================> Property

    console.log("propertyDTLDao2329", watch("formDTLDao.propertyDTLDao"));

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagYPtax = watch("formDTLDao.propertyDTLDao")?.filter((data, index) => {
      if (data?.activeFlag == "Y") {
        return data;
      }
    });

    // mapRecordActiveFlagY
    const tempTableDataPtax = tempTableDataWithFlagYPtax?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });

    console.log("tempTableDataPtax", tempTableDataPtax);

    // SetTableData
    setPropertyDetailsTableData(tempTableDataPtax);
  }, [watch("formDTLDao.propertyDTLDao")]);

  // Ptax Table
  useEffect(() => {
    console.log("propertyDetailsTableData", propertyDetailsTableData);
  }, [propertyDetailsTableData]);

  // waterTank
  useEffect(() => {
    console.log("underGroundWaterTankDao121", watch("formDTLDao.underGroundWaterTankDao"));

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagYWaterTank = watch("formDTLDao.underGroundWaterTankDao")?.filter(
      (data, index) => {
        if (data?.activeFlag == "Y") {
          return data;
        }
      },
    );

    // mapRecordActiveFlagY
    const tempTableDataWaterTank = tempTableDataWithFlagYWaterTank?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });

    console.log("tempTableDataWaterTank", tempTableDataWaterTank);

    // SetTableData
    setWaterTankDetailsTableData(tempTableDataWaterTank);
  }, [watch("formDTLDao.underGroundWaterTankDao")]);

  // waterTank Table
  useEffect(() => {
    console.log("waterTankDetailsTableData", waterTankDetailsTableData);
  }, [waterTankDetailsTableData]);

  // View
  return (
    <>
      {/** FormDetailsFirstPart */}
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="firmName" />}
            variant="standard"
            {...register("formDTLDao.formName")}
            error={!!errors.formName}
            helperText={errors?.formName ? errors.formName.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Final plot no"
            variant="standard"
            {...register("formDTLDao.finalPlotNo")}
            error={!!errors.finalPlotNo}
            helperText={errors?.finalPlotNo ? errors.finalPlotNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Plot Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.plotAreaSquareMeter")}
            error={!!errors.plotAreaSquareMeter}
            helperText={errors?.plotAreaSquareMeter ? errors.plotAreaSquareMeter.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Construction Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.constructionAreSqMeter")}
            error={!!errors.constructionAreSqMeter}
            helperText={errors?.constructionAreSqMeter ? errors.constructionAreSqMeter.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="No. of Approched Road"
            variant="standard"
            {...register("formDTLDao.noOfApprochedRoad")}
            error={!!errors.noOfApprochedRoad}
            helperText={errors?.noOfApprochedRoad ? errors.noOfApprochedRoad.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="highTensionLine" />}
            variant="standard"
            {...register("formDTLDao.highTensionLine")}
            error={!!errors.highTensionLine}
            helperText={errors?.highTensionLine ? errors.highTensionLine.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "80%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="previouslyAnyFireNocTaken" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  name="previouslyAnyFireNocTaken"
                  fullWidth
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>No</MenuItem>
                  <MenuItem value={3}>Revised</MenuItem>
                </Select>
              )}
              name="formDTLDao.previouslyAnyFireNocTaken"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="underTheGroundWaterTankCapacityLighter" />}
            variant="standard"
            {...register("formDTLDao.underTheGroundWaterTankCapacityLitre")}
            error={!!errors.underTheGroundWaterTankCapacityLitre}
            helperText={
              errors?.underTheGroundWaterTankCapacityLitre
                ? errors.underTheGroundWaterTankCapacityLitre.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl variant="standard" sx={{ width: "80%" }} error={!!errors.businessType}>
            <InputLabel id="demo-simple-select-standard-label">Access road Width</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                  error={!!errors.typeOfBuilding}
                  helperText={errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}
                >
                  {roadWidth &&
                    roadWidth.map((type, index) => (
                      <MenuItem key={index} value={type.id}>
                        {type.accessWidth}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="formDTLDao.accessRoadWidth"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="revenueSurveyNo" />}
            variant="standard"
            {...register("formDTLDao.revenueSurveyNo")}
            error={!!errors.revenueSurveyNo}
            helperText={errors?.revenueSurveyNo ? errors.revenueSurveyNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="blockNo" />}
            variant="standard"
            {...register("formDTLDao.blockNo")}
            error={!!errors.blockNo}
            helperText={errors?.blockNo ? errors.blockNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="opNo" />}
            label="dp op no"
            variant="standard"
            {...register("formDTLDao.dpOpNo")}
            error={!!errors.dpOpNo}
            helperText={errors?.dpOpNo ? errors.dpOpNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Site Address"
            variant="standard"
            {...register("formDTLDao.siteAddress")}
            error={!!errors.siteAddress}
            helperText={errors?.siteAddress ? errors.siteAddress.message : null}
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>

      {/** Property Details */}
      <Grid item xs={12} sx={{ margin: "6%" }}>
        <div>
          <Box
            style={{
              display: "flex",
            }}
          >
            <Box className={styles.tableHead}>
              <Box className={styles.h1Tag}>Property Details</Box>
            </Box>
            {!view && (
              <Box>
                <Button
                  variant="contained"
                  type="primary"
                  disabled={buttonInputStatePtax}
                  onClick={() => {
                    // editButtonState
                    setEditButtonInputStatePtax(true);
                    // deleteButtonState
                    setDeleteButtonStatePtax(true);
                    // addButtonState
                    setButtonInputStatePtax(true);
                    // visibilityIcon
                    setVisibilityIconStatePtax(true);

                    // save/updateButtonText
                    setBtnSaveTextPtax("Save");
                    // conditionalRendering
                    setSlideCheckedPtax(true);
                    // collpaseOpen/Close
                    setIsOpenCollapsePtax(true);
                  }}
                  className={styles.adbtn}
                  sx={{
                    borderRadius: 100,

                    padding: 2,
                    marginLeft: 1,
                    textAlign: "center",
                    border: "2px solid #3498DB",
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
            )}
          </Box>

          {/** Property Details */}
          {isOpenCollapsePtax && (
            <Slide direction="down" in={slideCheckedPtax} mountOnEnter unmountOnExit>
              <div>
                <Box
                  style={{
                    margin: "3vh 0vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Paper
                    sx={{
                      // margin: 1,
                      padding: 2,
                      // backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveTextPtax == "Update" ? "Update Property Details" : "Property Details"}
                      </Box>
                    </Box>
                    <br />
                    <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={disabledInputStatePtax}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Property No."
                          variant="standard"
                          {...register("propertyNo")}
                          error={!!errors.volumeLBHIn}
                          helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                    <br />
                    <br />

                    <div></div>

                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        {!viewButtonInputStatePtax && (
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                            onClick={() => {
                              savePropertyDetails();
                              setIsOpenCollapsePtax();
                            }}
                          >
                            {btnSaveTextPtax == "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        )}
                      </Grid>

                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitFunctionPtax()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </div>
            </Slide>
          )}

          {/** PropertyDetailsTable */}
          <Box>
            <DataGrid
              getRowId={(row) => row.srNo}
              disableColumnFilter
              disableColumnSelector
              disableExport
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              components={{ Toolbar: GridToolbar }}
              autoHeight
              density="compact"
              sx={{
                backgroundColor: "white",
                paddingLeft: "2%",
                paddingRight: "2%",
                boxShadow: 2,
                border: 1,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {},
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#E1FDFF",
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#87E9F7",
                },
              }}
              rows={
                propertyDetailsTableData == null || propertyDetailsTableData == undefined
                  ? []
                  : propertyDetailsTableData
              }
              columns={propertyDetailsTableColumn}
              pageSize={7}
              rowsPerPageOptions={[7]}
            />
          </Box>
        </div>
      </Grid>

      {/** WaterTankDetails */}
      <Grid item xs={4} sx={{ margin: "6%" }}>
        <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
          <FormLabel component="legend">Is Plan have Common Underground Water Tank</FormLabel>
          <Controller
            name="formDTLDao.isPlanhaveUnderGroundWaterTank"
            control={control}
            render={({ field }) => (
              <RadioGroup
                // disabled={watch("disabledFieldInputState")}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                selected={field.value}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  // error={!!errors?.oldLicenseYN}
                  // disabled={watch("disabledFieldInputState")}
                  value="Y"
                  control={<Radio size="small" />}
                  label="Yes"
                />
                <FormControlLabel
                  // error={!!errors?.oldLicenseYN}
                  // disabled={watch("disabledFieldInputState")}
                  value="No"
                  control={<Radio size="small" />}
                  label="N"
                />
              </RadioGroup>
            )}
          />
          <FormHelperText error={!!errors?.oldLicenseYN}>
            {errors?.oldLicenseYN ? errors?.oldLicenseYN?.message : null}
          </FormHelperText>
        </FormControl>

        {watch("formDTLDao.isPlanhaveUnderGroundWaterTank") == "Y" && (
          <div>
            <Box style={{ display: "flex", marginTop: "5%" }}>
              <Box className={styles.tableHead}>
                <Box className={styles.h1Tag}>Tank Details</Box>
              </Box>
              {!view && (
                <Box>
                  <Button
                    variant="contained"
                    type="primary"
                    disabled={buttonInputStateWaterTank}
                    onClick={() => {
                      // editButtonState
                      setEditButtonInputStateWaterTank(true);
                      // deleteButtonState
                      setDeleteButtonStateWaterTank(true);
                      // addButtonState
                      setButtonInputStateWaterTank(true);
                      // visibilityIcon
                      setVisibilityIconStateWaterTank(true);
                      // save/updateButtonText
                      setBtnSaveTextWaterTank("Save");
                      // conditionalRendering
                      setSlideCheckedWaterTank(true);
                      // collpaseOpen/Close
                      setIsOpenCollapseWaterTank(true);
                    }}
                    className={styles.adbtn}
                    sx={{
                      borderRadius: 100,

                      padding: 2,
                      marginLeft: 1,
                      textAlign: "center",
                      border: "2px solid #3498DB",
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
              )}
            </Box>
            {isOpenCollapseWaterTank && (
              <Slide direction="down" in={slideCheckedWaterTank} mountOnEnter unmountOnExit>
                <div>
                  <Box
                    style={{
                      margin: "3vh 0vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Paper
                      sx={{
                        // margin: 1,
                        padding: 2,
                        // backgroundColor: "#F5F5F5",
                      }}
                      elevation={5}
                    >
                      <Box className={styles.tableHead}>
                        <Box className={styles.feildHead}>
                          {btnSaveTextWaterTank == "Update" ? "Update Floor Details" : " Tank Details"}
                        </Box>
                      </Box>
                      <br />
                      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={disabledInputStateWaterTank}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="L"
                            variant="standard"
                            {...register("length")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>

                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={disabledInputStateWaterTank}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="B"
                            variant="standard"
                            {...register("breadth")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={disabledInputStateWaterTank}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="height"
                            variant="standard"
                            {...register("height")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={disabledInputStateWaterTank}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="Capacity"
                            variant="standard"
                            {...register("capacity")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}></Grid>
                        <Grid item xs={4} className={styles.feildres}></Grid>
                      </Grid>
                      <br />
                      <br />
                      <div></div>
                      <Grid container className={styles.feildres} spacing={2}>
                        {!viewButtonInputStateWaterTank && (
                          <Grid item>
                            <Button
                              size="small"
                              variant="outlined"
                              className={styles.button}
                              endIcon={<SaveIcon />}
                              onClick={() => {
                                saveTankDetails();
                              }}
                            >
                              {btnSaveTextWaterTank == "Update" ? (
                                <FormattedLabel id="update" />
                              ) : (
                                <FormattedLabel id="save" />
                              )}
                            </Button>
                          </Grid>
                        )}

                        <Grid item>
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitFunctionWaterTax()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </div>
              </Slide>
            )}
            {/** TankDetailsTable */}
            <Box>
              <DataGrid
                getRowId={(row) => row.srNo}
                disableColumnFilter
                disableColumnSelector
                disableExport
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true },
                  },
                }}
                components={{ Toolbar: GridToolbar }}
                autoHeight
                density="compact"
                sx={{
                  backgroundColor: "white",
                  paddingLeft: "2%",
                  paddingRight: "2%",
                  boxShadow: 2,
                  border: 1,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {},
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#E1FDFF",
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#87E9F7",
                  },
                }}
                rows={
                  waterTankDetailsTableData == null || waterTankDetailsTableData == undefined
                    ? []
                    : waterTankDetailsTableData
                }
                columns={tankDetailsTableColumn}
                pageSize={7}
                rowsPerPageOptions={[7]}
              />
            </Box>
          </div>
        )}
      </Grid>

      <br />
      <br />
      <br />
    </>
  );
};

export default FormsDetails;

import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import { useSelector } from "react-redux";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [hawkingZones, setHawkingZones] = useState([]);
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [religions, setReligions] = useState([]);
  const [casts, setCasts] = useState([]);
  const [subCasts, setSubCasts] = useState([]);
  const [typeOfDisabilitys, setTypeOfDisabilitys] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [villages, setVillages] = useState([]);
  const [pincodes, setPinCode] = useState([]);
  const [wardNos, setWardNo] = useState([]);
  const [hawkingDurationDailys, setHawkingDurationDailys] = useState([]);
  const [hawkerTypes, setHawkerTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [bankNames, setBankNames] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [hawkerData, setHawkerData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // hawkingZone
  const getHawkingZone = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getAll`).then((r) => {
      console.log("r?data?hawkingzone", r?.data?.hawkingZone);
      setHawkingZones(
        r?.data?.hawkingZone?.map((row) => ({
          id: row.id,
          hawkingZoneName: row?.hawkingZoneName,
          hawkingZoneNameMr: row?.hawkingZoneNameMr,
        })),
      );
    });
  };

  // wardNo
  const getWardNo = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      console.log("wardNumber", r?.data?.ward);
      setWardNo(
        r?.data?.ward?.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        })),
      );
    });
  };

  // hawkerMaster
  const getHawkerMaster = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.HMSURL}/hawkerMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.hawker;
          console.log(" ", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              hawkerPrefix: r?.hawkerPrefix,
              toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
              hawkerName: r?.firstName + "  " + r?.middleName + "  " + r?.lastName,
              emailAddress: r?.emailAddress,
              mobile: r?.mobile,
              citySurveyNo: r?.citySurveyNo,
              // hawkingZones
              hawkingZoneName: hawkingZones?.find((obj) => obj.id == r?.hawkingZoneName)?.hawkingZoneName,
              hawkingZoneNameMr: hawkingZones?.find((obj) => obj.id == r?.hawkingZoneName)?.hawkingZoneNameMr,
              // hawkingDurationDaily
              hawkingDurationDaily: hawkingDurationDailys?.find((obj) => obj?.id === r.hawkingDurationDaily)
                ?.hawkingDurationDaily,
              // Item
              item: items?.find((obj) => obj?.id == r.item)?.item,
              itemMr: items?.find((obj) => obj?.id == r.item)?.itemMr,
              // hawkerType
              hawkerTypeName: hawkerTypes?.find((obj) => obj?.id === r.hawkerType)?.hawkerType,

              // wardName
              wardName: wardNos?.find((obj) => obj?.id === r?.wardNo)?.wardName,
              wardNameMr: wardNos?.find((obj) => obj?.id === r?.wardNo)?.wardNameMr,

              emailAddress: r.emailAddress,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          console.log("_res_res", _res);
          setHawkerData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        } else {
          toast.error("Filed Load Data !! Please Try Again !", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Filed Load Data hdsf!! Please Try Again !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // title
  const getTitle = () => {
    axios.get(`${urls.HMSURL}/MstTitle/getAll`).then((r) => {
      setTitles(
        r.data.map((row) => ({
          id: row.id,
          title: row.title,
        })),
      );
    });
  };

  // gender
  const getGender = () => {
    axios.get(`${urls.CFCURL}/gender/getAll`).then((r) => {
      setGenders(
        r.data.map((row) => ({
          id: row.id,
          gender: row.gender,
        })),
      );
    });
  };

  // religion
  const getReligion = () => {
    axios.get(`${urls.HMSURL}/religionMaster/getAll`).then((r) => {
      setReligions(
        r.data.map((row) => ({
          id: row.id,
          religion: row.religion,
        })),
      );
    });
  };

  // caste
  const getCast = () => {
    axios.get(`${urls.CFCURL}/cast/getAll`).then((r) => {
      setCasts(
        r.data.map((row) => ({
          id: row.id,
          castt: row.castt,
        })),
      );
    });
  };

  // subCaste
  const getSubCast = () => {
    axios.get(`${urls.CFCURL}/subCast/getAll`).then((r) => {
      setSubCasts(
        r.data.map((row) => ({
          id: row.id,
          subCast: row.subCast,
        })),
      );
    });
  };

  // typeOfDisablity
  const getTypeOfDisability = () => {
    axios.get(`${urls.CFCURL}/typeOfDisability/getAll`).then((r) => {
      setTypeOfDisabilitys(
        r.data.map((row) => ({
          id: row.id,
          typeOfDisability: row.typeOfDisability,
        })),
      );
    });
  };

  // area
  const getAreaName = () => {
    axios.get(`${urls.CFCURL}/area/getAll`).then((r) => {
      setAreaNames(
        r.data.map((row) => ({
          id: row.id,
          areaName: row.areaName,
        })),
      );
    });
  };

  // landmark
  const getLandmarkName = () => {
    axios.get(`${urls.CFCURL}/landmarkMaster/getAll`).then((r) => {
      setLandmarkNames(
        r.data.map((row) => ({
          id: row.id,
          landmarkName: row.landmarkName,
        })),
      );
    });
  };

  // village
  const getVillageName = () => {
    axios.get(`${urls.CFCURL}/village/getAll`).then((r) => {
      setVillages(
        r.data.map((row) => ({
          id: row.id,
          villageNameEng: row.villageNameEng,
        })),
      );
    });
  };

  // pinCode
  const getPinCode = () => {
    axios.get(`${urls.CFCURL}/pinCode/getAll`).then((r) => {
      setPinCode(
        r.data.map((row) => ({
          id: row.id,
          pincode: row.pincode,
        })),
      );
    });
  };

  // bankName
  const getBankName = () => {
    axios.get(`${urls.CFCURL}/bank/getAll`).then((r) => {
      setBankNames(
        r.data.map((row) => ({
          id: row.id,
          bankName: row.bankName,
        })),
      );
    });
  };

  // hawkingDurationDaily
  const getHawkingDurationDaily = () => {
    axios.get(`${urls.HMSURL}/hawkingDurationDaily/getAll`).then((r) => {
      console.log("hawkingDurationDaily", r?.data?.hawkingDurationDaily);
      setHawkingDurationDailys(
        r?.data?.hawkingDurationDaily?.map((row) => ({
          id: row.id,
          hawkingDurationDaily:
            moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format("hh:mm A") +
            " To " +
            moment(row.hawkingDurationDailyTo, "HH:mm:ss").format("hh:mm A"),
        })),
      );
    });
  };

  // hawkerType
  const getHawkerType = () => {
    axios.get(`${urls.HMSURL}/hawkerType/getAll`).then((r) => {
      console.log("hawkerType", r?.data?.hawkerType);
      setHawkerTypes(
        r?.data?.hawkerType?.map((row) => ({
          id: row.id,
          hawkerType: row.hawkerType,
        })),
      );
    });
  };

  // item
  const getItem = () => {
    axios.get(`${urls.HMSURL}/item/getAll`).then((r) => {
      console.log("items2322", r?.data?.item);
      setItems(
        r?.data?.item?.map((row) => ({
          id: row?.id,
          item: row?.item,
          itemMr: row?.itemMr,
        })),
      );
    });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkerMaster/save`, body).then((res) => {
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getHawkerMaster();
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
        if (willDelete === true) {
          axios.post(`${urls.HMSURL}/hawkerMaster/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200 || res.status == 226 || res?.status == 201) {
              swal("Record is Successfully Activated!", {
                icon: "success",
              });
              getHawkerMaster();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "hawkerPrefix",
      headerName: <FormattedLabel id="hawkerPrefix" />,
      description: <FormattedLabel id="hawkerPrefix" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "hawkerName",
      headerName: <FormattedLabel id="hawkerName" />,
      description: <FormattedLabel id="hawkerName" />,
      align: "left",
      headerAlign: "center",
      width: 400,
    },

    {
      field: "mobile",
      headerName: <FormattedLabel id="mobile" />,
      description: <FormattedLabel id="mobile" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "emailAddress",
      headerName: <FormattedLabel id="emailAddress" />,
      description: <FormattedLabel id="emailAddress" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "citySurveyNo",
      width: 200,
      headerName: <FormattedLabel id="citySurveyNo" />,
      description: <FormattedLabel id="citySurveyNo" />,
      align: "left",
      headerAlign: "center",
    },

    {
      field: language == "en" ? "hawkingZoneName" : "hawkingZoneNameMr",
      headerName: <FormattedLabel id="hawkingZone" />,
      description: <FormattedLabel id="hawkingZone" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    {
      field: "hawkingDurationDaily",
      headerName: <FormattedLabel id="hawkingDurationDaily" />,
      description: <FormattedLabel id="hawkingDurationDaily" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },

    // {
    //   field: "hawkerType",
    //   headerName: <FormattedLabel id="hawkerType" />,
    //   description: <FormattedLabel id="hawkerType" />,
    //   align: "left",
    //   width: 200,
    // },
    {
      field: language == "en" ? "item" : "itemMr",
      headerName: <FormattedLabel id="item" />,
      description: <FormattedLabel id="item" />,
      align: "left",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                localStorage.setItem("hawkerMasterId", params?.row?.id);
                localStorage.setItem("disabledFieldInputState", true);
                router.push(`/streetVendorManagementSystem/masters/hawkerMaster/HawkerMaster`);
              }}
            >
              <VisibilityIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                localStorage.setItem("hawkerMasterId", params?.row?.id);
                localStorage.setItem("disabledFieldInputState", false);
                router.push(`/streetVendorManagementSystem/masters/hawkerMaster/HawkerMaster`);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
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

  useEffect(() => {
    console.log("language", language);
    getHawkingZone();
    getWardNo();
    getHawkingDurationDaily();
    getHawkerType();
    getItem();
    //   getTitle();
    //   getGender();
    //   getReligion();
    //   getCast();
    //   getSubCast();
    //   getTypeOfDisability();
    //   getAreaName();
    //   getLandmarkName();
    //   getVillageName();
    //   getPinCode();
    //   getBankName();
  }, []);

  // useEffect(() => {
  //   getHawkerMaster();
  //   console.log("useEffect");
  // }, [
  //   hawkingZones,
  //   titles,
  //   genders,
  //   religions,
  //   casts,
  //   subCasts,
  //   typeOfDisabilitys,
  //   areaNames,
  //   landmarkNames,
  //   villages,
  //   pincodes,
  //   wardNos,
  //   hawkingDurationDailys,
  //   hawkerTypes,
  //   items,
  //   bankNames,
  // ]);

  useEffect(() => {
    localStorage.removeItem("pageMode");
    localStorage.removeItem("hawkerMasterId");
    getHawkerMaster();
  }, [hawkingZones, wardNos, hawkerTypes, items]);

  // View
  return (
    <>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div
          style={{
            backgroundColor: "#0084ff",
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
          <strong>{<FormattedLabel id="hawkerMaster" />}</strong>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "2vh",
            marginRight: "40px",
          }}
        >
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            onClick={() => {
              localStorage.setItem("disabledFieldInputState", false);
              router.push(`/streetVendorManagementSystem/masters/hawkerMaster/HawkerMaster`);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>
        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
                // disableExport: true,
                // disableToolbarButton: true,
                csvOptions: { disableToolbarButton: true },
              },
            }}
            components={{ Toolbar: GridToolbar }}
            sx={{
              m: 5,
              overflowY: "scroll",
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            columns={columns}
            density="compact"
            autoHeight={true}
            pagination
            paginationMode="server"
            page={hawkerData?.page}
            rowCount={hawkerData?.totalRows}
            rowsPerPageOptions={hawkerData?.rowsPerPageOptions}
            pageSize={hawkerData?.pageSize}
            rows={hawkerData?.rows}
            onPageChange={(_data) => {
              getHawkerMaster(hawkerData?.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getHawkerMaster(_data, hawkerData?.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;

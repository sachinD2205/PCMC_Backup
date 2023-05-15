import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Box,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GridToolbar } from "@mui/x-data-grid";
import transferMediumMasterSchema from "../../../../containers/schema/rtiOnlineSystemSchema/transferMediumMasterSchema";
// import billingCycleSchema from "../../../../containers/schema/slumManagementSchema/billingCycleSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
// import styles from "../../../styles/[zone].module.css";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(transferMediumMasterSchema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const language = useSelector((state) => state.labels.language);
  const [dataPageNo, setDataPage] = useState();

  useEffect(() => {
    getTransferMedium();
  }, []);

  const getTransferMedium = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.RTI}/mstTransferMedium/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res, i) => {
        let result = res.data.mstTransferMediumList;
        console.log("result", result);
        const _res = result.map((res, i) => {
          return {
            srNo: (i + 1) + (_pageNo * _pageSize),
            id: res.id,
            mediumPrefix: res.mediumPrefix,
            nameOfMedium: res.nameOfMedium,
            nameOfMediumMr: res.nameOfMediumMr,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        });
        setDataSource([..._res]);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language=="en"?"Deactivate?":"निष्क्रिय करा",
        text: language=="en"?"Are you sure you want to deactivate this Record ? ":"तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.RTI}/mstTransferMedium/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal(language=="en"?"Record is Successfully Deactivated!":"रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!", {
                icon: "success",
              });
              getTransferMedium();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal(language=="en"?"Record is Safe":"रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language=="en"?"Activate?":"सक्रिय करा",
        text: language=="en"?"Are you sure you want to activate this Record ? ":"तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.RTI}/mstTransferMedium/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal(language=="en"?"Record is Successfully activated!":"रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!", {
                icon: "success",
              });
              getTransferMedium();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal(language=="en"?"Record is Safe":"रेकॉर्ड सुरक्षित आहे");
        }
      });
    }
  };

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

  const onSubmitForm = (formData) => {
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };
    axios.post(`${urls.RTI}/mstTransferMedium/save`, finalBodyForApi).then((res) => {
      console.log("save data", res);
      if (res.status == 201) {
        formData.id
          ? sweetAlert(language=="en"?"Updated!":"अपडेट केले", language=="en"?"Record Updated successfully !":"रेकॉर्ड यशस्वीरित्या अद्यतनित केले !", "success")
          : sweetAlert(language=="en"?"Saved!":"जतन केले", language=="en"?"Record Saved successfully !":"रेकॉर्ड यशस्वीरित्या जतन केले !", "success");
        getTransferMedium();

        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
  };

  const resetValuesExit = {
    mediumPrefix: "",
    nameOfMedium: "",
    nameOfMediumMr: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesExit,
      id,
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "mediumPrefix",
      headerName: <FormattedLabel id="mediumPrefix" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
    },

    {
      // field: "nameOfMedium",
      field: language === "en" ? "nameOfMedium" : "nameOfMediumMr",
      headerName: <FormattedLabel id="nameOfMedium" />,
      // type: "number",
      flex: 1,
      minWidth: 150,
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
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
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
            background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="infoTransferMediumMaster" />
          </h2>
        </Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container>
                <Grid item xs={14} sm={4} md={5} lg={5} xl={5}></Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white", width: 250, paddingTop: 10 }}
                    id="outlined-basic"
                    maxLength="100"
                    label={<FormattedLabel id="mediumPrefix" />}
                    variant="standard"
                    {...register("mediumPrefix")}
                    error={!!errors.mediumPrefix}
                    helperText={errors?.mediumPrefix ? errors.mediumPrefix.message : null}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={3} lg={3} xl={3}></Grid>

                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white", width: 250, paddingTop: 10 }}
                    id="outlined-basic"
                    // label="CFC Name Mr"
                    label={<FormattedLabel id="nameOfMedium" />}
                    variant="standard"
                    maxLength="300"
                    {...register("nameOfMedium")}
                    error={!!errors.nameOfMedium}
                    helperText={errors?.nameOfMedium ? errors.nameOfMedium.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white", width: 250, paddingTop: 10 }}
                    id="outlined-basic"
                    maxLength={"3"}
                    label={<FormattedLabel id="nameOfMediumMr" />}
                    variant="standard"
                    {...register("nameOfMediumMr")}
                    error={!!errors.nameOfMediumMr}
                    helperText={errors?.nameOfMediumMr ? errors.nameOfMediumMr.message : null}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={5}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "10px",
                  marginTop: "20px",
                }}
              >
                <Grid item>
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText === "Update" ? <FormattedLabel id="update" /> : <FormattedLabel id="save" />}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
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
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
          sx={{
            verflowY: "scroll",
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
          pagination
          paginationMode="server"
          rowCount={totalElements}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pageSize={pageSize}
          rows={dataSource}
          page={pageNo}
          columns={columns}
          onPageChange={(_data) => {
            setDataPage(_data)
            getTransferMedium(pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data)
            getTransferMedium( _data,pageNo);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;

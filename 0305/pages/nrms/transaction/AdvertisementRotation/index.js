import { EyeFilled } from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ForwardIcon from "@mui/icons-material/Forward";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import { Box, Button, Divider, Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import { setApprovalOfNews } from "../../../../features/userSlice";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();

  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [caseEntry, setCaseEntry] = useState([]);
  const [allTabelData, setAllTabelData] = useState([]);
  const [ward, setWard] = useState([]);
  const [rotationGroup, setRotationGroup] = useState([]);
  const [rotationSubGroup, setRotationSubGroup] = useState([]);
  const [departments, setDepartment] = useState([]);
  const [parameterName, setParameterName] = useState([]);
  const [newsPaper, setNewsPaper] = useState([]);
  const [number, setNumber] = useState("");
  const [aOneForm, setAOneForm] = useState();
  const [newsRequest, setNewsRequest] = useState("");
  const [zone, setZone] = useState("");
  const [image, setImage] = useState();
  const [valueData, setValueData] = useState({});

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);
  const { inputData, setInputData } = useState();

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  const dispatch = useDispatch();

  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];

  // For Paginantion
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

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  const getSelectedObject = (id) => {
    axios.get(`${urls.NRMS}/trnNewsPublishRequest/getById?id=${id}`).then((r) => {
      // console.log(
      //   ":aa",
      //   id,
      //   r.data.trnNewsPublishRequestList.find((row) => id == row.id),
      // );
      // setValueData(r.data.trnNewsPublishRequestList.find((row) => id == row.id));
      setValueData(r.data);
    });

    console.log("val", valueData);
  };

  // get Module Name

  // get Ward Name
  const getWard = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((res) => {
      setWard(res.data.ward);
      console.log("res.data", res.data);
    });
  };

  // get Department Name
  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((res) => {
      setDepartment(res.data.department);
      // console.log("res.data", r.data);
    });
  };
  const getRotationGroup = () => {
    console.log("sdafvdaa");
    axios.get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`).then((r) => {
      console.log("reefsff", r);
      setRotationGroup(
        r?.data?.newspaperRotationGroupMasterList?.map((r, i) => ({
          id: r.id,
          rotationGroupName: r.rotationGroupName,
          rotationGroupkey: r.rotationGroupkey,
          // groupId: r.groupId,
        })),
      );
      console.log("res.data", r.data);
    });
  };

  // New Changes

  const getRotationSubGroup = () => {
    axios.get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`).then((r) => {
      console.log("iddddd", id);
      setRotationSubGroup(
        r?.data?.newspaperRotationSubGroupMasterList?.map((r, i) => ({
          id: r.id,
          rotationSubGroupName: r.rotationSubGroupName,
          rotationSubGroupkey: r.rotationSubGroupkey,
        })),
      );
    });
  };
  console.log("dfb", rotationGroup.subGroupName);

  const getZone = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(res.data.zone);
      console.log("getZone.data", res.data);
    });
  };

  const getNewsPaper = () => {
    axios.get(`${urls.NRMS}/newspaperMaster/getAll`).then((r) => {
      setNewsPaper(
        r?.data?.newspaperMasterList?.map((r, i) => ({
          id: r.id,
          newspaperLevel: r.newspaperLevel,
        })),
      );
    });
  };
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  useEffect(() => {
    getWard();
    getDepartment();
    getRotationGroup();
    getRotationSubGroup();
    getNewsPaper();
    getZone();
  }, []);
  useEffect(() => {
    getAllTableData();
  }, [ward, departments]);
  // Get Table - Data
  const getAllTableData = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.NRMS}/trnNewsPublishRequest/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 435,
        },
      })
      .then((r) => {
        console.log(";rressss", r);
        let result = r.data.trnNewsPublishRequestList;
        console.log("trnNewsPublishRequestList", result);

        let _ress = result?.map((r, i) => {
          return {
            ...r,
            srNo: i + 1 + _pageNo * _pageSize,
            newsPublishRequestNo: r.newsPublishRequestNo,
            department: departments?.find((obj) => obj?.id === r.department)?.department,
            //
            //
            // status:
            //   r?.status === null
            //     ? "Pending"
            //     : r?.status === 0
            //     ? "Save As Draft"
            //     : r?.status === 1
            //     ? "Approved By HOD"
            //     : r?.status === 2
            //     ? "Reject By Concern Department HOD"
            //     : r?.status === 3
            //     ? "Releasing Order Generated"
            //     : r?.status === 4
            //     ? "Reject By  Department Clerk"
            //     : r?.status === 5
            //     ? "Approved By NR HOD"
            //     : r?.status === 6
            //     ? "Rejected By Department HOD"
            //     : r?.status === 7
            //     ? "Approved By Assistant Commissioner"
            //     : r?.status === 8
            //     ? "Completed"
            //     : r?.status === 9
            //     ? "Closed"
            //     : r?.status === 10
            //     ? "Duplicate"
            //     : "Invalid",
          };
        });

        console.log("aala", _ress);
        setData({
          rows: _ress,
          // newsPublishRequestNo: r.data.newsPublishRequestNo,
          // department: departments?.find((obj) => obj?.id === r.department)?.department,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  useEffect(() => {
    getAllTableData();
  }, [fetchData]);
  const onSubmitForm = (formData) => {
    let temp = [];
    const fileObj = {};

    temp = [{ ...fileObj, newsAttachement: newsRequest }];
    // temp.push(aOneForm,proofOfOwnership,identyProof,castCertificate,statuatoryAndRegulatoryPermission,industrialRegistration,loadProfileSheet)
    console.log("temp", temp);
    console.log("form data --->", formData);
    console.log("fromData", formData);
    let _formData = { ...formData };
    dispatch(setApprovalOfNews(_formData));
    // Save - DB
    let _body = {
      ...formData,
      newsAttachement: temp[0].newsAttachement,
      activeFlag: formData.activeFlag,
    };
    if (btnSaveText === "Save") {
      console.log("_body", _body);
      const tempData = axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, _body).then((res) => {
        console.log("res---", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("_body", valueData, _body);
      let payload = {
        ...formData,
        status: valueData?.status,
      };
      console.log("payload", payload);

      const tempData = axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, payload).then((res) => {
        console.log(":res", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllTableData();
          // setButtonInputState(false);
          setEditButtonInputState(true);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
    }
  };
  // console.log("data.status === 6",data.status ==5)

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
          axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getAllTableData();
              setButtonInputState(false);
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.NRMS}/trnNewsPublishRequest/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 201) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              // getPaymentRate();
              getAllTableData();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
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

  const resetValuesCancell = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    newsAttachement: "",
  };

  const resetValuesExit = {
    wardName: "",
    departmentName: "",
    priority: "",
    newsAdvertisementSubject: "",
    newsAdvertisementDescription: "",
    rotationGroupName: "",
    rotationSubGroupName: "",
    newsPaperLevel: "",
    typeOfNews: "",
    workName: "",
    id: null,
    newsAttachement: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      align: "left",
      headerAlign: "left",
      width: 50,
    },
    {
      field: "newsPublishRequestNo",
      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "department",
      headerName: "Department Name",
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 50,
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "left",
      headerAlign: "left",
      // minWidth: 100,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {authority &&
              authority.includes("ENTRY") &&
              params.row.status == "Approved By Assistant Commissioner" ? (
              <>
                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const record = params.row.id;
                    router.push({
                      pathname: "/nrms/transaction/AdvertisementRotation/create",
                      query: {
                        pageMode: "View",
                        id: params.row.id,
                      },
                    });
                    console.log("rowsdfsg", params.row?.id);
                  }}
                >
                  <PublishRoundedIcon style={{ color: "#556CD6" }} />1
                </IconButton>

                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const record = params.row.id;
                    router.push({
                      pathname: "/nrms/report/PaperCuttingBook/newsCut",
                      query: {
                        pageMode: "View",
                        id: params.row?.id,
                      },
                    });
                    console.log("rowsdfsg", params.row?.id);
                  }}
                >
                  <ForwardIcon style={{ color: "#556CD6" }} />2
                </IconButton>
                {/* News Publish */}
              </>
            ) : (
              <>
                {" "}
                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const record = params?.row?.id;

                    router.push({
                      pathname: "/nrms/transaction/AdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: record,
                      },
                    });
                    console.log(":row", params?.row);
                    ("");
                  }}
                >
                  <Button variant="contained" endIcon={<EyeFilled />}>
                    Action
                  </Button>
                </IconButton>

                {authority && authority.includes("ENTRY") && params.row.status == 'DRAFTED' ? (
                  <>
                    <IconButton
                      disabled={editButtonInputState}
                      onClick={() => {
                        setBtnSaveText("Update"), setID(params.row.id), getSelectedObject(params.row.id);
                        const record = params.row.id;
                        router.push({
                          pathname: "/nrms/transaction/AdvertisementRotation/create",
                          query: {
                            pageMode: "Edit",
                            id: record,
                          },
                        });
                        console.log("params.row: ", record);
                        reset(params.row);
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {authority && authority.includes("ENTRY") && params.row.status == "Releasing Order Generated" ? (
              <>
                {/* Edit */}

                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const record = params.row;
                    router.push({
                      pathname: "/nrms/transaction/releasingOrder/news/",
                      query: {
                        pageMode: "View",
                        id: params?.row?.id,
                      },
                    });
                    console.log("row", params.row);
                    ("");
                  }}
                >
                  <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                </IconButton>

                {/* News Publish */}

                {/* <IconButton>
                      <Button
                        variant="contained"
                        onClick={() => {
                          const record = params.row;
                          router.push({
                            pathname: "/nrms/transaction/releasingOrder/news",
                            query: {
                              pageMode: "View",
                              ...record,
                            },
                          });

                        }}
                      >
                        News Publish

                      </Button>
                    </IconButton> */}
              </>
            ) : (
              <></>
            )}
            {authority &&
              authority.includes("APPROVAL") &&
              params.row.status == "Releasing Order Generated" ? (
              <>
                {/* Edit */}

                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const record = params.row;

                    router.push({
                      pathname: "/nrms/transaction/releasingOrder/news/",
                      query: {
                        pageMode: "View",
                        id: params?.row?.id,
                      },
                    });
                    console.log("row", params.row);
                    ("");
                  }}
                >
                  <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </>
            ) : (
              <> </>
            )}

            {authority && authority.includes("COMMISHIONER") && params.row.status == "Approved By NR HOD" ? (
              <>
                {/* Edit */}

                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const record = params.row;

                    router.push({
                      pathname: "/nrms/transaction/releasingOrder/news/",
                      query: {
                        pageMode: "View",
                        id: params?.row?.id,
                      },
                    });
                    console.log("row", params.row);
                    ("");
                  }}
                >
                  <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </>
            ) : (
              <> </>
            )}

            {/* sdfvgdbhfngmjh,kjl.k */}
          </Box>
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
          // marginTop: "10px",
          // marginBottom: "60px",
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
            News Publish Request
            {/* <FormattedLabel id="addHearing" /> */}
          </h2>
        </Box>
        <Divider />
        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 1,
          }}
        ></Box>
        <div
          // className={styles.addbtn}
          style={{
            display: "flex",
            justifyContent: "right",
            // marginTop: 10,
            marginRight: 40,
            marginBottom: 10,
          }}
        >
          {authority && authority.includes("ENTRY") ? (
            <div>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                // type='primary'
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  router.push({
                    pathname: "/nrms/transaction/AdvertisementRotation/create",
                  });
                }}
              >
                Add
                {/* <FormattedLabel id="add" /> */}
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div>
          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              height: 500,
              overflowX: "auto",
            }}
          >
            <DataGrid
              rowHeight={70}
              getRowId={(row) => row.srNo}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              autoHeight
              sx={{
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
                getAllTableData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllTableData(_data, data.page);
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default Index;

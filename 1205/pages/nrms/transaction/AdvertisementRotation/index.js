import { EyeFilled } from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { Box, Button, Divider, Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
const Index = () => {
  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
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

  // Get Table - Data
  const getAllTableData = (_pageSize = 10, _pageNo = 0, _sortBy = "id", _sortDir = "desc") => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo, _sortBy, _sortDir);

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
        let _ress = r?.data?.trnNewsPublishRequestList?.map((r, i) => {
          return {
            ...r,
            srNo: i + 1 + _pageNo * _pageSize,
          };
        });

        setData({
          rows: _ress,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  useEffect(() => {
    getAllTableData();
  }, []);

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
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
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
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: "Department Name",
      // minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "left",
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
      field: "newsPublishDate",
      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
    },

    {
      field: language == "en" ? "priorityName" : "priorityNameMr",
      headerName: "News Rotation Request Number",
      flex: 1,
      minWidth: 100,
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
            {authority?.includes("ENTRY") && (
              <>
                {params?.row?.status == "DRAFTED" && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/nrms/transaction/AdvertisementRotation/create",
                        query: {
                          pageMode: "Edit",
                          id: params.row.id,
                        },
                      });
                      console.log("params.row: ", record);
                      // reset(params.row);
                    }}
                  >
                    <EditIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                )}
              </>
            )}

            {params?.row?.status == "RELEASING_ORDER_GENERATED" && (
              <IconButton
                onClick={() => {
                  router.push({
                    pathname: "/nrms/transaction/releasingOrder/news/",
                    query: {
                      pageMode: "View",
                      id: params?.row?.id,
                    },
                  });
                }}
              >
                <LocalPrintshopOutlinedIcon style={{ color: "#556CD6" }} />
              </IconButton>
            )}

            {(authority?.includes("RELEASING_ORDER_ENTRY") ||
              authority?.includes("APPROVAL") ||
              authority?.includes("FINAL_APPROVAL")) &&
              !["DRAFTED", "SENT_TO_NEWS_AGENCIES_FOR_PUBLISHMENT"].includes(params?.row?.status) && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/nrms/transaction/AdvertisementRotation/create",
                      query: {
                        pageMode: "PROCESS",
                        id: params?.row?.id,
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
              )}
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
          <h2>News Publish Request</h2>
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
          {authority && authority.includes("ENTRY") && (
            <div>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                onClick={() => {
                  // reset({
                  //   ...resetValuesExit,
                  // });
                  router.push({
                    pathname: "/nrms/transaction/AdvertisementRotation/create",
                  });
                }}
              >
                Add
                {/* <FormattedLabel id="add" /> */}
              </Button>
            </div>
          )}
        </div>

        <div>
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
              pagination
              paginationMode="server"
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

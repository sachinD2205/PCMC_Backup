import { Box, Button, Grid, Autocomplete, ThemeProvider } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "./schema";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import styles from '../../../../../styles/lms/[dailyEntryMagazines]view.module.css'
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { FormProvider, useForm } from "react-hook-form";
import { Slide } from "@mui/material";
import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from '../../../../../theme'


const DepartmentalProcess = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [libraryIdsList, setLibraryIdsList] = useState([]);
  const [magazineNewspaperEntriesList, setMagazineNewspaperEntriesList] =
    useState([]);
  const [magazineNewspaperMasterList, setMagazineNewspaperMasterList] =
    useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [selectedSuppliedDate, setSelectedSuppliedDate] = useState(
    moment().toDate()
  );

  useEffect(() => {
    setAllLibrarysList();
    setAllEntriesList();
    setMasterList();
  }, []);

  const setMasterList = () => {
    const url = urls.LMSURL + "/magazineNewspaperMaster/getAll";
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        if (
          !response.data ||
          !response.data.masterMagazineNewspaperList ||
          response.data.masterMagazineNewspaperList.length === 0
        ) {
          throw new Error("Magazine/Newspaper entries not found");
        }
        setMagazineNewspaperMasterList(
          response.data.masterMagazineNewspaperList
        );
      })
      .catch((err) => {
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const setAllEntriesList = () => {
    const url = urls.LMSURL + "/trnDailyMagazineNewsPaperEntry/getAll";
    axios
      .get(url)
      .then((response) => {
        console.log("magazine123", response.data.trnDailyMagazineNewsPaperEntryList);
        setMagazineNewspaperEntriesList(
          response.data.trnDailyMagazineNewsPaperEntryList.sort((a, b) => a.id - b.id).map((entry,i) => ({
            srNo:i+1,
            ...entry,
            receivedAt:
              entry.receivedAt &&
              moment(entry.receivedAt).format("DD/MM/YYYY"),
            suppliedAt:
              entry.suppliedAt &&
              moment(entry.suppliedAt).format("DD/MM/YYYY"),
          }))

        );
      })
      .catch((err) => {
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const setAllLibrarysList = () => {
    const url = urls.LMSURL + "/libraryMaster/getAll";
    axios
      .get(url)
      .then((response) => {
        if (
          !response.data ||
          !response.data.libraryMasterList ||
          response.data.libraryMasterList.length === 0
        ) {
          throw new Error("No libraries found");
        }
        setLibraryIdsList(response.data.libraryMasterList);
      })
      .catch((err) => {
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const {
    register,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const exitButton = () => {
    cancellButton();
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    setSelectedLibrary(null);
    setSelectedMagazine(null);
    setSelectedDate(moment().toDate());
    setQuantity("");
  };

  const onSubmitForm = () => {
    if (
      !selectedLibrary ||
      !selectedMagazine ||
      !selectedDate ||
      !selectedSuppliedDate ||
      !quantity
    ) {
      swal("Please enter all values", { icon: "warning" });
      return;
    }
    const payload = {
      libraryMasterKey: selectedLibrary.id,
      libraryName: selectedLibrary.libraryName,
      magazineNewspaperMasterKey: selectedMagazine.id,
      magazineNewspaperName: selectedMagazine.magazineName,
      magazineNewspaperSupplierMasterKey:
        selectedMagazine.magazineNewspaperSupplierMasterKey,
      supplierName: selectedMagazine.supplierName,
      quantity: +quantity,
      remark: "",
      supplierContactNumber: selectedMagazine.supplierContactNumber,
      receivedAt: selectedDate.toISOString(),
      suppliedAt: selectedSuppliedDate.toISOString(),
      createdUserId: 1,
      updateDtTm: null,
      updateUserid: 1,
      version: 1,
    };
    const url = urls.LMSURL + "/trnDailyMagazineNewsPaperEntry/save";
    console.log("Payload:", payload);
    axios
      .post(url, payload)
      .then((response) => {
        console.log(response.data);
        setAllEntriesList();
        swal("Entry saved.", { icon: "success" });
        return exitButton();
      })
      .catch((err) => {
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const columns = [
    { headerName: "Sr. No.", field: "srNo", flex: 3 },
    { headerName: "Magazine/Newspaper Name", field: "magazineNewspaperName", flex: 3 },
    { headerName: "Supplier Name", field: "supplierName", flex: 3 },
    // { headerName: "Supplier Contact Number", field: "contactNumber", flex: 3 },
    { headerName: "Date of Publishing", field: "suppliedAt", flex: 3 },
    { headerName: "Date of Receipt", field: "receivedAt", flex: 3 },
    { headerName: "Quantity", field: "quantity", flex: 3 },
  ];

  return (
    <>
      {/* <Box
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
          <FormattedLabel id="dailyEntryMagazineNewspaper" />
        </h2>
      </Box> */}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>

          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
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
                  {/* {<FormattedLabel id="boardtitle" />} */}
                  Daily Entry Magazines Newspaper
                </h2>
              </div>
            </div>
            {isOpenCollapse ? (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <FormProvider {...methods}>
                    <form>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ marginTop: "1vh", marginLeft: "2vh" }}
                        columns={16}
                      >
                        <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
                          <Autocomplete
                            sx={{ m: 1, width: "100%" }}
                            label="Library ID *"
                            disablePortal
                            options={libraryIdsList}
                            value={selectedLibrary}
                            onChange={(_e, library) => {
                              setSelectedLibrary(library);
                            }}
                            getOptionLabel={({ libraryName }) =>
                              libraryName || ""
                            }
                            isOptionEqualToValue={(opt, sel) => {
                              return opt.id === sel.id;
                            }}
                            renderOption={(props, option) => (
                              <span {...props}>{option.libraryName}</span>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} label="Choose a library" />
                            )}
                          />
                        </Grid>
                        <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
                          <Autocomplete
                            sx={{ m: 1, width: "100%" }}
                            label="Magazine/Newspaper *"
                            disablePortal
                            options={magazineNewspaperMasterList}
                            value={selectedMagazine}
                            onChange={(_e, mag) => {
                              setSelectedMagazine(mag);
                            }}
                            getOptionLabel={({ magazineName }) =>
                              magazineName || ""
                            }
                            isOptionEqualToValue={(opt, sel) => {
                              return opt.id === sel.id;
                            }}
                            renderOption={(props, option) => (
                              <span {...props}>{option.magazineName}</span>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Choose a magazine/newspaper"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                        style={{ marginTop: "1vh", marginLeft: "2vh", marginRight: "1vh" }}
                        columns={12}
                      >
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            // sx={{ m: 1, width: "100%" }}
                            label="Quantity *"
                            variant="standard"
                            // type="number"
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value);
                            }}
                            error={!!errors.quantity}
                            helperText={
                              errors?.quantity ? errors.quantity.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <DesktopDatePicker
                            sx={{ m: 1, width: "100%" }}
                            label="Published Date *"
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            value={selectedSuppliedDate || ""}
                            onChange={(d) => {
                              setSelectedSuppliedDate(d);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <DesktopDatePicker
                            sx={{ m: 1, width: "100%" }}
                            label="Received Date *"
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            value={selectedDate || ""}
                            onChange={(d) => {
                              setSelectedDate(d);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>

                      </Grid>

                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            type="button"
                            onClick={onSubmitForm}
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText}
                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            Clear
                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            Exit
                          </Button>
                        </div>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </Slide>
            ) : (
              <>
                <div className={styles.addbtn}>
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    disabled={buttonInputState}
                    onClick={() => {
                      reset({});
                      setEditButtonInputState(true);
                      setDeleteButtonState(true);
                      setBtnSaveText("Save");
                      setButtonInputState(true);
                      setSlideChecked(true);
                      setIsOpenCollapse(!isOpenCollapse);
                    }}
                  >
                    Add
                  </Button>
                </div>
                <DataGrid
                  autoHeight
                  sx={{
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                    overflowY: 'scroll',

                    '& .MuiDataGrid-virtualScrollerContent': {},
                    '& .MuiDataGrid-columnHeadersInner': {
                      backgroundColor: '#556CD6',
                      color: 'white',
                    },

                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                  }}
                  rows={magazineNewspaperEntriesList}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                //checkboxSelection
                />
              </>
            )}
          </Paper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
};
export default DepartmentalProcess;

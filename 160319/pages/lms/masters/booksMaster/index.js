import {
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  Box,
  ThemeProvider,
} from "@mui/material";
import { Paper } from "@mui/material";
import { DataGrid, GridCell, GridRow } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../libraryCompetativeMaster/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Slide } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "./schema";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme"


const BooksMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [bookTypeData, setBookTypeData] = useState([]);
  const [bookClassifications, setBookClassification] = useState([]);
  const [bookSubTypeData, setBookSubType] = useState([]);
  const [languages, setLanguages] = useState([{ id: 1, language: "English" }, { id: 2, language: "Marathi" }, { id: 3, language: "Hindi" }])

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    getBookClassifications();
    getBookTypeData();
    getTableData();

  }, []);

  // useEffect(() => {
  //   getTableData();

  // }, [bookTypeData]);

  useEffect(() => {

    if (watch('bookType')) {
      axios.get(`${urls.LMSURL}/bookSubTypeMaster/getAll`)
        .then((r) => {
          setBookSubType(
            r.data.bookSubTypeMasterList.map((r) => ({
              id: r.id,
              bookType: r.bookType,
              bookSubtype: r.bookSubtype,
            }))
          );
        });
    }

  }, [watch('bookType')])

  const getBookClassifications = () => {
    axios
      .get(`${urls.LMSURL}/bookClassificationMaster/getAll`)
      .then((r) => {
        let result = r.data.bookClassificationList;
        console.log("result", result);

        setBookClassification(result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            bookClassification: r.bookClassification,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          }
        }
        ))
      })
  }

  const getBookTypeData = () => {
    axios.get(`${urls.LMSURL}/bookTypeMaster/getAll`)
      .then((r) => {
        setBookTypeData(
          r.data.bookTypeMasterList.map((r) => ({
            id: r.id,
            bookType: r.bookType
          }))
        );
      });
  };


  const getBookSubType = () => {

  }
  const getTableData = () => {
    axios
      .get(`${urls.LMSURL}/bookMaster/getAll`)
      .then((res) => {
        console.log("bookmaster", res.data)
        setDataSource(
          res.data.bookMasterList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            author: r.author,
            barcode: r.barcode,
            bookClassification: r.bookClassification,

            bookName: r.bookName,
            // bookName1: bookTypeData?.find((obj) => obj?.id === r.bookName)
            //   ?.bookName,
            bookType: r.bookType,
            bookSubType: r.bookSubType,

            language: r.language,
            // languageName: bookTypeData?.find((obj) => obj?.id === r.language)
            //   ?.language,
            bookEdition: r.bookEdition,
            bookPrice: r.bookPrice,
            publication: r.publication,
            // publicationName: bookTypeData?.find(
            //   (obj) => obj?.id === r.publication
            // )?.publication,
            // shelfCatlogSection: r.shelfCatlogSection,
            // shelfCatlogSectionName: bookTypeData?.find(
            //   (obj) => obj?.id === r.shelfCatlogSection
            // )?.shelfCatlogSection,
            // shelfNo: r.shelfNo,
            // shelfNoName: bookTypeData?.find((obj) => obj?.id === r.shelfNo)
            //   ?.shelfNo,

            totalBooksCopy: r.totalBooksCopy,
          }))
        );
      });
  };



  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };

    console.log("savebody", finalBodyForApi)
    // Save - DB
    axios
      .post(
        `${urls.LMSURL}/bookMaster/save`,
        finalBodyForApi
      )
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getTableData();
          // setButtonInputState(false);
          // setIsOpenCollapse(true);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);

          setButtonInputState(false);
          setSlideChecked(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.LMSURL}/bookMaster/delete/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getTableData();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
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

  const resetValuesCancell = {

    bookClassification: "",
    language: "",
    bookName: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookPrice: "",
    totalBooksCopy: "",
    // shelfNo: "",
    // shelfCatlogSection: "",
    barcode: "",
    bookType: "",
    bookSubType: "",

  };

  const resetValuesExit = {
    bookClassification: "",
    language: "",
    bookName: "",
    publication: "",
    author: "",
    bookEdition: "",
    bookPrice: "",
    totalBooksCopy: "",
    // shelfNo: "",
    // shelfCatlogSection: "",
    barcode: "",
    bookType: "",
    bookSubType: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 3,
    },
    // {
    //   field: "bookClassificationName",
    //   headerName: "Book Classification",
    //   flex: 3,
    // },
    // {
    //   field: "bookCategoryName",
    //   headerName: "Book Category",
    //   //type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "bookSubCategoryName",
    //   headerName: "Book Sub Category",
    //   // type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "languageName",
    //   headerName: "Language",
    //   // type: "number",
    //   flex: 3,
    // },
    {
      field: "bookName",
      headerName: "Book Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "publication",
      headerName: "Publication",
      // type: "number",
      flex: 3,
    },
    {
      field: "author",
      headerName: "Author",
      // type: "number",
      flex: 3,
    },
    {
      field: "bookEdition",
      headerName: "Book Edition",
      //type: "number",
      flex: 3,
    },
    {
      field: "bookClassification",
      headerName: "Book Classification",
      //type: "number",
      flex: 3,
    },
    {
      field: "bookType",
      headerName: "Book Type",
      //type: "number",
      flex: 3,
    },
    {
      field: "bookSubType",
      headerName: "Book Sub Type",
      //type: "number",
      flex: 3,
    },
    {
      field: "bookPrice",
      headerName: "Book Price",
      //type: "number",
      flex: 3,
    },
    {
      field: "language",
      headerName: "Language",
      //type: "number",
      flex: 3,
    },
    {
      field: "totalBooksCopy",
      headerName: "Total Books Copy",
      //type: "number",
      flex: 3,
    },
    // {
    //   field: "shelfNoName",
    //   headerName: "Shelf No.",
    //   //type: "number",
    //   flex: 3,
    // },
    // {
    //   field: "shelfCatlogSectionName",
    //   headerName: "Shelf Catlog Section",
    //   //type: "number",
    //   flex: 3,
    // },
    {
      field: "barcode",
      headerName: "Barcode",
      //type: "number",
      flex: 3,
    },
    {
      field: "actions",
      headerName: "Actions",
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
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <>
      <ThemeProvider theme={theme}>
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
              // backgroundColor:'#0E4C92'
              // backgroundColor:'		#0F52BA'
              // backgroundColor:'		#0F52BA'
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              Books Master
            </h2>
          </Box>

          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.bookClassification}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Book Classification
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Book Classification"
                              >
                                {bookClassifications &&
                                  bookClassifications.map(
                                    (bookClassification, index) => (
                                      <MenuItem
                                        key={index}
                                        value={bookClassification.bookClassification}
                                      >
                                        {bookClassification.bookClassification}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="bookClassification"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.bookClassification
                              ? errors.bookClassification.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.bookType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Book Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Book Type"
                              >
                                {bookTypeData &&
                                  bookTypeData.map((bookType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={bookType.bookType}
                                    >
                                      {bookType.bookType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="bookType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.bookType
                              ? errors.bookType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.bookSubType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Book Sub Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Book Sub Type"
                              >
                                {bookSubTypeData &&
                                  bookSubTypeData.map((bookSubType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={bookSubType.bookSubtype}
                                    >
                                      {bookSubType.bookSubtype}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="bookSubType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.bookSubType
                              ? errors.bookSubType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.language}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Language
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Language"
                              >
                                {languages &&
                                  languages.map((language, index) => (
                                    <MenuItem key={index} value={language.id}>
                                      {language.language}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="language"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.language ? errors.language.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        {/* <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.bookName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Book Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Book Name"
                              >
                                {bookTypeData &&
                                  bookTypeData.map((bookName, index) => (
                                    <MenuItem key={index} value={bookName.id}>
                                      {bookName.bookName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="bookName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.bookName ? errors.bookName.message : null}
                          </FormHelperText>
                        </FormControl> */}

                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Book Name"
                          variant="standard"
                          {...register("bookName")}
                          error={!!errors.bookName}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("bookName") ? true : false)
                            // ||(router.query.bookName ? true : false),
                          }}
                          helperText={
                            errors?.bookName
                              ? errors.bookName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        {/* <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.publication}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Publication *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Publication"
                              >
                                {bookTypeData &&
                                  bookTypeData.map((publication, index) => (
                                    <MenuItem
                                      key={index}
                                      value={publication.id}
                                    >
                                      {publication.publication}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="publication"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.publication
                              ? errors.publication.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Publication"
                          variant="standard"
                          {...register("publication")}
                          error={!!errors.publication}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("publication") ? true : false)
                            // ||(router.query.publication ? true : false),
                          }}
                          helperText={
                            errors?.publication
                              ? errors.publication.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Author"
                          variant="standard"
                          {...register("author")}
                          error={!!errors.author}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("author") ? true : false)
                            // ||(router.query.author ? true : false),
                          }}
                          helperText={
                            errors?.author ? errors.author.message : null
                          }
                        />
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Book Edition"
                          variant="standard"
                          {...register("bookEdition")}
                          error={!!errors.bookEdition}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("bookEdition") ? true : false)
                            // ||(router.query.bookEdition ? true : false),
                          }}
                          helperText={
                            errors?.bookEdition
                              ? errors.bookEdition.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Book Price"
                          variant="standard"
                          {...register("bookPrice")}
                          error={!!errors.bookPrice}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("bookPrice") ? true : false)
                            // ||(router.query.bookPrice ? true : false),
                          }}
                          helperText={
                            errors?.bookPrice ? errors.bookPrice.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Total Books Copy"
                          variant="standard"
                          {...register("totalBooksCopy")}
                          error={!!errors.totalBooksCopy}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("totalBooksCopy") ? true : false)
                            // ||(router.query.totalBooksCopy ? true : false),
                          }}
                          helperText={
                            errors?.totalBooksCopy
                              ? errors.totalBooksCopy.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Barcode"
                          variant="standard"
                          {...register("barcode")}
                          error={!!errors.barcode}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("barcode") ? true : false)
                            // ||(router.query.barcode ? true : false),
                          }}
                          helperText={
                            errors?.barcode ? errors.barcode.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      
                    </Grid> */}

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>{" "}
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
          )}

          <div className={styles.addbtn}>
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
              Add{" "}
            </Button>
          </div>
          <DataGrid
            autoHeight
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          //checkboxSelection
          />
        </Paper>
      </ThemeProvider>
    </>
  );
};
export default BooksMaster;

import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import schema from "../../../../components/streetVendorManagementSystem/schema/ItemSchema";

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
    resolver: yupResolver(schema),
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

  const [itemCategorys, setItemCategorys] = useState([]);

  const getCategorys = () => {
    axios.get(`${urls.HMSURL}/MstItemCategory/getAll`).then((r) => {
      setItemCategorys(
        r.data.itemCategory.map((row) => ({
          id: row.id,
          itemCategory: row.itemCategory,
        })),
      );
    });
  };

  useEffect(() => {
    getCategorys();
  }, []);

  // Get Table - Data
  const getItem = () => {
    axios.get(`${urls.HMSURL}/item/getAll`).then((res) => {
      setDataSource(
        res.data.item.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          itemPrefix: r.itemPrefix,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          itemCategory: r.itemCategory,
          item: r.item,
          remarks: r.remarks,
          itemCategoryName: itemCategorys?.find(
            (obj) => obj?.id === r.itemCategory,
          )?.itemCategory,
        })),
      );
    });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getItem();
  }, [itemCategorys]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB

    axios.post(`${urls.HMSURL}/item/save`, fromData).then((res) => {
      if (res.status == 201) {
        fromData.id
          ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          : sweetAlert("Saved!", "Record Saved successfully !", "success");
        getItem();
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
      }
    });
    //  else if (btnSaveText === "Update") {
    //   axios
    //     .post(`${urls.HMSURL}/Item/saveItem`, finalBodyForApi)
    //     .then((res) => {
    //       if (res.status == 201) {
    //         sweetAlert("Updated!", "Record Updated successfully !", "success");
    //         getItem();
    //         setButtonInputState(false);
    //         setIsOpenCollapse(false);
    //         setEditButtonInputState(false);
    //         setDeleteButtonState(false);
    //       }
    //     });
    // }
  };

  // Delete
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
          .delete(`${urls.HMSURL}/MstItem/discardItem/${value}`)
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getItem();
            }
          });
      } else {
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
    fromDate: null,
    toDate: null,
    itemCategory: "",
    item: "",
    itemPrefix: "",
    remarks: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    itemCategory: "",
    item: "",
    itemPrefix: "",
    remarks: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    {
      field: "itemPrefix",
      headerName: "Item Prefix ",
      flex: 1,
    },
    { field: "fromDate", headerName: "FromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    {
      field: "itemCategoryName",
      headerName: "itemCategory",
      // type: "number",
      flex: 1,
    },
    {
      field: "item",
      headerName: "Item",
      // type: "number",
      flex: 1,
    },
    {
      field: "remarks",
      headerName: "Remark",
      //type: "number",
      flex: 1,
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
                console.log(`Id Send to Edit ${params.id}`);
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
        {isOpenCollapse && (
          <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Item Prefix *'
                          variant='standard'
                          {...register("itemPrefix")}
                          error={!!errors.itemPrefix}
                          helperText={
                            errors?.itemPrefix
                              ? errors.itemPrefix.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name='fromDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date *
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name='toDate'
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='DD/MM/YYYY'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size='small'
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.toDate ? errors.toDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div>
                        <FormControl
                          variant='standard'
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.itemCategory}
                        >
                          <InputLabel id='demo-simple-select-standard-label'>
                            Item Category *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label='Item Category *'
                              >
                                {itemCategorys &&
                                  itemCategorys.map((itemCategory, index) => (
                                    <MenuItem
                                      key={index}
                                      value={itemCategory.id}
                                    >
                                      {itemCategory.itemCategory}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='itemCategory'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.itemCategory
                              ? errors.itemCategory.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Item *'
                          variant='standard'
                          {...register("item")}
                          error={!!errors.item}
                          helperText={errors?.item ? errors.item.message : null}
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label='Remark'
                          variant='standard'
                          {...register("remarks")}
                          error={!!errors.remarks}
                          helperText={
                            errors?.remarks ? errors.remarks.message : null
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.btn}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type='submit'
                        variant='contained'
                        color='success'
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant='contained'
                        color='primary'
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant='contained'
                        color='error'
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
            variant='contained'
            endIcon={<AddIcon />}
            type='primary'
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
    </>
  );
};

export default Index;

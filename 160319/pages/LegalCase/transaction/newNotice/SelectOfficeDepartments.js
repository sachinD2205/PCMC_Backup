import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const SelectOfficeDepartments = ({
  officeDepartmentDesignationUser,
  officeLocationList,
  userList,
  officeLocationWiseDepartment,
  setOfficeLocationWiseDepartment,
  setDepartmentWiseEmployee,
  departments,
  control,
  errors,
  fields,
  remove,
  appendUI,
}) => {
  const onOfficeLocationChange = (event, field) => {
    field.onChange(event);
    let filteredDepartments = [...departments];
    filteredDepartments = filteredDepartments.filter((val) => {
      return (
        val.id ===
          officeDepartmentDesignationUser?.find((r) => {
            return r.departmentId === event.target.value;
          })?.departmentId && val
      );
    });
    setOfficeLocationWiseDepartment(filteredDepartments);
  };

  const onDepartmentNameChange = (event, field) => {
    field.onChange(event);
    // setDepartmentWiseEmployee(
    //   userList.map((val) => {
    //     return (
    //       val.id ===
    //         officeDepartmentDesignationUser.find((r) => {
    //           return r.userId === event.target.value;
    //         }).userId && val
    //     );
    //   })
    // );
    // setOfficeLocationWiseDepartment(departments);
  };

  return (
    <>
      <Grid container sx={{ padding: "10px" }}>
        <Grid item xs={10} />
        <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              appendUI();
            }}
          >
            <FormattedLabel id="addMore" />
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        {fields.map((witness, index) => {
          return (
            <Grid
              key={index}
              container
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
              }}
            >
              <Grid
                item
                xs={8}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-label">
                  <FormattedLabel id="deptName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Office Location"
                        value={field.value}
                        onChange={(e) => onOfficeLocationChange(e, field)}
                        style={{ backgroundColor: "white" }}
                      >
                        {officeLocationList.length > 0
                          ? officeLocationList.map((val, id) => {
                              return (
                                <MenuItem
                                  key={id}
                                  value={val.id}
                                  style={{
                                    display: val.officeLocationName
                                      ? "flex"
                                      : "none",
                                  }}
                                >
                                  {val.officeLocationName}
                                </MenuItem>
                              );
                            })
                          : "Not Available"}
                      </Select>
                    )}
                    name={`concernDeptUser[${index}].locationName`}
                    control={control}
                    defaultValue={null}
                    key={witness.id}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {/* {`errors.concernDeptUser.[${index}].locationName` && "Required"} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={8}
                sm={5}
                md={5}
                lg={5}
                xl={5}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl size="small" fullWidth sx={{ width: "90%" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* <FormattedLabel id="officeLocation" /> */}
                    <FormattedLabel id="subDepartment" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Department Name"
                        value={field.value}
                        onChange={(e) => onDepartmentNameChange(e, field)}
                        style={{ backgroundColor: "white" }}
                      >
                        {officeLocationWiseDepartment.length > 0
                          ? officeLocationWiseDepartment.map((user, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={user.id}
                                  style={{
                                    display: user.department ? "flex" : "none",
                                  }}
                                >
                                  {user.department}
                                </MenuItem>
                              );
                            })
                          : []}
                      </Select>
                    )}
                    name={`concernDeptUser[${index}].departmentName`}
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {/* {`errors.concernDeptUser.[${index}].departmentName` && "Required"} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DeleteIcon />}
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    height: "30px",
                  }}
                  onClick={() => {
                    // remove({
                    //   applicationName: "",
                    //   roleName: "",
                    // });
                    remove(index);
                  }}
                >
                  {/* Delete */}
                  <FormattedLabel id="delete" />
                </Button>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default SelectOfficeDepartments;

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import urls from "../../../URLS/urls";
import { Controller, useFormContext } from "react-hook-form";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const Index = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext({
    // criteriaMode: "all",
    // resolver: yupResolver(docketSchema),
    // mode: "onSubmit",
  });

  const language = useSelector((state) => state?.labels?.language);
  ////////////////////////////////AREA ZONE WARD MAPPING////////////////////////////
  const [areaId, setAreaId] = useState([]);

  // const language = useSelector((state) => state?.labels.language)
  // moduleId=9&

  const getAreas = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=9&areaName=${watch("areaName")}`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          if (res?.data.length !== 0) {
            setAreaId(
              res?.data?.map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                areaId: r.areaId,
                zoneId: r.zoneId,
                wardId: r.wardId,
                zoneName: r.zoneName,
                zoneNameMr: r.zoneNameMr,
                wardName: r.wardName,
                wardNameMr: r.wardNameMr,
                areaName: r.areaName,
                areaNameMr: r.areaNameMr,
              })),
            );
            setValue("areaName", "");
          } else {
            sweetAlert({
              title: "OOPS!",
              text: "There are no areas match with your search!",
              icon: "warning",
              dangerMode: true,
              closeOnClickOutside: false,
            });
          }
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error1) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error1}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  useEffect(() => {
    if (watch("areaKey")) {
      // alert("aayaa");
      getAreas();
    }
  }, [watch("areaKey")]);

  ////////////////////////////WARD API//////////////
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);

  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            })),
          );
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error2) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error2}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  ////////////////////////////ZONE API//////////////
  const getAllWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: r.id,
              wardName: r.wardName,
              wardNameMr: r.wardNameMr,
            })),
          );
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          });
        }
      })
      .catch((error3) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error3}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  useEffect(() => {
    getAllZones();
    getAllWards();
  }, []);

  useEffect(() => {
    if (watch("areaKey")) {
      // alert("andr aaya first");
      let filteredArrayZone = areaId?.filter((obj) => obj?.areaId === watch("areaKey"));

      let flArray1 = allZones?.filter((obj) => {
        // alert("andar aaya");
        return filteredArrayZone?.some((item) => {
          return item?.zoneId === obj?.id;
        });
      });
      console.log(":flArray1", flArray1[0]?.id);

      ////////////////////////////////////////////////////////
      let flArray2 = allWards?.filter((obj) => {
        // alert("andar aaya")
        return filteredArrayZone?.some((item) => {
          return item?.wardId === obj?.id;
        });
      });
      console.log(":flArray1", flArray2[0]?.id);

      setValue("zoneKey", flArray1[0]?.id);
      setValue("wardKey", flArray2[0]?.id);
    } else {
      setValue("zoneKey", "");
      setValue("wardKey", "");
    }
  });

  return (
    <Paper
      elevation={3}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px",
        // margin: "30px",
      }}
    >
      <Grid
        container
        spacing={2}
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 15,
          }}
        >
          {areaId.length === 0 ? (
            <>
              <TextField
                // autoFocus
                style={{
                  backgroundColor: "white",
                  width: "300px",
                  // color: "black",
                }}
                id="outlined-basic"
                label={<FormattedLabel id="areaSearch" />}
                placeholder={
                  language === "en"
                    ? "Enter Area Name, Like 'Dehu'"
                    : "'देहू' प्रमाणे क्षेत्राचे नाव प्रविष्ट करा"
                }
                variant="standard"
                {...register("areaName")}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (watch("areaName")) {
                    getAreas();
                  } else {
                    sweetAlert({
                      title: "OOPS!",
                      text: "Please Enter The Area Name first",
                      icon: "warning",
                      dangerMode: true,
                      closeOnClickOutside: false,
                    });
                  }
                }}
                size="small"
                style={{ backgroundColor: "green", color: "white" }}
              >
                {/* <FormattedLabel id="getResults" /> */}
                {language === "en" ? "Get Result" : "निकाल मिळवा"}
              </Button>
            </>
          ) : (
            <>
              <FormControl style={{ minWidth: "200px" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="results" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      style={{ backgroundColor: "inherit" }}
                      fullWidth
                      variant="standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Complaint Type"
                    >
                      {areaId &&
                        areaId?.map((areaId, index) => (
                          <MenuItem key={index} value={areaId.areaId}>
                            {areaId?.areaName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="areaKey"
                  control={control}
                  defaultValue=""
                />
              </FormControl>

              {/* ////////////////// */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setAreaId([]);
                  setValue("areaKey", "");
                }}
                size="small"
              >
                {language === "en" ? "Search Area" : "क्षेत्र शोधा"}
              </Button>
            </>
          )}
        </Grid>

        {/* ////////////////////////////////////DROPDOWN FIELD//////////////////////// */}
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl style={{ minWidth: "300px" }} error={!!errors.zoneKey}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="zone" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  fullWidth
                  disabled
                  variant="standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="Complaint Type"
                >
                  {allZones &&
                    allZones?.map((allZones, index) => (
                      <MenuItem key={index} value={allZones.id}>
                        {language == "en"
                          ? //@ts-ignore
                            allZones?.zoneName
                          : // @ts-ignore
                            allZones?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zoneKey"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl style={{ minWidth: "300px" }} error={!!errors.wardKey}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="ward" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  fullWidth
                  variant="standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="Complaint Type"
                >
                  {allWards &&
                    allWards?.map((allWards, index) => (
                      <MenuItem key={index} value={allWards.id}>
                        {language == "en"
                          ? //@ts-ignore
                            allWards?.wardName
                          : // @ts-ignore
                            allWards?.wardNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="wardKey"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Index;

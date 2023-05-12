import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React from 'react'
import { useEffect,useState  } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form';
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel';
import { useSelector } from 'react-redux';
import axios from 'axios';
import urls from '../../../URLS/urls';
import { Failed } from './commonAlert';
import { yupResolver } from '@hookform/resolvers/yup';
import SiteVisitAppointmentViewSchema from '../schema/SiteVisitAppointmentViewSchema';
import theme from '../../../theme';

const SiteVisitAppointmentView = ({selectedEventData}) => {
    const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(SiteVisitAppointmentViewSchema),
    mode: "onChange",
  });
    const   {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
    } = methods;
     const [serviceNames, setServiceNames] = useState([]);
  const language = useSelector((state) => state?.labes?.language);

    
      // serviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          );
        } else {
          <Failed />;
        }
      })
      .catch((errors) => {
        <Failed />;
      });
  };

  useEffect(() => {
    getserviceNames();
  }, []);
    
    useEffect(() => {
        console.log("siteVisitAppointmentViewProps",selectedEventData);
    },[selectedEventData,serviceNames])

    // view 
  return (
      <div>
   <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="applicationNumber" />}
              disabled
              defaultValue=""
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
            />
          </Grid>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="applicantName" />}
              disabled
              defaultValue=""
              {...register("applicantName")}
              error={!!errors.applicantName}
              helperText={errors?.applicantName ? errors.applicantName.message : null}
            />
          </Grid>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <FormControl
              error={!!errors.applicationDate}
              sx={{ marginTop: 0 }}
              // sx={{ border: "solid 1px yellow" }}
            >
              <Controller
                control={control}
                name="applicationDate"
                defaultValue={Date.now()}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled
                      inputFormat="DD/MM/YYYY"
                      label={<span style={{ fontSize: 16 }}>{<FormattedLabel id="applicationDate" />}</span>}
                      value={field.value}
                      onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                      selected={field.value}
                      center
                      defaultValue={null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
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
                {errors?.applicationDate ? errors.applicationDate.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={12} md={4} lg={4} xl={4}>
            <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="serviceName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "50vh" }}
                    disabled
                    autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Service Name *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {serviceNames &&
                      serviceNames.map((serviceName, index) => (
                        <MenuItem key={index} value={serviceName.id}>
                          {language == "en" ? serviceName?.serviceName : serviceName?.serviceNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="serviceName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.serviceName ? errors.serviceName.message : null}</FormHelperText>
            </FormControl>
          </Grid>
       </Grid>     
        </FormProvider>   
          </ThemeProvider>

      </div>
  )
}

export default SiteVisitAppointmentView
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import { addPropertyRegistration } from "../../../../../components/redux/features/propertyRegistrationSlice"
import ApplicationInfoPT from "../../../../../components/propertyTax/propertyRegistration/ApplicationInfoPT"
import ElectricalConnAvailable from "../../../../../components/propertyTax/propertyRegistration/ElectricalConnAvailable" //by Anwar Ansari
import PropertyAddressDetails from "../../../../../components/propertyTax/propertyRegistration/PropertyAddressDetails"
import PropertyHolderDetails from "../../../../../components/propertyTax/propertyRegistration/PropertyHolderDetails"
import WaterConnAvailable from "../../../../../components/propertyTax/propertyRegistration/WaterConnAvailable" //by Anwar Ansari
import PropertyInformation from "../../../../../components/propertyTax/propertyRegistration/PropertyInformation"
import BankDetailsPT from "../../../../../components/propertyTax/propertyRegistration/BankDetailsPT" //by Anwar Ansari
//import PropertyHolderDetails from "../components/PropertyHolderDetails";
import axios from "axios"
import moment from "moment"
import sweetAlert from "sweetalert"
import theme from "../../../../../theme.js"
import { useRouter } from "next/router"

//.....
import AccountBalanceIcon from "@mui/icons-material/AccountBalance" //by Anwar Ansari
import ApartmentIcon from "@mui/icons-material/Apartment" //by Anwar Ansari
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark"
import Check from "@mui/icons-material/Check"
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices" //by Anwar Ansari
import HomeIcon from "@mui/icons-material/Home"
import PermIdentityIcon from "@mui/icons-material/PermIdentity"
import WaterIcon from "@mui/icons-material/Water" //by Anwar Ansari
import InfoIcon from "@mui/icons-material/Info"
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector"
import { styled } from "@mui/material/styles"
import PropTypes from "prop-types"
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel"
// import newLabelsPT from "../../../../containers/PT_ReusableComponent/newLabelsPT"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
// SCHEMA'SSSS
import {
  applicationInfoSchema,
  propertyHolderDetailsSchema,
  propertyDetailsSchema,
} from "../../../../../containers/schema/propertyTax/transactions/propertyRegistration"
import CombineComponents from "../../../../../components/propertyTax/propertyRegistration/CombineComponents"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt"
import swal from "sweetalert"
import styles from "../../../../../components/propertyTax/propertyRegistration/view.module.css"
import urls from "../../../../../URLS/urls"

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}))

function QontoStepIcon(props) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  )
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}))

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    // background: rgb(9,32,121),
    // background: linear-gradient(90deg, rgba(9,32,121,1) 1%, rgba(0,212,255,1) 76%);

    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
    // "radial-gradient(circle, rgba(100,255,250,1) 11%, rgba(16,21,145,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
  }),
}))

function ColorlibStepIcon(props) {
  const { active, completed, className } = props

  const icons = {
    // 1: <SettingsIcon />,
    1: <BrandingWatermarkIcon />,
    //2: <BabyChangingStationIcon />,
    2: <PermIdentityIcon />,
    // 3: <VideoLabelIcon />,
    3: <HomeIcon />,
    4: <ApartmentIcon />,
    //5: <AddCircleIcon />,
    // 5: <WaterIcon />,
    // // 6: <UploadFileIcon />,
    // 6: <ElectricalServicesIcon />, //by Anwar Ansari
    // 7: <AccountBalanceIcon />, //by Anwar Ansari
    5: <InfoIcon />,
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
}

// Get steps - Name
function getSteps(i) {
  return [
    <strong key={1}>
      <FormattedLabel id="applicationInfo" />
    </strong>,
    <strong key={2}>
      <FormattedLabel id="propertyHolderDetails" />
    </strong>,
    <strong key={3}>
      <FormattedLabel id="propertyAddressDetails" />
    </strong>,
    <strong key={4}>
      <FormattedLabel id="propertyInformation" />
    </strong>,
    // <strong key={5}>
    //   <FormattedLabel id="waterConnAvailable" />
    // </strong>,
    // <strong key={6}>
    //   <FormattedLabel id="electricalConnAvailable" />
    // </strong>,
    // <strong key={7}>
    //   <FormattedLabel id="bankDetailsPT" />
    // </strong>,
    <strong key={5}>
      <FormattedLabel id="additionalInfo" />
    </strong>,
  ]
}

// Get Step Content Form
function getStepContent(step) {
  switch (step) {
    case 0:
      return <ApplicationInfoPT step={step} />

    case 1:
      return <PropertyHolderDetails step={step} />

    case 2:
      return <PropertyAddressDetails step={step} />

    case 3:
      return <PropertyInformation step={step} />

    // case 4:
    //   return <WaterConnAvailable />

    // case 5:
    //   return <ElectricalConnAvailable />

    // case 6:
    //   return <BankDetailsPT />

    case 4:
      return <CombineComponents step={step} />

    default:
      return "unknown step"
  }
}

// Linear Stepper
const Index = () => {
  const router = useRouter()
  // Const
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const dispach = useDispatch()
  const language = useSelector((store) => store.labels.language)

  const [dataValidation, setDataValidation] = useState(applicationInfoSchema)

  useEffect(() => {
    console.log("steps", activeStep)
    if (activeStep == "0") {
      setDataValidation(applicationInfoSchema)
    } else if (activeStep == "1") {
      setDataValidation(propertyHolderDetailsSchema)
      propertyDetailsSchema
    } else if (activeStep == "2") {
      setDataValidation(propertyDetailsSchema)
    }
  }, [activeStep])

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    defaultValues: {
      //serviceName: "",
      applicationNumber: `PMS${Math.floor(Math.random() * 10000000)}`,
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      trackingID: "46454565454445",
      citySurveyNo: "",
      hawkingZoneName: "",
      title: "",
      firstNameEng: "",
      firstNameMr: "",
      middleNameEng: "",
      middleNameMr: "",
      lastNameEng: "",
      lastNameMr: "",
      gender: "",
      religion: "",
      cast: "",
      subCast: "",
      dateOfBirth: null,
      age: "",
      disbality: "",
      typeOfDisability: "",
      mobile: "",
      emailAddress: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: 1,
      crState: "Maharashtra",
      crPincode: "",
      crLattitude: "",
      crLongitude: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: 1, //by Anwar Ansari
      prState: "Maharashtra",
      prPincode: "",
      prLattitude: "",
      prLongitude: "",
      wardNo: "",
      wardName: "",
      natureOfBusiness: "",
      hawkingDurationDaily: "",
      hawkerType: "",
      item: "",
      periodOfResidenceInMaharashtra: null,
      periodOfResidenceInPCMC: null,
      rationCardNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountNo: "",
      ifscCode: "",
      waterConnectionTypeID: 1,
      electricalConnectionTypeID: 1,
    },
  })

  // Handle Next
  const handleNext = (data) => {
    // console.log("302", { ...data, propertyDetails:[{data.}] })
    console.log("Form  Submit Data --->", JSON.stringify(data))
    //dispach(addIsssuanceofHawkerLicense(data));
    dispach(addPropertyRegistration(data))

    console.log("handleNext", data)

    var a = Object.entries(data)

    const dataMap = new Map(a)

    console.log("Object.entries(data)", a)
    console.log(dataMap.get("dateOfElectricConn"))

    //new add data send to server by Anwar Ansari
    const datas = {
      applicationDate: "2022-11-07",
      applicationNo: dataMap.get("applicationNumber"),
      propertyID: "1010100123.00",
      serviceID: dataMap.get("serviceID"),
      trackingID: dataMap.get("trackingID"),
      gisID: "GIS01",
      // finalusetype: "Commercial",
      // discription: "Test discription",
      // totalArea: 1000.0,
      // totalRatableValue: 25000.0,
      propertyType: dataMap.get("propertyType"),
      propertySubType: dataMap.get("propertySubType"),
      occupancy: dataMap.get("occupancy"),
      ownershipType: dataMap.get("occupancy"),
      bussinessType: dataMap.get("bussinessType"),
      industryType: dataMap.get("industryType"),
      // amenities: dataMap.get("amenities"),
      flag: dataMap.get("flagPT"),
      factor: dataMap.get("factor"), // MASSTER SE AAYGA
      // propertyStatus:,// MASSTER SE AAYGA
      buildingPermissionNo: dataMap.get("buildingPermissionNum"),
      dateOfBuildingPermission: dataMap.get("dateOfBuildingPermission"),
      dateOfbuildngCompletion: dataMap.get("dateOfbuildngCompletion"),
      actualDateOfBuildingUsageInitiation: dataMap.get(
        "actualDateOfBuildingUsageInit"
      ),

      // propertyAddressDetails
      circle: dataMap.get("circle"),
      circleNo: dataMap.get("circleNo"),
      gat: dataMap.get("circleNo"), //
      gatNo: dataMap.get("circleNo"), //
      surveyNo: dataMap.get("crCitySurveyNumber"),
      flatNo: dataMap.get("crFlatNumber"),
      buildingName: dataMap.get("crBuildingName"),
      societyName: dataMap.get("crSocietyName"),
      citySurveyNo: dataMap.get("citySurveyNumber"),
      area: dataMap.get("crAreaName"),
      landmark: dataMap.get("crLandmarkName"),
      village: dataMap.get("crVillageName"),
      city: dataMap.get("crCityName"),
      pincode: dataMap.get("crPincode"),
      lattitude: dataMap.get("crLattitude"),
      longitude: dataMap.get("crLongitude"),

      //  WATER CONNECTION DETAILS
      waterConnectionTypeID: dataMap.get("waterConnType"),
      noOfWaterConnection: dataMap.get("numOfWaterConn"),
      waterConnectionNo: dataMap.get("waterConnNum"),
      diameter: dataMap.get("diameter"),

      //  ELECTRICAL CONNECTION DETAILS
      electricalConnectionTypeID: dataMap.get("electricConnType"),
      dateOfElectricalConnection: dataMap.get("dateOfElectricConn"),
      electricalConsumerNo: dataMap.get("electricConsumerNum"),

      //  BANK DETAILS
      bankName: dataMap.get("nameOfBank"),
      branchName: dataMap.get("branchName"),
      accountNo: dataMap.get("bankAccountNo"),

      propertyDetails: [
        {
          usageType: dataMap.get("usageType"),
          subUsageType: dataMap.get("subUsageType"),
          constructionType: dataMap.get("constructionTypeName"),
          roomType: dataMap.get("roomType"),
          lenght: parseInt(dataMap.get("length")),
          breadth: parseInt(dataMap.get("breadth")),
          area: 1000,
          parking: true,
          parkingArea: parseInt(dataMap.get("parkingAreaInSquare")),
          total: parseInt(dataMap.get("totalAreaInSquare")),
        },
      ],
      propertyHoldersDetails: [
        {
          titleID: dataMap.get("title"),
          firstNameEng: dataMap.get("firstNameEng"),
          firstNameMr: dataMap.get("firstNameMr"),
          middleNameEng: dataMap.get("middleNameEng"),
          middleNameMr: dataMap.get("middleNameMr"),
          lastNameEng: dataMap.get("lastNameEng"),
          lastNameMr: dataMap.get("lastNameMr"),
          genderID: dataMap.get("gender"),
          mobile: dataMap.get("mobile"),
          emailID: dataMap.get("emailAddress"),
          aadharNo: dataMap.get("aadharNoPT"),
          panNo: dataMap.get("panNum"),
        },
      ],

      billingAddressDetails: [
        {
          surveyNo: dataMap.get("prCitySurveyNumber"),
          flatNo: dataMap.get("prFlatNumber"),
          buildingName: dataMap.get("prBuildingName"),
          societyName: dataMap.get("prSocietyName"),
          citySurveyNo: dataMap.get("prCitySurveyNumber"),
          areaID: dataMap.get("prAreaName"),
          landmarkID: dataMap.get("prLandmarkName"),
          villageID: dataMap.get("prVillageName"),
          cityID: dataMap.get("prCityName"), //
          pincodeID: dataMap.get("prPincode"), //
          lattitude: dataMap.get("crLattitude"),
          longitude: dataMap.get("crLongitude"),
        },
      ],
      // waterConnectionDetails: [
      //   {
      //     waterConnectionTypeID: dataMap.get("waterConnType"),
      //     noOfWaterConnection: dataMap.get("numOfWaterConn"),
      //     waterConnectionNo: dataMap.get("waterConnNum"),
      //     diameter: dataMap.get("diameter"),
      //   },
      // ],
      // electricalConnectionDetails: [
      //   {
      //     electricalConnectionTypeID: dataMap.get("electricConnType"),
      //     dateOfElectricalConnection: dataMap.get("dateOfElectricConn"),
      //     electricalConsumerNo: dataMap.get("electricConsumerNum"),
      //   },
      // ],
      // bankDetails: [
      //   {
      //     bankName: dataMap.get("nameOfBank"),
      //     branchName: dataMap.get("branchName"),
      //     accountNo: dataMap.get("bankAccountNo"),
      //   },
      // ],
    }

    console.log("Final Datas", datas)

    //end by Anwar Ansari
    if (activeStep == steps.length - 1) {
      axios
        .post(`${urls.PTAXURL}/transaction/property/save`, datas, {
          headers: {
            role: "CITIZEN",
          },
        })
        .then((res) => {
          console.log("res.status", res.status)
          console.log("datas.applicationNo", datas.applicationNo)
          console.log("data.applicationNumber", data.applicationNumber)
          if (res.status == 201) {
            //data replaced by datas
            data.applicationNumber != ""
              ? swal("Saved!", "Record saved successfully !", "success").then(
                  () => setActiveStep(activeStep + 1)
                )
              : swal("Updated!", "Record updated successfully !", "success")
            //router.push(`/dashboard`);
            // setTimeout(() => {
            //   setActiveStep(activeStep + 1)
            // }, 3000)
          }
        })
        .catch((error) => {
          //alert("Please fill valid data")
          swal({
            text: "Please fill valid data.",
            icon: "warning",
          })
        })
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const isStepfailed = (label) => {
    // const stepArr = [{ ...label }]
    // console.log("label Kya mila", label.props.children.props)
    // console.log("300", methods.formState.errors)

    return Boolean(Object.keys(methods.formState.errors).length)
    // if (
    //   label.props.children.props.id === "applicationInfo" &&
    //   methods.formState.errors.serviceID
    // ) {
    //   return true
    // } else if (label.props.children.props.id === "propertyHolderDetails") {
    //   return true
    // } else if (label.props.children.props.id === "propertyAddressDetails") {
    //   return true
    // } else if (label.props.children.props.id === "propertyInformation") {
    //   return true
    // } else if (label.props.children.props.id === "additionalInfo") {
    //   return true
    // } else {
    //   return false
    // }
  }

  // View
  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          height: "auto",
          overflow: "auto",
          padding: "10px 80px",
        }}
      >
        <Grid
          className={styles.details}
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            padding: "8px",
            fontSize: 22,
            fontWeight: 900,
            borderRadius: 100,
          }}
        >
          <strong>
            <FormattedLabel id="propertyRegistration" />
          </strong>
        </Grid>
      </Box>
      <div>
        <Paper
          sx={{
            // padding: 1,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "#FFFFF",
          }}
          elevation={5}
        >
          {activeStep === steps.length ? (
            <Typography
              variant="h3"
              align="center"
              className={styles.wave}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // width: "60px",
                height: "100px",
                fontSize: "50px",
                color: "green",
                // margin: "10px",
              }}
              // style={{
              //   color: "green",
              //   display: "flex",
              //   justifyContent: "center",
              //   alignItems: "center",
              //   gap: 10,
              //   // borderBottom: "2px solid red",
              // }}
            >
              Thank You For The Registration
              <SentimentSatisfiedAltIcon
                style={{ width: "45px", height: "45px" }}
              />
            </Typography>
          ) : (
            <>
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                connector={<ColorlibConnector />}
              >
                {steps.map((label, index) => {
                  const labelProps = {}
                  const stepProps = {}
                  // console.log("label Kya mila", label.props.children.props)
                  // isStepfailed([label])
                  // if (isStepfailed(label) && activeStep === index) {
                  //   labelProps.error = true
                  // }
                  // if (isStepfailed() && activeStep === index) {
                  //   labelProps.error = true
                  // }

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel
                        {...labelProps}
                        StepIconComponent={ColorlibStepIcon}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>

              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleNext)}
                  sx={{ marginTop: 10 }}
                >
                  {getStepContent(activeStep)}
                  <Stack
                    direction="row"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      startIcon={<ArrowBackIosNewIcon />}
                      disabled={activeStep === 0}
                      // disabled
                      onClick={handleBack}
                      variant="contained"
                      size="medium"
                      style={{ textAlign: "center" }}
                    >
                      <FormattedLabel id="back" />
                    </Button>

                    <Button
                      endIcon={<ArrowForwardIosIcon />}
                      variant="contained"
                      size="medium"
                      type="submit"
                    >
                      {/* {activeStep}== {steps.length - 1} */}
                      {activeStep === steps.length - 1 ? (
                        // <FormattedLabel id="finish" />
                        language === "en" ? (
                          "FINISH"
                        ) : (
                          "पूर्ण करा"
                        )
                      ) : (
                        <FormattedLabel id="saveAndNext" />
                      )}
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </>
          )}
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index

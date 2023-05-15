



import * as yup from "yup";

// schema - validation
let hutMasterSchema = yup.object().shape({
    // gisId: yup.string().required("GIS Id is Required !!!"),
    // hutPrefix: yup.string().required("Hut Prefix is Required !!!"),
    // zoneKey: yup.string().required("Select Zone is Required !!!"),
    // hutNo: yup.string().required("Hut No. is Required"),
    // slumKey: yup.string().required("Select Slum is Required"),
    // areaOfHut: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Area of Hut is Required"),
    // ownershipKey: yup.string().required("Ownership type is Required"),
    // constructionTypeKey: yup.string().required("Construction type is Required"),
    // usageTypeKey: yup.string().required("Usage type is Required"),
    // usageSubTypeKey: yup.string().required("Sub Usage type is Required"),
    // length: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Length is Required"),
    // breadth: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Breadth is Required"),
    // height: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Height is Required"),
    // partNoInList: yup.string().required("Part No in list is Required"),
    // rehabilitation: yup.string().required("Rehabilitaion is Required"),
    // eligibility: yup.string().required("Eligibility Required"),
    // waterConnection: yup.string().required("Water Connection is Required"),
    // noOfFloors: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("No Of Floors is Required"),
    // maleCount: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Male Count is Required"),
    // femaleCount: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Female Count is Required"),
    // totalFamilyMembers: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Total Family Members is Required"),
    // areaKey: yup.string().required("Area is Required"),
    // villageKey: yup.string().required("Village is Required"),
    // cityKey: yup.string().required("City is Required"),
    // pincode: yup.string().matches(/^[0-9]+$/, 'Must be only digits').min(6, 'Pincode must be at least 6 number').max(6, 'Pincode must be at least 6 number'),
    // lattitude: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Latitude is Required"),
    // longitude: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Longitude is Required"),
    // assemblyConstituency: yup.string().required("Assembly Constituency is Required"),
    // correction: yup.string().required("Correction is Required"),
    // remarks: yup.string().required("Remarks is Required"),
});

export default hutMasterSchema;
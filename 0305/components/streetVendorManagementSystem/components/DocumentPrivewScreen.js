import { Button, Grid, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import urls from "../../../URLS/urls";
import UploadButton from "../../fileUpload/UploadButton";

/** Author - Sachin Durge */
//  DocumentPreviewScreen
const DocumentPrivewScreen = () => {
  const { control, register, setValue, getValues } = useFormContext();
  const router = useRouter();
  const [panCardPhoto, setPanCardPhoto] = useState();
  const [aadharPhoto, setAadharPhoto] = useState();
  const [rationCardPhoto, setRationCardPhoto] = useState();
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] = useState();
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState();
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] = useState();
  const [attachedFile, setAttachedFile] = useState(null);
  const [documentRemarkOtpModal, setDocumentOtpModal] = useState(false);
  let attachedFileEdit = null;
  let appName = "HMS";
  let serviceName = "H-IssuanceofHawkerLicense";

  // Approve Button
  const approveButton = () => {
    sendApprovedNotify();
  };

  const documentRemarkModalOpen = () => setDocumentOtpModal(true);
  const documentRemarkModalClose = () => setDocumentOtpModal(false);

  // RevertButton
  const revertButton = () => {
    documentRemarkModalOpen();
  };

  // approvedNotification
  const sendApprovedNotify = () => {
    toast.success("Approved Successfully !!!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // columns
  const columns = [
    {
      field: "srNO",
      headerName: "Sr.No",
      widht: 50,
      align: "center",
    },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 500,
      align: "center",
    },
    {
      field: "documentName1",
      headerName: "Document Name 1",
      width: 500,
      align: "center",
    },
    {
      field: "actions",
      headerName: "viewButton",
      width: 150,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <strong>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  console.log("Yetoy Ka");
                  <a
                    href={`${urls.CFCURL}/file/preview?filePath=${getValues("aadharPhoto")}`}
                    target="__blank"
                  ></a>;
                }}
              >
                View
              </Button>
            </strong>
          </>
        );
      },
    },
  ];

  // const filePreviewButton = (params) => {};
  // if (params.documentName == "Aadhaar Card") {
  //   const filePath = getValues("aadharPhoto");
  // }

  const rows = [
    {
      id: 1,
      srNO: 1,
      documentName: "Aadhaar",
      documentName1: "sdlfks",
    },
    {
      id: 2,
      srNO: 2,
      documentName: "Aadhaar Card",
      documentName1: (
        <UploadButton
          appName="HMS"
          serviceName="H-IssuanceofHawkerLicense"
          filePath={setAadharPhoto}
          fileName={aadharPhoto}
          // fileData={aadhaarCardPhotoData}
        />
      ),
    },
    {
      id: 3,
      srNO: 3,
      documentName: "Aadhaar Card",
      documentName1: (
        <UploadButton
          appName="HMS"
          serviceName="H-IssuanceofHawkerLicense"
          filePath={setAadharPhoto}
          fileName={aadharPhoto}
          // fileData={aadhaarCardPhotoData}
        />
      ),
    },
  ];

  useEffect(() => {
    setAttachedFile(router?.query?.attachedFile);
  }, []);

  useEffect(() => {
    if (router.query.pageMode === "Edit") {
      reset(router.query);
      attachedFileEdit = router.query.attachedFile;
    }
  }, []);

  useEffect(() => {
    // 1
    if (aadharPhoto != null) {
      setValue("aadharPhoto", aadharPhoto);
    }
    if (panCardPhoto != null) {
      setValue("panCardPhoto", panCardPhoto);
    }

    if (rationCardPhoto != null) {
      setValue("rationCardPhoto", rationCardPhoto);
    }

    if (disablityCertificatePhoto != null) {
      setValue("disablityCertificatePhoto", disablityCertificatePhoto);
    }

    if (otherDocumentPhoto != null) {
      setValue("otherDocumentPhoto", otherDocumentPhoto);
    }

    if (affidaviteOnRS100StampAttache != null) {
      setValue("affidaviteOnRS100StampAttache", affidaviteOnRS100StampAttache);
    }

    // 2
    if (getValues("aadharPhoto") != null) {
      setAadharPhoto(getValues("aadharPhoto"));
    }
    if (getValues("panCardPhoto") != null) {
      setPanCardPhoto(getValues("panCardPhoto"));
    }
    if (getValues("rationCardPhoto") != null) {
      setRationCardPhoto(getValues("rationCardPhoto"));
    }
    if (getValues("disablityCertificatePhoto") != null) {
      setDisablityCertificatePhoto(getValues("disablityCertificatePhoto"));
    }
    if (getValues("otherDocumentPhoto") != null) {
      setOtherDocumentPhoto(getValues("otherDocumentPhoto"));
    }
    if (getValues("affidaviteOnRS100StampAttache") != null) {
      seteAffidaviteOnRS100StampAttache(getValues("affidaviteOnRS100StampAttache"));
    }
  }, [
    aadharPhoto,
    panCardPhoto,
    rationCardPhoto,
    disablityCertificatePhoto,
    otherDocumentPhoto,
    affidaviteOnRS100StampAttache,
  ]);

  useEffect(() => {
    console.log("attachedFile", attachedFile);
    setValue("attachedFile", attachedFile);
  }, [attachedFile]);

  // View
  return (
    <>
      <ToastContainer />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        density="standard"
        sx={{
          m: 5,
          overflowY: "scroll",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .mui-style-f3jnds-MuiDataGrid-columnHeaders": {
            backgroundColor: "#556CD6",
            color: "white",
          },
        }}
      />
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Stack direction="row" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => approveButton()}>Approve</Button>
            <Button onClick={() => revertButton()}>Revert</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default DocumentPrivewScreen;

import { Add } from "@mui/icons-material"
import { Box, Button, Grid, IconButton, Modal, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import UploadButton from "./UploadButton"
import styles from "../../../components/grievanceMonitoring/view.module.css"

const FileTable = (props) => {
  let filePath = {}
  const [label, setLabel] = useState("")
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const [inableDisabled, setinableDiabled] = useState()
  const [btnInputStateDemandBill, setBtnInputStateDemandBill] = useState(true)
  /////////////////////////CONST USER FOR THE PREVIOUS KEYS////////////////////////

  const user = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id)
    return state?.user?.user?.userDao?.id
  })

  const userCitizen = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id)
    return state?.user?.user?.id
  })

  const userCFC = useSelector((state) => {
    console.log("userDetails", state?.user?.user?.userDao?.id)
    return state?.user?.user?.id
  })

  const logedInUser = localStorage.getItem("loggedInUser")

  const handelParams = (key) => {
    if (key === "departmentUser") {
      return user
    } else if (key === "citizenUser") {
      return userCitizen
    } else if (key === "cfcUser") {
      return userCFC
    }
  }

  /////////////////////////////////////////////////////////////////////////////////

  function temp(arg) {
    filePath = arg
  }

  const handleClose = () => {

    props.newFilesFn((oldElements) => {
      return [
        ...oldElements,
        {
          id: props.rows.length + 1,
          applicantKey: handelParams(logedInUser),
          documentKey: new Date().getTime(),
          documentPath: filePath?.filePath,
          documentType: filePath?.extension.split(".")[1].toUpperCase(),
          attachedDate: new Date(),
          originalFileName: filePath?.filePath.split("/").pop().split("_").pop(),
        },
      ]
    })
    props.filePath("")
    props.uploading(false)
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "white",
    boxShadow: 10,
    p: 2,
  }

  // useEffect
  useEffect(() => {
    // setBtnInputStateDemandBill(true);
    if (localStorage.getItem("btnInputStateDemandBill") == "false") {
      setBtnInputStateDemandBill(localStorage.getItem(false))
    } else {
      setBtnInputStateDemandBill(true)
    }
  }, [])

  // useEffect
  useEffect(() => { }, [btnInputStateDemandBill])

  // View
  return (
    <>
      <div>
        <Grid
          container
          style={{ padding: "10px", backgroundColor: "lightblue" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            item
            xs={10}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <Typography
              sx={{ fontWeight: 800, marginLeft: "20%" }}
              className={styles.fancy_link1}
            >
              <FormattedLabel id="uploadDoc" />
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "end" }}
          >
            <Button
              variant="contained"
              endIcon={<Add />}
              type="button"
              color="primary"
              onClick={handleOpen}
              size="small"
            >
              {<FormattedLabel id="addDoc" />}
            </Button>
          </Grid>
        </Grid>

        <DataGrid
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
          // disableSelectionOnClick
          rows={props.rows}
          columns={props.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>


      <Modal
        open={(props.fileLabel ? true : false) || open}
        onClose={() => {
          setOpen(false)
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "15%",
        }}
      >
        <Box
          sx={{
            width: "30%",
            backgroundColor: "white",
            height: "50%",
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5%",
              }}
              className={styles.details1}
            >
              <Typography
                sx={{
                  fontWeight: "bolder",
                  fontSize: "large",
                  textTransform: "capitalize",
                }}
                className={styles.fancy_link1}
              >
                <FormattedLabel id="fileUpload" />
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UploadButton
                appName={props.appName}
                serviceName={props.serviceName}
                filePath={temp}
                fileName={props.fileName}
                fileLabel={setLabel}
                handleClose={handleClose}
                uploading={props.uploading}
                modalState={setOpen}
              />
            </Grid>
            <div
              variant="contained"

            >
              <FormattedLabel id="fileSize" />
            </div>
            <div
              variant="contained"

            >
              <FormattedLabel id="fileExtension" />
            </div>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setOpen(false)
                }}
                size="small"
              >
                <FormattedLabel id="cancel" />
                
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}
export default FileTable

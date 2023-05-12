import { Add, Delete, FileUpload } from "@mui/icons-material";
import { useEffect } from "react";
import { Button, IconButton, Input, TextField } from "@mui/material";
import React, { useState } from "react";
// import style from '../FileUpload/upload.module.css'
import style from "../../LegalCase";
import axios from "axios";
import swal from "sweetalert";
import urls from "../../../URLS/urls";


const UploadButton = (props) => {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");


  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);


  useEffect(() => {
    // props.fileLabel(fileName)
  }, [fileName]);


  useEffect(() => {
    props.filePath(filePath);
  }, [filePath]);


  const handleFile = (e) => {
    props.modalState(false);
    props.uploading(true);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    formData.append("fileName", fileName);
    console.log(
      "formData",
      e.target.files[0],
      props.appName,
      props.serviceName,
      fileName
    );
    // axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
      axios.post(`${urls.CFCURL}/file/uploadWithFileName`, formData).then((r) => {
        console.log("response from file upload",r);
      setFilePath(r.data.filePath);
      props.filePath(r.data);
      props.handleClose();
    });
  };


  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {!filePath && (
        <TextField
          sx={{
            width: 200,
            // marginBottom: '5px'
          }}
          onChange={(e) => {
            setFileName(e.target.value);
            // props.setFileLabel(e.target.value)
          }}
          id="standard-basic"
          label="File Name"
          variant="standard"
          value={fileName}
        />
      )}
      <label className={style.uploadButton}>
        {!filePath && (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              if (!fileName) {
                swal({
                  text: "Please enter file name first ",
                  icon: "warning",
                });
              }
            }}
          >
            <Button
              startIcon={<FileUpload />}
              variant="contained"
              component="label"
            >
              Upload
              <input
                disabled={!fileName ? true : false}
                type="file"
                onChange={(e) => {
                  handleFile(e);
                }}
                hidden
              />
            </Button>
            {/*
            // <Add
            <FileUpload
              color='secondary'
              sx={{
                width: 30,
                height: 30,
                border: '1.4px dashed #9c27b0',
                marginRight: 1.5,
              }}
            />
            <input
              disabled={!fileName ? true : false}
              type='file'
              onChange={(e) => {
                handleFile(e)
              }}
              hidden
            />
            <span
              className={style.fileName}
              onClick={() => {
                if (!fileName) {
                  swal({
                    text: 'Please enter file name first ',
                    icon: 'warning',
                  })
                }
              }}
            >
              Attach File
            </span> */}
          </div>
        )}
      </label>
    </div>
  );
};
export default UploadButton;
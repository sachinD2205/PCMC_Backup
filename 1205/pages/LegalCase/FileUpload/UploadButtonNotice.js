import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import urls from "../../../URLS/urls";
import style from "..";

const UploadButtonNotice = (props) => {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [activeFlag, setActiveFlag] = useState("");

  useEffect(() => {
    console.log("propsUploadButtonNotice", props);
    if (props?.fileName) {
      setFilePath(props.fileName);
      setActiveFlag(props.activeFlag);
    }
  }, [props?.fileName]);

  useEffect(() => {
    // props.fileLabel(fileName)
  }, [fileName]);

  useEffect(() => {
    // props.filePath(filePath)
  }, [filePath]);

  const handleFile = (e) => {
    console.log("756", e, props);
    console.log("fileName", fileName);
    props.modalState(false);
    props.uploading(true);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    formData.append("fileName", fileName);
    axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
      setFilePath(r.data.filePath);
      props.filePath(r.data);
      props.activeFlag("Y");
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
            <Button startIcon={<FileUpload />} variant="contained" component="label">
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
          </div>
        )}
      </label>
    </div>
  );
};
export default UploadButtonNotice;

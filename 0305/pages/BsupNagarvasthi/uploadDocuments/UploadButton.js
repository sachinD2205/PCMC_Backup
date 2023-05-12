import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import style from "../../LegalCase";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState("");


  const handleFile = (e) => {
    props.modalState(false);
    props.uploading(true);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", null);
    formData.append("serviceName", props.serviceName);

    axios.post(`${urls.CFCURL}/file/upload`, formData).then((r) => {
      setFilePath(r.data.filePath);
      props.filePath(r.data);
      props.handleClose();
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        marginTop: "20px",
        gap: 20,
      }}
    >

      <label className={style.uploadButton}>
        {!filePath && (
          <div>
            <Button endIcon={<FileUpload />} variant="contained" component="label" size="small">
              <FormattedLabel id="upload" />
              <input
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
export default UploadButton;

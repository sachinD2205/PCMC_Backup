// import React from "react";

// const PrapatraUpload = () => {
//   return <div>PrapatraUpload</div>;
// };

// export default PrapatraUpload;

import React, { useState } from "react";
import axios from "axios";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import URLs from "../../../URLS/urls";
import sweetAlert from "sweetalert";

import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

const PrapatraUpload = ({ appName, serviceName, label, filePath, fileUpdater, view = false }) => {
  const [fileNameOrig, setFileNameOrig] = useState(null);

  const handleFile = (event) => {
    if (event.target.files) {
      console.log("FILE SIZE: ", event.target.files[0]);
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios
        .post(`${URLs.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`, formData)
        .then((r) => {
          if (r.status === 200) {
            fileUpdater(r?.data?.filePath);
            setFileNameOrig(r?.data?.fileName);
          }
        });
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 20,
            // flexDirection: 'column',
            // rowGap: 10,
            width: "max-content",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "medium", fontWeight: "bold" }}>{label} :</span>
          {!filePath && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Add
                sx={{
                  width: 30,
                  height: 30,
                  border: "1.5px dashed #1976d2",
                  color: "#1976d2",
                  marginRight: 1.5,
                }}
              />

              <input
                id="uploadButton"
                type="file"
                onChange={(e) => {
                  // @ts-ignore
                  if (e.target.files[0]) {
                    // @ts-ignore
                    if (e.target.files[0].size > 5 * 1024 * 1024) {
                      sweetAlert(
                        "Error!",
                        "Please upload file (PDF/JPG/JPEG/PNG) with size less than 5MB !",
                        "error",
                      );
                      e.target.value = "";
                    } else if (
                      e.target.files[0]?.type === "application/docx" ||
                      e.target.files[0]?.type === "application/pdf" ||
                      e.target.files[0]?.type === "application/docm" ||
                      e.target.files[0]?.type === "application/dot" ||
                      e.target.files[0]?.type === "application/wps" ||
                      e.target.files[0]?.type === "application/x-msdownload" ||
                      e.target.files[0]?.type === "application/xml" ||
                      e.target.files[0]?.type === "application/xps" ||
                      e.target.files[0]?.type === "application/rtf" ||
                      e.target.files[0]?.type === "application/txt" ||
                      e.target.files[0]?.type === "application/msword"
                    ) {
                      handleFile(e);
                    } else {
                      sweetAlert("Error!", "You can only upload word files", "error");
                    }
                  }
                }}
                // required
                hidden
              />
              <span
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 12,
                  color: "#1976d2",
                }}
              >
                {<FormattedLabel id="addFile" />}
              </span>
            </div>
          )}
          {filePath && (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  window.open(`${URLs.CFCURL}/file/preview?filePath=${filePath}`, "_blank");
                }}
              >
                {/* {<FormattedLabel id="preview" />} */}
                {fileNameOrig !== null ? fileNameOrig : "prapatra"}
              </Button>
              {!view && (
                <IconButton
                  onClick={() => {
                    axios.delete(`${URLs.CFCURL}/file/discard?filePath=${filePath}`).then((res) => {
                      if (res.status === 200) {
                        fileUpdater("");
                      }
                    });
                  }}
                >
                  <Delete color="error" />
                </IconButton>
              )}
            </div>
          )}
        </label>
      </div>
    </>
  );
};

export default PrapatraUpload;

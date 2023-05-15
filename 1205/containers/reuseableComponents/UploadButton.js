import React from "react";
import axios from "axios";
import URLs from "../../URLS/urls";
import sweetAlert from "sweetalert";

import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const UploadButton = ({
  appName,
  serviceName,
  label,
  filePath,
  fileUpdater,
  view = false,
  onlyImage = false,
  onlyPDF = false,
  imageAndPDF = false,
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const imageFormats = ["image/jpeg", "image/jpg", "image/png"];

  const fileUpload = (fileData) => {
    let formData = new FormData();
    formData.append("file", fileData);
    axios
      .post(`${URLs.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`, formData)
      .then((r) => {
        if (r.status === 200) {
          fileUpdater(r.data.filePath);
        }
      });
  };

  const handleFile = (event) => {
    console.log("FILE SIZE: ", event.target.files[0]);

    if (event.target.files) {
      if (onlyPDF) {
        if (event.target.files[0].type == "application/pdf") {
          fileUpload(event.target.files[0]);
          console.log("Only pdf uploader");
        } else {
          sweetAlert("Error!", "Please upload PDF files with size less than 2MB!", "error");
        }
      } else if (onlyImage) {
        if (imageFormats.includes(event.target.files[0].type)) {
          fileUpload(event.target.files[0]);
          console.log("Only image uploader");
        } else {
          sweetAlert("Error!", "Please upload JPEG/JPG/PNG files with size less than 2MB!", "error");
        }
      } else if (imageAndPDF) {
        if (
          event.target.files[0].type == "application/pdf" ||
          imageFormats.includes(event.target.files[0].type)
        ) {
          fileUpload(event.target.files[0]);
          console.log("Image and PDF uploader");
        } else {
          sweetAlert("Error!", "Please upload JPEG/JPG/PNG/PDF files with size less than 2MB!", "error");
        }
      } else {
        console.log("All uploader");
        fileUpload(event.target.files[0]);
      }
    }
  };

  return (
    <div
    // style={{ display: "flex", flexDirection: "column" }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 20,
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
                    if (e.target.files[0].size > 2097152) {
                      sweetAlert(
                        "Error!",
                        "Please upload file (PDF/JPG/JPEG/PNG) with size less than 2MB !",
                        "error",
                      );
                      e.target.value = "";
                    } else {
                      handleFile(e);
                    }
                  }
                }}
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
                {language === "en" ? "Add File" : "फाइल जोडा"}
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
                {language === "en" ? "Preview" : "पूर्वावलोकन"}
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
    </div>
  );
};

export default UploadButton;
import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import style from "./upload.module.css";
import axios from "axios";
import urls from "../../URLS/urls";
import swal from "sweetalert";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  console.log("1234", filePath);

  useEffect(() => {
    console.log("sachin", props);
  }, [props]);
  useEffect(() => {
    console.log("props.filePath <->", props);
    if (props?.fileName) {
      setFilePath(props?.fileName);
      console.log("props.fileName", props.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);
    axios.post(`${urls.CFCURL}/file/upload`, formData)
      .then((r) => {
        setFilePath(r.data.filePath);
        props?.filePath(r.data.filePath);
      })
      .catch((err) => {
        console.log("upload error",err);
        swal('Error!', 'Enter valid File Format !', 'error')
      })
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  const discard = async (e, filePath) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`)
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), setDeletedFile(filePath), props?.filePath(null);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!filePath && (
          <>
            <Add
              color='secondary'
              sx={{
                width: 30,
                height: 30,
                border: "1.4px dashed #9c27b0",
                marginRight: 1.5,
              }}
            />
            <input
              type='file'
              onChange={(e) => {
                handleFile(e);
              }}
              hidden
            />
          </>
        )}
        {filePath ? (
          <a
            href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
            target='__blank'
          >
            {showFileName(filePath)}
          </a>
        ) : (
          <span className={style.fileName}><FormattedLabel id="addFile"/></span>
        )}
      </label>
      {filePath && (
        <IconButton
          onClick={(e) => {
            discard(
              e, filePath
            ); /* setFilePath(null),props.filePath(null),discardFile() */
          }}
        >
          <Delete color='error' />
        </IconButton>
      )}
    </div>
  );
};
export default UploadButton;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import sweetAlert from "sweetalert";

const FormattedLabel = ({ id, required = false }) => {
  const router = useRouter();
  // @ts-ignore
  const labels = useSelector((state) => state?.labels.labels);
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  const path = router.asPath.split("/");

  const [value, setValue] = useState("");

  useEffect(() => {
    findLabel();
  }, [language]);

  function findLabel() {
    if (labels[path[1]]) {
      setValue(labels[path[1]][language][id]);
    } else {
      sweetAlert(
        "Error",
        "The module you are working upon is not registered in the labels file or named incorrectly which may result in improper displaying of english/marathi labels.  Please check and try again.",
        "error",
      );
    }
  }
  if (required) {
    return (
      <>
        {value + " "} <span style={{ color: "red", fontWeight: "bold" }}>*</span>
      </>
    );
  } else {
    return <>{value}</>;
  }
};

export default FormattedLabel;

// import {
//   FilledInput,
//   Grid,
//   Input,
//   OutlinedInput,
//   Paper,
//   TextareaAutosize,
//   TextField,
// } from "@mui/material";
// import { Button } from "antd";
// import styles from "./view.module.css";
// import React from "react";
// import { Controller, useFormContext, useFieldArray } from "react-hook-form";
// import { Box } from "@mui/system";
// import FormControl, { useFormControl } from "@mui/material/FormControl";
// const ParawiseReportAdd = () => {
//   const {
//     control,
//     register,
//     reset,
//     formState: { errors },
//   } = useFormContext();

//   //key={field.id}
//   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
//     {
//       control, // control props comes from useForm (optional: if you are using FormContext)
//       name: "parawiseReportDao", // unique name for your Field Array
//     }
//   );

//   return (
//     <>
//       <Grid
//         container
//         style={{ marginLeft: 20 }}
//         spacing={{ xs: 2, md: 3 }}
//         columns={{ xs: 4, sm: 8, md: 12 }}
//       >
//         <Grid item xs={0.5}></Grid>
//         <Grid item xs={2}>
//           <h3>Sr. No</h3>
//         </Grid>
//         <Grid item xs={2}>
//           <h3>Point No</h3>
//         </Grid>
//         <Grid item xs={2}>
//           <h3>Points Exp</h3>
//         </Grid>
//         <Grid item xs={2}>
//           <Button
//             onClick={() =>
//               append({
//                 srNO: "",
//                 issueNo: "",
//                 paragraphWiseAanswerDraftOfIssues: "",
//               })
//             }
//           >
//             {/* Add */}+
//           </Button>
//         </Grid>
//       </Grid>
//       {fields.map((parawise, index) => {
//         return (
//           <>
//             <Grid container>
//               <Grid item xs={0.5}></Grid>
//               <Grid item xs={0.1}>
//                 <input
//                   helperText=""
//                   id="demo-helper-text-aligned"
//                   // label="Sr.NO"
//                   {...register(`parawiseReportDao.${index}.srNO`)}
//                 />
//               </Grid>
//               <Grid item xs={2}></Grid>
//               <Grid item xs={1}>
//                 <input
//                   // sx={{ width: 200 }}
//                   id="standard-basic"
//                   label="Issue No *"
//                   variant="outlined"
//                   {...register(`parawiseReportDao.${index}.issueNo`)}
//                   // error={!!errors.issueNo}
//                   // helperText={errors?.issueNo ? errors.issueNo.message : null}
//                 />
//               </Grid>
//               <Grid item xs={1}></Grid>
//               <Grid item xs={2}>
//                 <TextareaAutosize
//                   sx={{ width: 550 }}
//                   id="standard-basic"
//                   label="Paragraph Wise Aanswer Draft Of Issues *"
//                   variant="outlined"
//                   {...register(
//                     `parawiseReportDao.${index}.paragraphWiseAanswerDraftOfIssues`
//                   )}
//                   // error={!!errors.paragraphWiseAanswerDraftOfIssues}
//                   // helperText={
//                   //   errors?.paragraphWiseAanswerDraftOfIssues
//                   //     ? errors.paragraphWiseAanswerDraftOfIssues.message
//                   //     : null
//                   // }
//                 />
//               </Grid>
//             </Grid>
//           </>
//         );
//       })}
//     </>
//   );
// };

// export default ParawiseReportAdd;

import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { TextField } from "@mui/material";

export default function VerticalDividers() {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          bgcolor: "background.paper",
          color: "text.secondary",
          "& svg": {
            m: 1.5,
          },
          "& hr": {
            mx: 0.5,
          },
        }}
      >
        {/* <FormatAlignLeftIcon />

        <Divider orientation="vertical" flexItem />
        <FormatBoldIcon /> */}

        {/* New Exp */}
      </Box>
    </div>
  );
}

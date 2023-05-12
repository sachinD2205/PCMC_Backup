import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
    wardKey: yup.string().required("Ward name is Required !!!"),
    departmentKey: yup.string().required("Department name is Required !!!"),
    priority: yup.string().required("Priority is Required !!!"),
    newsPaper: yup.string().required("News Paper name is Required !!!"),
    pressNoteReleaseDate:
        yup.date()
            .typeError("Enter Valid Date !!!")
            .required("Press Note Release Date is Required !!!"),
    pressNoteSubject: yup.string().required("Press Note Subject is Required !!!"),
    pressNoteDescription: yup.string().required("Press Note Description is Required !!!"),
});

export default Schema;
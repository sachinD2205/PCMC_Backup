import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let refundDepositSchema = yup.object().shape({
    libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
    membershipNo: yup.string().required(<FormattedLabel id="membershipNo" />),
    bankAccountHolderName: yup.string().required(<FormattedLabel id="enterBankAccountHolderName" />),
    bankaAccountNo: yup.string().required(<FormattedLabel id="enterBankAccountNo" />),
    typeOfBankAccount: yup.string().required(<FormattedLabel id="selectBankAccount" />),
    bankNameId: yup.string().required(<FormattedLabel id="selectBankName" />),
    bankAddress: yup.string().required(<FormattedLabel id="enterBankAddress" />),
    ifscCode: yup.string().required(<FormattedLabel id="enterBankIFSC" />),
    micrCode: yup.string().required(<FormattedLabel id="enterBankMICR" />),

})
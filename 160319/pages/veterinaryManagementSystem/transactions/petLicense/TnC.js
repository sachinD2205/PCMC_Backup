import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./vet.module.css";
import URLs from "../../../../URLS/urls";

import FormControl from "@mui/material/FormControl";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Checkbox, FormHelperText, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import axios from "axios";
import { ExitToApp } from "@mui/icons-material";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [TnC, setTnC] = useState(false);
  const [pet, setPet] = useState("");
  const [petAnimal, setPetAnimal] = useState([{ id: 1, nameEn: "", nameMr: "" }]);

  let petSchema = yup.object().shape({
    petAnimalKey: yup.number().required("Please select a pet"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(petSchema),
  });

  useEffect(() => {
    //Get Pet Animals
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) => {
      setPetAnimal(
        res.data.mstPetAnimalList.map((j, i) => ({
          srNo: i + 1,
          id: j.id,
          nameEn: j.nameEn,
          nameMr: j.nameMr,
        })),
      );
    });
  }, []);

  const finalSubmit = (data) => {
    router.push({
      pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
      query: { petAnimal: data.petAnimalKey },
    });
  };

  return (
    <>
      <Head>
        <title>Pet License - Terms and Condition</title>
      </Head>
      <Paper className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id='petLicense' />
        </div> */}
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row} style={{ justifyContent: "center" }}>
            <FormControl variant="standard" error={!!error.petAnimalKey}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="petAnimal" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      setPet(petAnimal.find((obj) => obj.id === value.target.value)?.nameEn + "");
                      field.onChange(value);
                    }}
                    label="petAnimalKey"
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === "en" ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="petAnimalKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{error?.petAnimalKey ? error.petAnimalKey.message : null}</FormHelperText>
            </FormControl>
          </div>
          {pet && (
            <>
              <div className={styles.row}>
                <label className={styles.subHeader}>Terms and Condition</label>
              </div>
              {pet == "Dog" && (
                <div className={styles.terms}>
                  <label>
                    Citizens coming to obtain pet license will be required to follow all general terms ,
                    conditions and rules as follows.
                  </label>
                  <ol>
                    <li>
                      The legal term of this license is one year from the date of issue of the license and it
                      shall be mandatory to renew it annually.
                    </li>
                    <li>
                      License will be issued subject to terms and conditions after payment of fees decided by
                      Hon'ble Municipal Commissioner from time to time.
                    </li>
                    <li>
                      The license holder shall carry the license obtained with him and shall produce the same
                      on demand by the Hon'ble Municipal Commissioner or the authorized officer appointed by
                      him.
                    </li>
                    <li>
                      If a dog to which a license has been issued is found to have been bitten or scratched by
                      a fox or any other animal suspected to have been bitten, the holder of such license
                      shall report the matter in writing. The veterinary department of Chinchwad Municipal
                      Corporation should be informed immediately.
                    </li>
                    <li>
                      If a licensed dog is known or suspected to be neutered, if it has been bitten or
                      scratched by a dog, fox or other animal suspected of being neutered, the licensee shall
                      produce the dog himself for examination at the Veterinary Hospital or alternatively The
                      licensee shall at his own cost keep the said dog under the supervision of the animal
                      clinic for such period as may be necessary.
                    </li>
                    <li>
                      If the veterinary officer is of the opinion that the dog which has been licensed and is
                      crushed, further action will be taken by the municipality.
                    </li>
                    <li>Rabies vaccination of dogs shall remain compulsory.</li>
                    <li>
                      The license holder should not let the dog loose in public places or on the road. Also,
                      if the license holder feels that the dog is likely to cause injury to others, he should
                      take care to muzzle the said dog.
                    </li>
                    <li>
                      In terms of public health and environment, the license holder should take care that his
                      dog does not create any kind of dirt, otherwise according to Hon'ble Municipal Assembly
                      Resolution No. 728 dated 18/11/2021, the dog owner will be charged Rs. Only) so much
                      penalty will be imposed .
                    </li>
                    <li>
                      Do not leave your dog (unchained) in public places ,crowded and traffic places , in
                      public gardens . Also, you should take care not to disturb the citizens by barking or
                      running over them and biting them.
                    </li>
                    <li>
                      The rules and provisions of the Bombay Provincial M.N.P. Act, 1949 ,Chapter Appendix 14
                      Rule 22 including Section 386 (1) of the Dog Tax Bye-law shall remain binding on license
                      holders.
                    </li>
                    <li>
                      No person shall keep a dog unless he obtains a license under the Bombay Provincial
                      Municipal Act, 1949 Chapter Appendix 14 Rule 22 (1 )( a). But if the license has been
                      obtained and not renewed, the person concerned will be deemed to have kept a dog without
                      a license and be liable to penal action under the said rule.
                    </li>
                    <li>
                      . After obtaining the said licence, if a complaint is received by the MNP on the grounds
                      of human health and public hygiene, the MNP reserves the right to take appropriate
                      action and/or cancel the license given considering the seriousness of the complaint.
                      have been retained by
                    </li>
                  </ol>
                </div>
              )}
              {pet == "Cat" && (
                <div className={styles.terms}>
                  <ol>
                    <li>
                      The legal term of this license is one year from the date of issue of the license and it
                      shall be mandatory to renew it annually.
                    </li>
                    <li>
                      License will be issued subject to terms and conditions after payment of fees decided by
                      Hon'ble Municipal Commissioner from time to time.
                    </li>
                    <li>
                      The license holder shall carry the license obtained with him and shall produce the same
                      on demand by the Hon'ble Municipal Commissioner or the authorized officer appointed by
                      him.
                    </li>
                    <li>Rabies vaccination of cats will remain mandatory.</li>
                    <li>
                      The license holder should not let the cat loose in the public place or on the road.
                      Also, care should be taken to ensure that the said cat does not hurt others.
                    </li>
                    <li>
                      In terms of public health and environment, the license holder should ensure that his cat
                      does not create any kind of pollution.
                    </li>
                    <li>Care should be taken that there is no nuisance from the cat.</li>
                    <li>
                      The rules and provisions contained in Section 386 (1) of the Bombay Provincial M.P. Act,
                      1949 ,Chapter Appendix 14 Rule 22 shall remain binding on the license holders.
                    </li>
                    <li>
                      No person shall keep a cat unless he obtains a license under Bombay Provincial Municipal
                      Act 1949 Chapter Appendix 14 Rule 22 (1 )( a). But if the license has been obtained and
                      not renewed, the concerned person will be deemed to have kept a cat without a license
                      and will be eligible for action under the said rule.
                    </li>
                    <li>
                      After obtaining the said licence, if a complaint is received by the MNP on the grounds
                      of human health and public hygiene, the MNP reserves the right to take appropriate
                      action and/or cancel the license and levy a fee as mentioned in the said case, keeping
                      in mind the seriousness of the complaint. Online licensing of cats should be allowed
                      subject to terms and conditions.
                    </li>
                  </ol>
                </div>
              )}
              <div className={styles.row} style={{ justifyContent: "center", columnGap: 10 }}>
                <Checkbox
                  onChange={() => {
                    setTnC(!TnC);
                  }}
                />
                <span>I have read and agreed to all the terms and conditions</span>
              </div>
              <div className={styles.row} style={{ justifyContent: "space-evenly" }}>
                <Button disabled={!TnC} variant="contained" color="success" type="submit">
                  <FormattedLabel id="agreeAndNext" />
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <FormattedLabel id="back" />
                </Button>
              </div>
            </>
          )}
        </form>
      </Paper>
    </>
  );
};

export default Index;

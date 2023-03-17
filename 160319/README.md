## Getting Started

## Sachin Durge 🥇

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

//doc checklist

 <div className={styles.small}>
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '6px',
                }}
              >
                {<FormattedLabel id="groomDetail" />}
              </h3>
            </div>
          </div>

          <h4
            style={{
              marginLeft: '40px',
              color: 'red',
              fontStyle: 'italic',
              marginTop: '25px',
            }}
          >
            {<FormattedLabel id="docNote" />}
          </h4>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="DBProof" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gAgeProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" />}
                  {/* Birth Proof Document */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gAgeProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gAgeProofDocumentKey
                    ? errors.gAgeProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "gAgeProofDocument");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="ResProof" />} *</Typography>
            </div>

            <div>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gResidentialDocumentKey.gResidentialDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gResidentialDocumentKey
                    ? errors.gResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "gResidentialProofDocument");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGResidentialProofDocument}
                fileDtl={gResidentialProofDocument}
                // fileKey={getValues("gResidentialDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="IdProof" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gIdProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="IdDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 3)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gIdProofDocumentKey.gIdProofDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gIdProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gIdProofDocumentKey
                    ? errors.gIdProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "gResidentialProofDocument");
      }}
    /> */}
              {/* <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGIdDocumentKeyDtl}
                fileDtl={gIdDocumentKeyDtl}
                // fileKey={getValues("gIdProofDocumentKey")}
                showDel={false}
              /> */}
            </div>

            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          {/* bride deatils */}
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="brideDetails" />}
              </h3>
            </div>
          </div>
          <h4
            style={{
              marginLeft: '40px',
              color: 'red',
              fontStyle: 'italic',
              marginTop: '25px',
            }}
          >
            {<FormattedLabel id="docNote" />}
          </h4>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="DBProof" />} *</Typography>
            </div>

            <div>
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.bAgeProofDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="AgeDocument" />}
                  {/* Birth Proof Document */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Age Proof"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 2)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {bAgeProofDocumentKey.bAgeProofDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bAgeProofDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bAgeProofDocumentKey
                    ? errors.bAgeProofDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "bAgeProofDocument");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setBAgeProofDocument}
                fileDtl={bAgeProofDocument}
                // fileKey={getValues("bAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="ResProof" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.bResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {bResidentialDocumentKey.bResidentialDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="bResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bResidentialDocumentKey
                    ? errors.bResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "bResidentialProofDocument");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="IdProof" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.gIdDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="IdDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="ID Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 3)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {gIdDocumentKey.gIdDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="gIdDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gIdDocumentKey
                    ? errors.gIdDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "gResidentialProofDocument");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          {/* prist details */}
          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="priestDetails" />}
              </h3>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="ResProof" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors.pResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {pResidentialDocumentKey.pResidentialDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="pResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.pResidentialDocumentKey
                    ? errors.pResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "pDocument");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          {/* witness */}

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="witnessDetails" />}
              </h3>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="ResProofW1" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wFResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                              {/* {wFResidentialDocumentKey.wFResidentialDocumentKey} */}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wFResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wFResidentialDocumentKey
                    ? errors.wFResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "wFResedentialDocumentPhoto");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="ResProofW2" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wSResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      //label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {wSResidentialDocumentKey.wSResidentialDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wSResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wSResidentialDocumentKey
                    ? errors.wSResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "wSResedentialDocumentPhoto");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="ResProofW3" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                error={!!errors.wTResidentialDocumentKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="residentialDocument" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label=" Residential Document"
                    >
                      {document &&
                        document
                          .filter((documentKey) => {
                            if (documentKey.documentType === 1)
                              return documentKey
                          })
                          .map((documentKey, index) => (
                            <MenuItem key={index} value={documentKey.id}>
                              {/* {wTResidentialDocumentKey.wTResidentialDocumentKey} */}
                              {language == 'en'
                                ? documentKey?.documentChecklistEn
                                : documentKey?.documentChecklistMr}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                  name="wTResidentialDocumentKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wTResidentialDocumentKey
                    ? errors.wTResidentialDocumentKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "wTResedentialDocumentPhoto");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="male"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="marrigeRelatedDoc" />}
              </h3>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="invetaionCard" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <TextField
                id="standard-basic"
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" />}
                variant="standard"
                {...register('uInvitationCard')}
                error={!!errors.uInvitationCard}
                helperText={
                  errors?.uInvitationCard
                    ? errors.uInvitationCard.message
                    : null
                }
              />
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "invitationProof");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography> {<FormattedLabel id="marrigePhotoC" />}*</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <TextField
                id="standard-basic"
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" />}
                variant="standard"
                {...register('uMarrigePhoto')}
                error={!!errors.uMarrigePhoto}
                helperText={
                  errors?.uMarrigePhoto ? errors.uMarrigePhoto.message : null
                }
              />
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "marrigephoto"); //marrigephoto
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>

            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="marDrf" />} *</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <TextField
                id="standard-basic"
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" />}
                variant="standard"
                {...register('uStampDetail')}
                error={!!errors.uStampDetail}
                helperText={
                  errors?.uStampDetail ? errors.uStampDetail.message : null
                }
              />
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "StampDetailPhoto"); //StampDetailPhoto
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: 'white',
                  marginTop: '7px',
                }}
              >
                {<FormattedLabel id="otherDetail" />}
              </h3>
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="DivorcePaper" />} </Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <TextField
                id="standard-basic"
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" />}
                variant="standard"
                {...register('uDivorcePaper')}
                error={!!errors.uDivorcePaper}
                helperText={
                  errors?.uDivorcePaper ? errors.uDivorcePaper.message : null
                }
              />
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "divorceCertificate");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>{<FormattedLabel id="DeathC" />}</Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <TextField
                id="standard-basic"
                // label="Enter Document"
                label={<FormattedLabel id="enterDoc" />}
                variant="standard"
                {...register('uDeathcer')}
                error={!!errors.uDeathcer}
                helperText={errors?.uDeathcer ? errors.uDeathcer.message : null}
              />
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "dateCertificate");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
</div> */}
          </div>

          <div className={styles.row1}>
            <div className={styles.srow} style={{ marginTop: '30px' }}>
              <Typography>
                {<FormattedLabel id="certiByReligiousPlc" />}
              </Typography>
            </div>

            <div
            // style={{ marginLeft: '50px' }}
            >
              <TextField
                id="standard-basic"
                //   label="Enter Document"
                label={<FormattedLabel id="enterDoc" />}
                variant="standard"
                {...register('uCertiReligiouc')}
                error={!!errors.uCertiReligiouc}
                helperText={
                  errors?.uCertiReligiouc
                    ? errors.uCertiReligiouc.message
                    : null
                }
              />
            </div>

            <div style={{ marginLeft: '50px', marginTop: '25px' }}>
              {/* <UploadButton
      Change={(e) => {
        handleFile1(e, "religionCertificatePhoto");
      }}
    /> */}
              <UploadButton
                appName={appName}
                serviceName={serviceName}
                filePath={setGAgeProofDocument}
                fileDtl={gAgeProofDocument}
                // fileKey={getValues("gAgeProofDocumentKey")}
                showDel={false}
              />
            </div>
            {/* <div

className={styles.radiobuttonAprv}
style={{ marginLeft: '50px' }}

> <FormControl sx={{ flexDirection: 'row' }}>

    <RadioGroup
      row
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="row-radio-button-group"
    >
      <FormControlLabel
        sx={{ marginLeft: '30px' }}
        value="yes"
        control={<Radio />}
        label="Yes"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
      <FormControlLabel
        value="no"
        control={<Radio />}
        label="No"
        name="RadioButton"
        {...register('radioButton')}
        error={!!errors.radioButton}
        helperText={
          errors?.radioButton
            ? errors.radioButton.message
            : null
        }
      />
    </RadioGroup>

  </FormControl>
      </div> */}
          </div>
          <div className={styles.apprve} style={{ marginTop: '25px' }}>
            <Button
              variant="contained"
              endIcon={<NextPlanIcon />}
              color="success"
              onClick={() => {
                setmodalforAprov(true)
              }}
            >
              Action
            </Button>

            <Button
              variant="contained"
              endIcon={<CloseIcon />}
              color="error"
              // onClick={() => {
              //   setmodalforRejt(true)
              // }}
            >
              exit
            </Button>
          </div>
          {/* remark button */}
          {/* <div className={styles.apprve} style={{ marginTop: '25px' }}>
            <Button
              variant="contained"
              endIcon={<DoneAllIcon />}
              color="success"
              onClick={() => {
                setmodalforAprov(true)
              }}
            >
              Remark
            </Button>

            <Button
              variant="contained"
              endIcon={<CloseIcon />}
              color="error"
              // onClick={() => {
              //   setmodalforRejt(true)
              // }}
            >
              exit
            </Button>
          </div> */}
        </div>

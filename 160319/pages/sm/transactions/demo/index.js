import Head from "next/head";
// import styles from '../styles/Home.module.css'
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useState } from "react";

const Demo = () => {
  const [extendedResult, updateExtendedResult] = useState(false);
  const { isLoading, error, data, getData } = useVisitorData({ extendedResult }, { immediate: true });

  const reloadData = () => {
    getData({ ignoreCache: true });
  };

  const onChangeExtendedResult = (e) => {
    updateExtendedResult(e.target.checked);
  };

  return (
    <div>
      <Head>
        <title>FingerprintJS Pro NextJS Demo</title>
        <meta
          name="description"
          content="Check if fingerprintjs-pro-react integration works with NextJS SSR"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>FingerprintJS Pro NextJS Demo</h1>
      <div >
        <div >
          <button onClick={reloadData} type="button">
            Reload data
          </button>
          <label>
            <input type="checkbox" onChange={onChangeExtendedResult} checked={extendedResult} />
            Extended result
          </label>
        </div>
        <h4>
          VisitorId: <span >{isLoading ? "Loading..." : data?.visitorId}</span>
        </h4>
        <h4>Full visitor data:</h4>
        <pre >{error ? error.message : JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Demo;

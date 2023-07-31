import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../../next-i18next.config";
import {
  getHostnameDataBySubdomain,
  getSubdomainPaths,
} from "../../../src/utils/db";

interface Props {
  initialized: Boolean;
  currencyCode: any;
  setCurrencyCode: Function;
  pageProps: {
    site: {
      name: string;
      description: string;
      subdomain: string;
      customDomain: string;
      defaultForPreview: false;
    };
  };
}

export default function Donate({
  pageProps,
  initialized,
  currencyCode,
  setCurrencyCode,
}: Props) {
  const { push } = useRouter();

  useEffect(() => {
    // Get the domian here, get the config for that specific domain, set it on client side
    // redirect to main index.tsx page
    push("/");
  }, []);

  return (
    <>
      <div style={{ marginTop: "200px" }}>
        <h1>Sub-domain: {pageProps.site.subdomain} </h1>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: await getSubdomainPaths(),
    fallback: true, // fallback true allows sites to be generated using ISR
  };
}

export async function getStaticProps(props: any) {
  console.log("\n", props.params, "\n");

  return {
    props: {
      ...(await serverSideTranslations(
        props.locale,
        [
          "bulkCodes",
          "common",
          "country",
          "donate",
          "donationLink",
          "editProfile",
          "giftfunds",
          "leaderboard",
          "managePayouts",
          "manageProjects",
          "maps",
          "me",
          "planet",
          "planetcash",
          "redeem",
          "registerTrees",
          "tenants",
          "treemapper",
        ],
        nextI18NextConfig,
        ["en", "de", "fr", "es", "it", "pt-BR", "cs"]
      )),
      site: await getHostnameDataBySubdomain(props.params.site),
    },
    revalidate: 3600,
  };
}

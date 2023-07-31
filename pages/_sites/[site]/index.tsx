import { useRouter } from "next/router";
import React from "react";
import ProjectsList from "../../../src/features/projects/screens/Projects";
import GetAllProjectsMeta from "../../../src/utils/getMetaTags/GetAllProjectsMeta";
import getStoredCurrency from "../../../src/utils/countryCurrency/getStoredCurrency";
import { getRequest } from "../../../src/utils/apiRequests/api";
import { ProjectPropsContext } from "../../../src/features/common/Layout/ProjectPropsContext";
import Credits from "../../../src/features/projects/components/maps/Credits";
import Filters from "../../../src/features/projects/components/projects/Filters";
import { TENANT_ID } from "../../../src/utils/constants/environment";
import { ErrorHandlingContext } from "../../../src/features/common/Layout/ErrorHandlingContext";
import DirectGift from "../../../src/features/donations/components/DirectGift";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../../../next-i18next.config";
import { handleError, APIError } from "@planet-sdk/common";
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

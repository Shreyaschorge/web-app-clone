import { useRouter } from "next/router";
import React from "react";
import ProjectsList from "../src/features/projects/screens/Projects";
import GetAllProjectsMeta from "../src/utils/getMetaTags/GetAllProjectsMeta";
import getStoredCurrency from "../src/utils/countryCurrency/getStoredCurrency";
import { getRequest } from "../src/utils/apiRequests/api";
import { ProjectPropsContext } from "../src/features/common/Layout/ProjectPropsContext";
import Credits from "../src/features/projects/components/maps/Credits";
import Filters from "../src/features/projects/components/projects/Filters";
import { TENANT_ID } from "../src/utils/constants/environment";
import { ErrorHandlingContext } from "../src/features/common/Layout/ErrorHandlingContext";
import DirectGift from "../src/features/donations/components/DirectGift";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
import { handleError, APIError } from "@planet-sdk/common";
import { getHostnameDataBySubdomain, getSubdomainPaths } from "../src/utils/db";

interface Props {
  initialized: Boolean;
  currencyCode: any;
  setCurrencyCode: Function;
}

export default function Donate({
  initialized,
  currencyCode,
  setCurrencyCode,
}: Props) {
  const {
    setProject,
    setProjects,
    setShowSingleProject,
    showProjects,
    setShowProjects,
    setsearchedProjects,
    setZoomLevel,
    filteredProjects,
  } = React.useContext(ProjectPropsContext);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { i18n } = useTranslation();
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState("");
  const [directGift, setDirectGift] = React.useState(null);
  const [showdirectGift, setShowDirectGift] = React.useState(true);
  const [internalLanguage, setInternalLanguage] = React.useState("");

  React.useEffect(() => {
    if (router.isReady) {
      console.log("==> tenantName");
      console.log("==> tenantName", router.query, "\n\n");
    }
    console.log("==> tenantName", router.query, "\n\n");
  }, [router.isReady]);

  React.useEffect(() => {
    const getdirectGift = localStorage.getItem("directGift");
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
  }, []);

  React.useEffect(() => {
    if (directGift) {
      if (directGift.show === false) {
        setShowDirectGift(false);
      }
    }
  }, [directGift]);

  // Deprecation Notice: This route will be removed in next major version
  React.useEffect(() => {
    if (router.query.p) {
      router.push("/[p]", `/${router.query.p}`, {
        shallow: true,
      });
    }
  }, [router]);

  React.useEffect(() => {
    setShowSingleProject(false);
    setProject(null);
    setZoomLevel(1);
  }, []);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== i18n.language
      ) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        setInternalLanguage(i18n.language);
        try {
          const projects = await getRequest(`/app/projects`, {
            _scope: "map",
            currency: currency,
            tenant: TENANT_ID,
            "filter[purpose]": "trees,conservation",
            locale: i18n.language,
          });
          setProjects(projects);
          setProject(null);
          setShowSingleProject(false);
          setZoomLevel(1);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect("/");
        }
      }
    }
    loadProjects();
  }, [currencyCode, i18n.language]);

  const ProjectsProps = {
    projects: filteredProjects,
    showProjects,
    setShowProjects,
    setsearchedProjects,
    currencyCode,
    setCurrencyCode,
  };

  const GiftProps = {
    setShowDirectGift,
    directGift,
  };

  return (
    <>
      {initialized ? (
        filteredProjects && initialized ? (
          <>
            <GetAllProjectsMeta />
            <ProjectsList {...ProjectsProps} />
            {directGift ? (
              showdirectGift ? (
                <DirectGift {...GiftProps} />
              ) : null
            ) : null}
            <Credits setCurrencyCode={setCurrencyCode} />
          </>
        ) : (
          <></>
        )
      ) : null}
      {showProjects && <Filters />}
    </>
  );
}

// export async function getStaticPaths() {
//   return {
//     paths: await getSubdomainPaths(),
//     fallback: true, // fallback true allows sites to be generated using ISR
//   };
// }

export async function getStaticProps(props: any) {
  console.log("\n", props, "\n");

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
      // site: await getHostnameDataBySubdomain(props.params),
    },
    revalidate: 3600,
  };
}

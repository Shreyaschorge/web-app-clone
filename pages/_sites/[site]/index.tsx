import { useRouter } from "next/router";
import { Layout, Page, Text, Link, List } from "@vercel/examples-ui";
import { useEffect } from "react";

import {
  getHostnameDataBySubdomain,
  getSubdomainPaths,
} from "../../../src/utils/db";

export default function Index(props) {
  const router = useRouter();

  console.log(props);

  useEffect(() => {
    router.push("/");
  }, []);

  return <></>;
}

Index.Layout = Layout;

export async function getStaticPaths() {
  return {
    paths: await getSubdomainPaths(),
    fallback: true, // fallback true allows sites to be generated using ISR
  };
}

export async function getStaticProps({ params: { site } }) {
  return {
    props: await getHostnameDataBySubdomain(site),
    revalidate: 3600, // set revalidate interval of 1 hour
  };
}

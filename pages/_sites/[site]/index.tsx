import { useRouter } from "next/router";
import { Layout, Page, Text, Link, List } from "@vercel/examples-ui";

import {
  getHostnameDataBySubdomain,
  getSubdomainPaths,
} from "../../../src/utils/db";

export default function Index(props) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Page>
        <Text variant="h1" className="mb-6">
          Loading...
        </Text>
      </Page>
    );
  }

  return (
    <Page style={{ marginTop: "300px" }}>
      <Text variant="h1" className="mb-6">
        {props.name}
      </Text>
      <div className="mb-4">
        <Link className="mr-2.5" href="/">
          Home
        </Link>
        <Link href="/about">About</Link>
      </div>
      <Text variant="h2" className="mb-6">
        More examples:
      </Text>
      <List>
        <li>
          <Link href="https://stern.plantingparty.org">stern</Link>
        </li>
        <li>
          <Link href="https://pampers.plantingparty.org">pampers</Link>
        </li>

        <li>
          <Link href="https://pampers.plantingparty.org">
            subdomain-3.vercel.sh
          </Link>
        </li>
        <li>
          <Link href="https://plantingparty.org">custom-domain-1.com</Link>{" "}
          (maps to <Link href="https://stern.plantingparty.org">stern</Link>)
        </li>
      </List>
    </Page>
  );
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

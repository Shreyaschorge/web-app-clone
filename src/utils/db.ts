const hostedDomain = [
  {
    subdomain: "planet",
    config: { appDomain: "https://www1.plant-for-the-planet.org" },
  },
  {
    subdomain: "salesforce",
    config: { appDomain: "https://trees.salesforce.com" },
  },
  { subdomain: "pampers", config: { appDomain: "https://wald.pampers.de" } },
  {
    subdomain: "3pleset",
    config: { appDomain: "https://trees.3pleset.de/" },
  },
  {
    subdomain: "culchacandela",
    config: { appDomain: "https://wald.culchacandela.de" },
  },
  {
    subdomain: "energizer",
    config: { appDomain: "https://wald.energizer.de" },
  },
  {
    subdomain: "lacoqueta",
    config: { appDomain: "https://forest.lacoquetakids.com" },
  },
  {
    subdomain: "nitrosb",
    config: { appDomain: "https://forest.nitrosnowboards.com" },
  },
  { subdomain: "sitex", config: { appDomain: "https://wald.sitex.de" } },
  {
    subdomain: "ttc",
    config: { appDomain: "https://www.trilliontreecampaign.org" },
  },
  { subdomain: "xiting", config: { appDomain: "https://trees.xiting.de" } },
  {
    subdomain: "weareams",
    config: { appDomain: "https://trees.startplanting.org" },
  },
  { subdomain: "ulmpflanzt", config: { appDomain: "" } },
  { subdomain: "interactClub", config: { appDomain: "" } },
  { subdomain: "senatDerWirtschaft", config: { appDomain: "" } },
];

// const DEFAULT_HOST = hostedDomain.find((h) => h.defaultForPreview);

const DEFAULT_TENANT_SUBDOMAIN = "planet";

/**
 * Returns the data of the hostname based on its subdomain or custom domain
 * or the default host if there's no match.
 *
 * This method is used by middleware.ts
 */
// export async function getHostnameDataOrDefault(
//   subdomainOrCustomDomain?: string
// ) {
//   if (!subdomainOrCustomDomain) return DEFAULT_HOST;

//   // check if site is a custom domain or a subdomain
//   const customDomain = subdomainOrCustomDomain.includes(".");

//   // fetch data from mock database using the site value as the key
//   return (
//     hostedDomain.find((item) =>
//       customDomain
//         ? item.customDomain === subdomainOrCustomDomain
//         : item.subdomain === subdomainOrCustomDomain
//     ) ?? DEFAULT_HOST
//   );
// }

/**
 * Returns the data of the hostname based on its subdomain.
 *
 * This method is used by pages under middleware.ts
 */
export async function getHostnameDataBySubdomain(subdomain: string) {
  return hostedDomain.find((item) => item.subdomain === subdomain);
}

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function getSubdomainPaths() {
  // get all sites that have subdomains set up
  const subdomains = hostedDomain.filter((item) => item.subdomain);

  // build paths for each of the sites in the previous two lists
  return subdomains.map((item) => {
    return { params: { site: item.subdomain } };
  });
}

function isSubdomain(domain: string) {
  const domainParts = domain.split(".");
  return process.env.NODE_ENV !== "development"
    ? domainParts.length > 2
    : domainParts.length > 1; // More than 2 parts indicates a subdomain (in prod) but 1 is dev env
}

export async function getTenantSubdomainOrDefault(
  localSubdomainOrTenantDomain: string
) {
  const rootDomain = localSubdomainOrTenantDomain.includes(
    process.env.ROOT_DOMAIN!
  );

  let subdomain;

  if (!rootDomain) {
    const tenant = hostedDomain.find(
      (tenant) => tenant.config.appDomain === localSubdomainOrTenantDomain
    );

    subdomain = tenant?.subdomain ?? DEFAULT_TENANT_SUBDOMAIN;
  } else {
    if (isSubdomain(localSubdomainOrTenantDomain)) {
      subdomain = localSubdomainOrTenantDomain.replace(
        `.${process.env.ROOT_DOMAIN}`,
        ""
      );
    } else {
      subdomain = DEFAULT_TENANT_SUBDOMAIN;
    }
  }

  return subdomain;
}

export default hostedDomain;

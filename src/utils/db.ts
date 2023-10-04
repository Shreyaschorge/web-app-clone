import { NextResponse } from 'next/server';
import tenantConfig from '../../tenant.config';
import { getRequest } from './apiRequests/api';
import {
  TenantAppConfig,
  Tenants,
} from '@planet-sdk/common/build/types/tenant';

const hostedDomain = [
  {
    subdomain: 'planet',
    config: { appDomain: 'https://www1.plant-for-the-planet.org' },
  },
  {
    subdomain: 'salesforce',
    config: { appDomain: 'https://trees.salesforce.com' },
  },
  { subdomain: 'pampers', config: { appDomain: 'https://wald.pampers.de' } },
  {
    subdomain: '3pleset',
    config: { appDomain: 'https://trees.3pleset.de/' },
  },
  {
    subdomain: 'culchacandela',
    config: { appDomain: 'https://wald.culchacandela.de' },
  },
  {
    subdomain: 'energizer',
    config: { appDomain: 'https://wald.energizer.de' },
  },
  {
    subdomain: 'lacoqueta',
    config: { appDomain: 'https://forest.lacoquetakids.com' },
  },
  {
    subdomain: 'nitrosb',
    config: { appDomain: 'https://forest.nitrosnowboards.com' },
  },
  { subdomain: 'sitex', config: { appDomain: 'https://wald.sitex.de' } },
  {
    subdomain: 'ttc',
    config: { appDomain: 'https://www.trilliontreecampaign.org' },
  },
  { subdomain: 'xiting', config: { appDomain: 'https://trees.xiting.de' } },
  {
    subdomain: 'weareams',
    config: { appDomain: 'https://trees.startplanting.org' },
  },
  { subdomain: 'ulmpflanzt', config: { appDomain: '' } },
  { subdomain: 'interactClub', config: { appDomain: '' } },
  { subdomain: 'senatDerWirtschaft', config: { appDomain: '' } },
];

// const DEFAULT_HOST = hostedDomain.find((h) => h.defaultForPreview);

const DEFAULT_TENANT_SUBDOMAIN = 'planet';

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
  const _hostedDomain = await getRequest<Tenants>(
    `${process.env.API_ENDPOINT}/app/tenants`
  );

  return _hostedDomain.find((item) => item.config.subDomain === subdomain);
}

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function getSubdomainPaths() {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  // get all sites that have subdomains set up
  const subdomains = tenants.filter((item) => item.config.subDomain);

  // build paths for each of the sites in the previous two lists
  return subdomains.map((item) => {
    return { params: { site: item.config.subDomain } };
  });
}

function isSubdomain(domain: string) {
  const domainParts = domain.split('.');

  return process.env.NODE_ENV !== 'development'
    ? !domain.startsWith('www') &&
        !domain.startsWith('www1') &&
        domainParts.length > 2
    : domainParts.length > 1;
}

export async function getTenantSubdomainOrDefault(
  localSubdomainOrTenantDomain: string
) {

  // if (localSubdomainOrTenantDomain === 'ttc.plantingparty.org') {
  //   return NextResponse.redirect('https://www.trilliontreecampaign.org', 301);
  // }

  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const _hostedDomain = (await response.json()) as Tenants;

  const rootDomain = localSubdomainOrTenantDomain.includes(
    process.env.ROOT_DOMAIN!
  );

  let subdomain;

  if (!rootDomain) {
    const tenant = _hostedDomain.find((tenant) =>
      tenant.config.customDomain
        ? tenant.config.customDomain.includes(localSubdomainOrTenantDomain)
        : tenant.config.appDomain.includes(localSubdomainOrTenantDomain)
    );

    subdomain = tenant?.config.subDomain ?? DEFAULT_TENANT_SUBDOMAIN;
  } else {
    if (isSubdomain(localSubdomainOrTenantDomain)) {
      subdomain = localSubdomainOrTenantDomain.replace(
        `.${process.env.ROOT_DOMAIN}`,
        ''
      );
    } else {
      subdomain = DEFAULT_TENANT_SUBDOMAIN;
    }
  }

  return subdomain;
}

export default hostedDomain;


/**
 * 
 * Return the tenant config based on the subdomain
 * 
 * @param subdomain 
 * @returns TenantAppConfig
 */
export const getTenantConfig = async (subdomain: string) => {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  const tenant = tenants.find(
    (tenant) => tenant.config.subDomain === subdomain
  );

  const _tenantConf = tenantConfig(subdomain);

  const tenantConf: TenantAppConfig = {
    ..._tenantConf,
    tenantID: tenant!.id,
    customDomain: tenant!.config.customDomain!,
    auth0ClientId: tenant!.config.auth0ClientId,
  };

  return tenantConf;
};

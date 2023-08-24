import { useRouter } from 'next/router';
import React, { FC, ReactElement, useEffect } from 'react';
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import Profile from '../../../../src/features/user/Profile';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import MyTrees from '../../../../src/features/user/Profile/components/MyTrees/MyTrees';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { User } from '@planet-sdk/common';
import { getSubdomainPaths } from '../../../../src/utils/db';
import tenantConfig from '../../../../tenant.config';
import { Tenants } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';

function ProfilePage(props): ReactElement {
  const { t } = useTranslation('me');
  // External imports
  const router = useRouter();
  const { user, contextLoaded, token } = useUserProps();
  const { tenantConfig, setTenantConfig } = useTenant();

  useEffect(() => {
    setTenantConfig(props.pageProps.config);
  }, []);

  // Internal states
  const [profile, setProfile] = React.useState<null | User>();
  const [authenticatedType, setAuthenticatedType] = React.useState('');

  useEffect(() => {
    if (contextLoaded) {
      if (user) {
        setProfile(user);
        setAuthenticatedType('private');
      }
    }
  }, [contextLoaded, user, router]);

  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('profile')}</title>
      </Head>
      {profile && (
        <>
          <Profile
            userprofile={profile}
            authenticatedType={authenticatedType}
          />
          <MyTrees
            authenticatedType={authenticatedType}
            profile={profile}
            token={token}
          />
        </>
      )}
    </UserLayout>
  ) : (
    <></>
  );
}

export default ProfilePage;

export async function getStaticPaths() {
  return {
    paths: await getSubdomainPaths(),
    fallback: true, // fallback true allows sites to be generated using ISR
  };
}

export async function getStaticProps(props: any) {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  const tenant = tenants.find(
    (tenant) => tenant.config.subDomain === props.params.site
  );

  const _tenantConf = tenantConfig(props.params.site);

  const tenantConf: TenantAppConfig = {
    ..._tenantConf,
    tenantID: tenant!.id,
    customDomain: tenant!.config.customDomain!,
    auth0ClientId: tenant!.config.auth0ClientId,
  };

  return {
    props: {
      ...(await serverSideTranslations(
        props.locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      config: tenantConf,
    },
  };
}

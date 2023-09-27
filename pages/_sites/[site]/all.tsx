import React from 'react';
import LeaderBoard from '../../../src/tenants/planet/LeaderBoard';
import { getRequest } from '../../../src/utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { handleError, APIError } from '@planet-sdk/common';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';
import GetLeaderboardMeta from '../../../src/utils/getMetaTags/GetLeaderboardMeta';
import { getSubdomainPaths } from '../../../src/utils/db';
import { TenantAppConfig, Tenants } from '@planet-sdk/common/build/types/tenant';
import tenantConfig from '../../../tenant.config';

interface Props {
  initialized: Boolean;
}

export default function Home({ initialized }: Props) {
  const [leaderboard, setLeaderboard] = React.useState(null);
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();

  React.useEffect(() => {
    async function loadLeaderboard() {
      if (tenantConfig) {
        try {
          const newLeaderboard = await getRequest(
            `/app/leaderboard/${tenantConfig.tenantID}`
          );
          setLeaderboard(newLeaderboard);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/');
        }
      }
    }
    loadLeaderboard();
  }, [tenantConfig]);

  const [tenantScore, setTenantScore] = React.useState(null);

  React.useEffect(() => {
    async function loadTenantScore() {
      if (tenantConfig) {
        try {
          const newTenantScore = await getRequest(
            `/app/tenantScore/${tenantConfig.tenantID}`
          );
          setTenantScore(newTenantScore);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/');
        }
      }
    }
    loadTenantScore();
  }, [tenantConfig]);

  let AllPage;

  function getAllPage() {
    switch (tenantConfig?.tenantName) {
      case 'planet':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} />
        );
        return AllPage;
      case 'ttc':
        AllPage = (
          <LeaderBoard leaderboard={leaderboard} tenantScore={tenantScore} />
        );
        return AllPage;
      default:
        AllPage = null;
        return AllPage;
    }
  }

  return (
    <>
      {initialized ? (
        <>
          <GetLeaderboardMeta />
          {getAllPage()}
        </>
      ) : null}
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

import React, { ReactElement } from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import { useTranslation } from 'next-i18next';

interface Props {
  species: Array<{
    id: number;
    percentage: string;
    speciesName: string;
  }>;
}

function PlantSpecies({ species }: Props): ReactElement {
  const { t } = useTranslation(['maps']);
  return (
    <div className={styles.projectMoreInfo}>
      <div className={styles.infoTitle}>
        {species.length} {t('maps:speciesPlanted')}
      </div>
      {species.map((species) => (
        <div key={species.id}>
          <div
            className={styles.speciesProgress}
            style={{ width: species.percentage }}
          />
          <div className={styles.infoText}>
            {species.percentage}
            <span style={{ marginLeft: '11px', flexGrow: 1 }}>
              {species.speciesName}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlantSpecies;

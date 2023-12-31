import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Marker, Popup } from 'react-map-gl';
import PopupProject from '../PopupProject';
import styles from '../../styles/ProjectsMap.module.scss';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';

interface Props {
  searchedProject: Array<Object>;
  setPopupData: Function;
  popupData: Object;
  isMobile: Boolean;
}

export default function Markers({
  searchedProject,
  setPopupData,
  popupData,
  isMobile,
}: Props): ReactElement {
  let timer: NodeJS.Timeout;
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);
  const popupRef = React.useRef(null);
  const { embed, callbackUrl } = React.useContext(ParamsContext);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {searchedProject.map((projectMarker: any, index: any) => (
        <Marker
          key={index}
          latitude={projectMarker.geometry.coordinates[1]}
          longitude={projectMarker.geometry.coordinates[0]}
          offsetLeft={5}
          offsetTop={-16}
        >
          <div
            className={`${styles.marker} ${
              projectMarker.properties.purpose === 'conservation'
                ? styles.conservationMarker
                : ''
            }`}
            onClick={() => {
              router.push(
                `/${projectMarker.properties.slug}/${
                  embed === 'true'
                    ? `${
                        callbackUrl != undefined
                          ? `?embed=true&callback=${callbackUrl}`
                          : '?embed=true'
                      }`
                    : ''
                }`,
                undefined,
                {
                  shallow: true,
                }
              );
            }}
            onKeyPress={() => {
              router.push(
                `/${projectMarker.properties.slug}/${
                  embed === 'true'
                    ? `${
                        callbackUrl != undefined
                          ? `?embed=true&callback=${callbackUrl}`
                          : '?embed=true'
                      }`
                    : ''
                }`,
                undefined,
                {
                  shallow: true,
                }
              );
            }}
            role="button"
            tabIndex={0}
            onMouseOver={() => {
              timer = setTimeout(() => {
                setPopupData({
                  show: true,
                  lat: projectMarker.geometry.coordinates[1],
                  long: projectMarker.geometry.coordinates[0],
                  project: projectMarker,
                });
              }, 300);
            }}
            onMouseLeave={() => {
              clearTimeout(timer);
            }}
            onFocus={() => {}}
          />
        </Marker>
      ))}
      {popupData.show && !isMobile && (
        <Popup
          latitude={popupData.lat}
          longitude={popupData.long}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setPopupData({ ...popupData, show: false })}
          anchor="bottom"
          dynamicPosition={false}
          offsetTop={-15}
          tipSize={0}
        >
          <div
            className={styles.popupProject}
            onClick={(event) => {
              if (event.target !== buttonRef.current) {
                if (!popupRef.current) {
                  router.push(
                    `/${popupData.project.properties.slug}/${
                      embed === 'true'
                        ? `${
                            callbackUrl != undefined
                              ? `?embed=true&callback=${callbackUrl}`
                              : '?embed=true'
                          }`
                        : ''
                    }`,
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                } else if (!popupRef.current.contains(event.target)) {
                  router.push(
                    `/${popupData.project.properties.slug}/${
                      embed === 'true'
                        ? `${
                            callbackUrl != undefined
                              ? `?embed=true&callback=${callbackUrl}`
                              : '?embed=true'
                          }`
                        : ''
                    }`,
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }
              }
            }}
            onKeyPress={() => {
              router.push(
                `/${popupData.project.properties.slug}/${
                  embed === 'true'
                    ? `${
                        callbackUrl != undefined
                          ? `?embed=true&callback=${callbackUrl}`
                          : '?embed=true'
                      }`
                    : ''
                }`,
                undefined,
                {
                  shallow: true,
                }
              );
            }}
            role="button"
            tabIndex={0}
            onMouseLeave={() => {
              if (!open) {
                setTimeout(() => {
                  setPopupData({ ...popupData, show: false });
                }, 300);
                handleClose();
              }
            }}
          >
            <PopupProject
              key={popupData.project.properties.id}
              project={popupData.project}
              buttonRef={buttonRef}
              popupRef={popupRef}
              open={open}
              handleOpen={handleOpen}
              handleClose={handleClose}
            />
          </div>
        </Popup>
      )}
    </>
  );
}

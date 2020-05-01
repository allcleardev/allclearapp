// external
import React, {useState, useContext, useEffect} from 'react';
import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';
import {makeStyles} from '@material-ui/core/styles';
import {get, pick} from 'lodash';
import qs from 'qs';

// components / icons
import SolidHeader from '@general/headers/header-solid';
import UpdateCriteriaModal from '@general/modals/update-criteria-modal';
import GoogleMap from '@components/map-components/google-map';
import TestingLocationListItem from '@components/map-components/testing-location-list-item';
import MobileTopBar from '@components/map-components/mobile-top-bar';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

// other
import ModalService from '@services/modal.service';
import {AppContext} from '@contexts/app.context';
import {useWindowResize} from '@hooks/general.hooks';
import {getActiveFilters, getRouteQueryParams} from '@util/general.helpers';
import GAService, {MAP_PAGE_GA_EVENTS, GA_EVENT_MAP} from '@services/ga.service';
import GoogleMapsAutocomplete from '@general/inputs/google-maps-autocomplete';
import MapService from '@services/map.service';
import ListLoadingSpinner from '../components/map-components/list-loading-spinner';
import {useHistory} from 'react-router';

export default function MapPage() {
  const mapService = MapService.getInstance();
  const gaService = GAService.getInstance();
  gaService.setScreenName('map');

  // constants
  const classes = useStyles();
  const DRAWER_EXPANDED_HEIGHT = '70vh';
  const DRAWER_COLLAPSED_HEIGHT = '40vh';

  // state & global state
  const {setAppState, appState} = useContext(AppContext);
  const history = useHistory();
  const [width, height] = useWindowResize(onWindowResize);
  const initialState = {
    isOpen: true,
    anchor: 'left',
    windowWidth: width,
    windowHeight: height,
    searchFilterActive: false,
    didInitSearch: false
  };
  const [mapState, setMapState] = useState(initialState);
  const [drawerHeight, setDrawerHeight] = useState(DRAWER_COLLAPSED_HEIGHT);
  const locations = get(appState, 'map.locations') || [];
  // const numActiveFilters = getNumActiveFilters(get(appState, 'searchCriteria'));
  const isLoggedIn = appState.sessionId ? true : false;
  const isDrawerExpanded = drawerHeight === DRAWER_EXPANDED_HEIGHT;
  let initialSearchVal;

  // lifecycle hooks
  useEffect(() => {
    setMapState({
      ...mapState,
      didInitSearch: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // callback handlers
  function onWindowResize({width, height}) {
    if (width <= 960) {
      setMapState({
        ...mapState,
        anchor: 'bottom',
        isOpen: true,
      });
      setDrawerHeight(DRAWER_COLLAPSED_HEIGHT);
    } else {
      setMapState({
        ...mapState,
        anchor: 'left',
        isOpen: true,
      });
      setDrawerHeight(height);
    }
  }

  function onDrawerSwipe(e) {
    if (initialState.windowWidth <= 960) {
      const nextHeight = drawerHeight === DRAWER_COLLAPSED_HEIGHT ? DRAWER_EXPANDED_HEIGHT : DRAWER_COLLAPSED_HEIGHT;
      if (e.pointerType === 'touch' || e.type === 'click') {
        setDrawerHeight(nextHeight);
      }
    }
  }

  async function onLocationSelected(bool, newLocation) {

    const search = pick(newLocation, ['description', 'latitude', 'longitude', 'id']);
    history.push({
      pathname: '/map',
      search: qs.stringify({
        ...appState.route.params,
        search
      }),
    });

    if (get(newLocation, 'description')) {
      const {latitude, longitude} = newLocation;

      await mapService.onLocationAccepted({
        coords: {
          latitude, longitude
        }
      }, true);

    }
  }

  async function onLocationCleared() {
    const latitude = get(appState, 'person.latitude');
    const longitude = get(appState, 'person.longitude');
    (latitude && longitude) && await mapService.onLocationAccepted({
      coords: {
        latitude, longitude
      }
    });
  }

  function onEditFiltersBtnClick() {
    // app context needs one more refresh before its ready to populate modal
    setAppState({
      ...appState,
      forceRefresh: !appState.forceRefresh,
    });
    modalService.toggleModal('criteria', true);
  }

  function onMapClick(evt) {
    if (anchor === 'bottom') {
      evt.stopPropagation();
      const nextHeight = drawerHeight === DRAWER_COLLAPSED_HEIGHT ? DRAWER_EXPANDED_HEIGHT : DRAWER_COLLAPSED_HEIGHT;
      if (nextHeight === DRAWER_COLLAPSED_HEIGHT) setDrawerHeight(nextHeight);
    }
  }

  // analytics handlers
  function onActionClick(action, itemId, itemIndex, itemName) {
    handleGAEvent(action, itemId, itemIndex, itemName);
  }

  function onTestingLocationExpand(itemId, itemIndex, itemName, isExpanded) {
    const eventKey = isExpanded ? 'expand' : 'contract';
    handleGAEvent(eventKey, itemId, itemIndex, itemName);
    const selection = itemName;
    history.push({
      pathname: '/map',
      search: qs.stringify({
        ...appState.route.params,
        selection
      }),
    });
  }

  function handleGAEvent(eventKey, itemId, itemIndex, itemName) {
    const eventName = GA_EVENT_MAP[eventKey];
    const enabledFilters = getActiveFilters(get(appState, ['searchCriteria'], {}));
    const additionalParams = MAP_PAGE_GA_EVENTS(itemId, itemName, itemIndex, enabledFilters);
    gaService.sendEvent(eventName, additionalParams);
  }

  const {isOpen, anchor} = mapState;

  // get modal service so we can toggle it open
  let modalService = ModalService.getInstance();

  let searchParams = getRouteQueryParams(history.location);
  initialSearchVal = get(searchParams, 'search.description');
  initialSearchVal = (mapState.didInitSearch) ? undefined : initialSearchVal;

  return (
    <div className="map-page">
      {anchor === 'bottom' && (
        <MobileTopBar
          isLoggedIn={isLoggedIn}
          onLocationSelected={onLocationSelected}
          onLocationCleared={onLocationCleared}
          onFilterClick={onEditFiltersBtnClick}
        >
        </MobileTopBar>
      )}
      <SolidHeader isLoggedIn={isLoggedIn} isOpen={isOpen}></SolidHeader>

      <Drawer
        className={classes.drawer + ' nav-left-location'}
        variant="persistent"
        anchor={anchor}
        open={isOpen}
        style={{height: drawerHeight, zIndex: 4}}
      >
        <div className="list-gradient"></div>
        <AnimateHeight
          duration={500}
          height={anchor === 'left' || drawerHeight === DRAWER_EXPANDED_HEIGHT ? '100%' : '40%'}
        >
          <div
            id="side-drawer"
            style={{
              width: anchor === 'left' ? `${drawerWidth}px` : '100%',
              overflowY: 'scroll',
              height: drawerHeight,
            }}
            className="side-drawer hide-scrollbar wid100-sm"
          >

            {anchor === 'left' &&
            <GoogleMapsAutocomplete
              searchIconColor={'lightgray'}
              focusOnRender={true}
              locationSelected={onLocationSelected}
              initialValue={initialSearchVal}
              onClear={onLocationCleared}
              noOptionsText={'Please Enter a Search Term to View Results'}
            ></GoogleMapsAutocomplete>
            }

            {appState.map.isListLoading === true && (<ListLoadingSpinner/>)}

            {locations &&
            locations.map((result, index) => (
              <TestingLocationListItem
                id={result.id}
                key={index}
                index={index}
                title={result.name}
                description={result.address}
                city_state={result.city + ', ' + result.state}
                service_time={result.hours}
                driveThru={result.driveThru}
                phone={result.phone}
                website={result.url}
                {...result}
                onActionClick={onActionClick}
                onTestingLocationExpand={onTestingLocationExpand}
              ></TestingLocationListItem>
            ))}


            {locations.length === 0 && appState.map.isListLoading === false && (
              <h2 style={{display: 'flex', justifyContent: 'center'}}>No Results Found </h2>
            )}
          </div>
        </AnimateHeight>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isOpen,
        })}
      >
        <div className="map-fullscreen" style={{height: anchor === 'bottom' && isDrawerExpanded ? '30vh' : null}}>
          <GoogleMap onMapClick={onMapClick}></GoogleMap>
          {anchor === 'bottom' &&
          <Button className="view-type-button" onClick={onDrawerSwipe}>
            {isDrawerExpanded ? 'Map' : 'List'}
          </Button>
          }
        </div>
      </main>
      <UpdateCriteriaModal></UpdateCriteriaModal>
    </div>
  );
}

const drawerWidth = 400;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  content: {
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

// todo: might still be useful at some point just not now
// function TabPanel(props) {
//   const {children, value, index} = props;
//   return (
//     <Typography
//       component="div"
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//     >
//       {value === index && <Box p={3}>{children}</Box>}
//     </Typography>
//   );
// }
//
// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };


// on mount, check if filter is active
// useEffect(
//   checkFilterActive,
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   [appState.forceRefresh],
// );
//
// function checkFilterActive() {
//   const currFormValues = Object.values(appState.searchCriteria).filter(Boolean);
//   // if any selections have anything but 'any' selected, search is active
//   // console.log('filterss', currFormValues);
//   // console.log(appState.searchCriteria)
//
//   const searchFilterActive = !currFormValues.every((e) => e === 'Any');
//
//   setAppState({
//     ...appState,
//     map: {
//       ...appState.map,
//       searchFilterActive,
//     },
//   });
//

// useEffect(() => {
//
//   const latitude = get(appState, 'route.params.search.latitude');
//   const longitude = get(appState, 'route.params.search.longitude');
//
//   if (latitude && longitude && !mapState.didInitMap) {
//     mapService.onLocationAccepted({
//       coords: {
//         latitude, longitude
//       }
//     }, true);
//     setMapState({
//       ...mapState,
//       didInitMap: true,
//     });
//   }
//
//
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [appState]);


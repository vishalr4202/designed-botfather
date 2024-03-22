import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect } from 'react'
import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import { createStructuredSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { executeACGAction, updateScreenIdentifiers } from 'src/store/slice';
import { acgSelector } from 'src/store/selector';
import { ACTION_CODES, STORE_KEYS } from 'src/constants/apiConstants';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export default function SetView() {
    const { user } = useMockedUser();
    const router = useRouter();
    // const location = useLocation();
    const dispatch = useDispatch();
    const acgStateSelector = createStructuredSelector({
        acgSlice: acgSelector()
    });
    const { acgSlice: state } = useSelector(acgStateSelector);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'GET',
                    urlPath: ACTION_CODES.GET_SETS,
                },
                storeKey: STORE_KEYS.GET_SETS,
                uniqueScreenIdentifier: {
                    setsrecd: true
                }
            })
        )
    }, [])

    const loginAll = (ele) => {
        console.log(ele, "ele")
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_LOGIN_ALL,
                    reqObj: { name: ele?.name }
                },
                storeKey: STORE_KEYS.SET_LOGIN_ALL,
                uniqueScreenIdentifier: {
                    setLogin: true
                }
            })
        )
    }

    const viewSet = (ele) => {
        // router.push(paths.dashboard.setdetails(ele?.name), { state: { params: ele } })
        navigate(paths.dashboard.setdetails(ele?.name), { state: { params: ele } })
    }
    const theme = useTheme();

    const settings = useSettingsContext();
    console.log(settings)
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid container spacing={3}>
                {state?.allSets?.message?.map((ele) => {
                    return (
                        <Grid xs={12} md={settings?.themeLayout == 'mini' ? 3 : 3.5}>
                            <AppWidgetSummary
                                title={ele?.name}
                                users={ele?.email?.length}
                                setView={true}
                                primary={ele?.primary}
                                login={() => loginAll(ele)}
                                view={() => viewSet(ele)}
                            />
                        </Grid>
                    )
                })}
            </Grid>
            {/* <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                    <Stack spacing={3}>
                        <AppWidget
                            title="Conversion"
                            total={38566}
                            icon="solar:user-rounded-bold"
                            chart={{
                                series: 48,
                            }}
                        />

                        <AppWidget
                            title="Applications"
                            total={55566}
                            icon="fluent:mail-24-filled"
                            color="info"
                            chart={{
                                series: 75,
                            }}
                        />
                    </Stack>
                </Grid>
            </Grid> */}
        </Container>
    );
}

import './App.css';
import {
    Box,
    Backdrop,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
    makeStyles,
} from '@material-ui/core';
import callApi from '../../helpers/callApi';
import IApiError from '../../model/apiError';
import { ReactElement, useState } from 'react';
import ISaveSleepScore from '../../model/saveSleepScore';
import ISleepScore from '../../model/sleepScore';
import useAsleepIncrements from '../../hooks/useAsleepIncrements';
import useInBedIncrements from '../../hooks/useInBedIncrements';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        marginTop: theme.spacing(4),
        marginBottome: theme.spacing(4),
    },
    overlay: {
        zIndex: 20,
    },
    content: {
        padding: theme.spacing(2),
    },
    gridWrapper: {
        flexGrow: 1,
    },
    button: {
        marginTop: theme.spacing(1),
    },
}));

const App = (): ReactElement => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [timeInBed, setTimeInBed] = useState<number | null>(null);
    const [timeAsleep, setTimeAsleep] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const [inBedOptionsPending, inBedOptions] = useInBedIncrements();
    const [asleepOptionsPending, asleepOptions] = useAsleepIncrements();

    const sleepScore = () => {
        return Math.round((100 * (timeAsleep ?? 0)) / (timeInBed ? timeInBed : 1));
    };

    const submit = () => {
        setSubmitting(true);

        const request: ISaveSleepScore = {
            sleepScore: localStorage.getItem('error') === null ? sleepScore() : 150,
        };

        callApi<ISaveSleepScore, ISleepScore>(
            '/sleepscore',
            request,
            handleSaveSuccess,
            handleSaveError
        );
    };

    const handleSaveSuccess = (response: ISleepScore) => {
        setResult(response.message);
        setSubmitting(false);
    };

    const handleSaveError = (error: IApiError) => {
        setError(error.message);
        setSubmitting(false);
    };

    const reset = () => {
        setError(null);
        setResult(null);
        localStorage.clear();
    };

    const pending = inBedOptionsPending || asleepOptionsPending || submitting;

    return (
        <Box className={classes.root}>
            <Container maxWidth="xs" className={classes.container}>
                <Paper variant="outlined" className={classes.content}>
                    <Grid container className={classes.gridWrapper}>
                        {error && (
                            <Grid item container spacing={1} xs={12} justify="center">
                                <Grid item xs={12}>
                                    <Typography align="center">{error}</Typography>
                                </Grid>
                                <Grid item>
                                    <Button onClick={reset}>{t('label.reset')}</Button>
                                </Grid>
                            </Grid>
                        )}
                        {result && (
                            <Grid item container spacing={1} xs={12} justify="center">
                                <Grid item xs={12}>
                                    <Typography align="center" color="primary" variant="h4">
                                        {sleepScore()}
                                    </Typography>
                                    <Typography align="center">{result}</Typography>
                                </Grid>
                                <Grid item>
                                    <Button onClick={reset}>{t('label.reset')}</Button>
                                </Grid>
                            </Grid>
                        )}
                        {!pending && !error && !result && (
                            <>
                                <Grid item container spacing={1} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="in-bed-select-label">
                                            {t('label.inBed')}
                                        </InputLabel>

                                        <Select
                                            labelId="in-bed-select-label"
                                            id="in-bed-select"
                                            data-testid="in-bed-select"
                                            value={timeInBed ?? undefined}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value as string);
                                                if (isNaN(parsedValue)) {
                                                    setTimeInBed(null);
                                                } else {
                                                    setTimeInBed(parsedValue);
                                                    if (timeAsleep && parsedValue < timeAsleep) {
                                                        setTimeAsleep(null);
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem>{t('label.chooseOption')}</MenuItem>
                                            {inBedOptions.map((option) => (
                                                <MenuItem
                                                    key={`option-inbed-${option.value}`}
                                                    data-testid={`bed-${option.value}`}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="asleep-select-label">
                                            {t('label.asleep')}
                                        </InputLabel>
                                        <Select
                                            labelId="asleep-select-label"
                                            id="asleep-select"
                                            data-testid="asleep-select"
                                            value={timeAsleep ?? undefined}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value as string);
                                                if (isNaN(parsedValue)) {
                                                    setTimeAsleep(null);
                                                } else {
                                                    setTimeAsleep(parsedValue);
                                                }
                                            }}
                                        >
                                            <MenuItem>{t('label.chooseOption')}</MenuItem>
                                            {asleepOptions
                                                .filter((option) => {
                                                    return timeInBed === null || option.value <= timeInBed;
                                                })
                                                .map((option) => (
                                                    <MenuItem
                                                        key={`option-asleep-${option.value}`}
                                                        data-testid={`asleep-${option.value}`}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                    <Grid
                                        item
                                        container
                                        xs={12}
                                        spacing={1}
                                        justify="center"
                                        className={classes.button}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            data-testid="submit"
                                            disabled={
                                                timeInBed === null || timeAsleep === null || submitting
                                            }
                                            onClick={submit}
                                        >
                                            {t('label.submit')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Paper>
                <Backdrop
                    className={classes.overlay}
                    data-testid="loading"
                    open={pending}
                >
                    <Typography variant="h5">{t('page.common.loading')}</Typography>
                </Backdrop>
            </Container>
        </Box>
    );
};

export default App;

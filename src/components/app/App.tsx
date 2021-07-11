import { useState } from 'react';
import './App.css';
import useInBedIncrements from '../../hooks/useInBedIncrements';
import useAsleepIncrements from '../../hooks/useAsleepIncrements';
import { useTranslation } from 'react-i18next';
import ISleepScore from '../../model/sleepScore';
import callApi from '../../helpers/callApi';
import ISaveSleepScore from '../../model/saveSleepScore';
import IApiError from '../../model/apiError';
import { Backdrop, Button, Container, FormControl, FormGroup, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root:{
        marginTop: theme.spacing(4),
        marginBottome: theme.spacing(4)
    },
    overlay: {
        zIndex: 20
    },
    container: {
        padding: theme.spacing(2)
    },
    gridWrapper: {
        flexGrow: 1
    },
    button:{
        marginTop: theme.spacing(1)
    }
}));

function App() {
    const { t } = useTranslation();
    const classes = useStyles();

    const [timeInBed, setTimeInBed] = useState<number | null>(null);
    const [timeAsleep, setTimeAsleep] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const [inBedOptionsPending, inBedOptions] = useInBedIncrements();
    const [asleepOptionsPending, asleepOptions] = useAsleepIncrements();

    const submit = () => {
        setSubmitting(true);

        const request: ISaveSleepScore = {
            sleepScore: localStorage.getItem("error") === null
                ? 100 * timeAsleep! / timeInBed!
                : 150
        };

        callApi<ISaveSleepScore, ISleepScore>(
            "/sleepscore",
            request,
            handleSaveSuccess,
            handleSaveError);
    }

    const handleSaveSuccess = (response: ISleepScore) => {
        setResult(response.message);
        setSubmitting(false);
    }

    const handleSaveError = (error: IApiError) => {
        setError(error.message);
        setSubmitting(false);
    }

    const reset = () => {
        setError(null);
        setResult(null);
        localStorage.clear();
    }

    const pending = inBedOptionsPending || asleepOptionsPending || submitting;

    return (
        <Container maxWidth="xs" className={classes.root}>
            <Paper variant="outlined" className={classes.container}>
                <Grid container className={classes.gridWrapper}>
                    {error &&
                        <Grid item container spacing={1} xs={12} justify="center">
                            <Grid item xs={12}>
                                <Typography align="center">{error}</Typography>
                            </Grid>
                            <Grid item>
                                <Button onClick={reset}>
                                    {t("label.reset")}
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {result &&
                        <Grid item container spacing={1} xs={12} justify="center">
                            <Grid item xs={12}>
                                <Typography align="center">{result}</Typography>
                            </Grid>
                            <Grid item>
                                <Button onClick={reset}>
                                    {t("label.reset")}
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {!pending && !error && !result &&
                        <>
                            <Grid item container spacing={1} xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="in-bed-select-label">{t("label.inBed")}</InputLabel>

                                    <Select labelId="in-bed-select-label" id="in-bed-select" data-testid="in-bed-select" value={timeInBed ?? undefined} onChange={e => {
                                        const parsedValue = parseInt(e.target.value as string);
                                        if (isNaN(parsedValue)) {
                                            setTimeInBed(null);
                                        } else {
                                            setTimeInBed(parsedValue);
                                        }
                                    }}>
                                        <MenuItem>
                                            {t("label.chooseOption")}
                                        </MenuItem>
                                        {inBedOptions.map(option =>
                                            <MenuItem key={`option-inbed-${option.value}`} data-testid={`bed-${option.value}`} value={option.value}>
                                                {option.label}
                                            </MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="asleep-select-label">{t("label.asleep")}</InputLabel>
                                    <Select labelId="asleep-select-label" id="asleep-select" data-testid="asleep-select" value={timeAsleep ?? undefined} onChange={e => {
                                        const parsedValue = parseInt(e.target.value as string);
                                        if (isNaN(parsedValue)) {
                                            setTimeAsleep(null);
                                        } else {
                                            setTimeAsleep(parsedValue);
                                        }
                                    }}>
                                        <MenuItem>
                                            {t("label.chooseOption")}
                                        </MenuItem>
                                        {asleepOptions
                                            .filter(option => {
                                                return timeInBed === null || option.value <= timeInBed;
                                            })
                                            .map(option =>
                                                <MenuItem key={`option-asleep-${option.value}`} data-testid={`asleep-${option.value}`} value={option.value}>
                                                    {option.label}
                                                </MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Grid item container xs={12} spacing={1} justify="center" className={classes.button}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        data-testid="submit"
                                        disabled={timeInBed === null || timeAsleep === null || submitting}
                                        onClick={submit}
                                    >
                                        {t("label.submit")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    }
                </Grid>
            </Paper>
            <Backdrop className={classes.overlay} data-testid="loading" open={pending}><Typography variant="h5">{t("page.common.loading")}</Typography></Backdrop>
        </Container>
    );
}

export default App;

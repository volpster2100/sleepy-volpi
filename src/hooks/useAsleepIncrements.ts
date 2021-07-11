import { useEffect, useState } from "react";
import TimeIncrements from "../helpers/timeIncrements";
import ITimeIncrementOption from "../model/timeIncrementOption";
import { useTranslation } from 'react-i18next';

function useAsleepIncrements(): [
    boolean,
    ITimeIncrementOption[]
]{
    const [pending, setPending] = useState(true);
    const [inBedOptions, setInBedOptions] = useState<ITimeIncrementOption[]>([]);

    const {t} = useTranslation();

    // TODO actual API call
    // TODO check local cache for values before querying API (auto expire cache every hour)

    useEffect(() => {
                
        // mimic network time
        setTimeout(() => {
            let calculatedOptions:ITimeIncrementOption[] = [];

            const increments = TimeIncrements()
            for (let i = 0; i < increments.length; i++) {
                const increment = increments[i];
                const hours = Math.floor(increment/60);
                const minutes = increment - hours * 60;

                const hourLabel = hours === 1
                    ? t("page.common.hour")
                    : t("page.common.hours");

                calculatedOptions.push({
                    label: `${hours} ${hourLabel}, ${minutes} ${t("page.common.minutes")}`,
                    value: increment
                })
            }

            setInBedOptions(calculatedOptions);
            setPending(false);
        }, 1000);
    }, [])

    return [pending, inBedOptions];
}

export default useAsleepIncrements;
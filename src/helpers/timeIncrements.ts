export function TimeIncrements(){
    const max = 1440;
    const min = 0;
    const increment = 30;

    let increments:number[] = [];

    // Generate increments
    let i = min;
    while (i <= max){
        increments.push(i);
        i += increment;
    }

    return increments;
}

export default TimeIncrements;
import IApiError from '../model/apiError';

const callApi = <TRequest, TResponse>(
    endpoint: string,
    body: TRequest,
    handleSuccess: (data: TResponse) => void,
    handleError: (data: IApiError) => void
): void => {
    fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (response.ok) {
                response.json().then(handleSuccess);
            } else {
                response.json().then(handleError);
            }
        })
        .catch(() => {
            handleError({
                code: 500,
                message: 'Something went terribly wrong...',
            });
        });
};

export default callApi;

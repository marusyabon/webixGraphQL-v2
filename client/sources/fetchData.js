import {URL} from './consts';

async function fetchData(query, variables) {
    const data = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
    return data.json();
}

export default fetchData;

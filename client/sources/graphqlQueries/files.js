import {URL} from '../consts';

function saveFile (input) {
	input.upload = btoa(input.upload);
    fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `mutation uploadFile($input: FileInput){
                uploadFile(input: $input)
                }
            `,
            variables: {input}
        })
      })
        .then(r => r.json());
}

export {saveFile};

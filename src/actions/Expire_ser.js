

import * as loginActions from './loginActions';


const regisMacAdd =  (urlser,machineNum,usernameser,passwordser,userName) => {

    
    console.log('REGIS MAC ADDRESS');
    
     fetch( urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Register',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE":"' +
                 machineNum +
                '","BPAPUS-USERID": "' +
                usernameser +
                '","BPAPUS-PASSWORD": "' +
                passwordser +
                '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "' +
                userName +
                '"}',
        }),
    })
        .then((response) => response.json())
        .then(async (json) => {
            if (json.ResponseCode == 200 && json.ReasonString == 'Completed') {
               
            } else {
                console.log('REGISTER MAC FAILED');
            }
        })
        .catch((error) => {
            console.log('ERROR at regisMacAdd ' + error);
            console.log('http', urlser);
            if (urlser == '') {
                
            } else {
                
            }

        });
};

const _fetchGuidLog = async (urlser,serviceID,machineNum,usernameser,passwordser) => {

    
    console.log('FETCH GUID LOGIN');
    await fetch(urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Login',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "' +
                machineNum +
                '","BPAPUS-USERID": "' +
                usernameser +
                '","BPAPUS-PASSWORD": "' +
                passwordser +

                '"}',
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            if (json && json.ResponseCode == '635') {

                console.log('NOT FOUND MEMBER');
            } else if (json && json.ResponseCode == '629') {
                console.log('NOT FOUND MEMBER');
            } else if (json && json.ResponseCode == '200') {
                let responseData = JSON.parse(json.ResponseData);
                useDispatch(loginActions.guid(responseData.BPAPUS_GUID));
            } else {
                console.log('NOT FOUND MEMBER');
            }
        })
        .catch((error) => {
            console.error('ERROR at _fetchGuidLogin' + error);
            if (urlser == '') {


            } else {


            }
        });

};
const set_temp = () => {
    return 'regisMacAdd()'
}

export const Expire_ser = (n) => {
    return n
}

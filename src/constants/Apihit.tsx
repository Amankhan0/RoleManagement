import { SideBarApiResponse } from "features/RoleSlice";

export function ApiHit(json: any, api: string): Promise<SideBarApiResponse> {
    return new Promise(function (resolve, reject) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(json)
      };
      fetch(api, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            console.log('result----',result);
            resolve(result);
          },
          (error) => {
            console.log('error', error);
          }
        ).catch((err) => {
          console.log('err', err);
        })
    })
  }
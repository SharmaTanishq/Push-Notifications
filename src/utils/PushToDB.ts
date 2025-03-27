

export async function pushToDB(data: any, errored?:string) {

    const username = process.env.OCI_USERNAME!
    const password = process.env.OCI_PASSWORD!
        
        // Create Basic Auth header by encoding username:password in Base64
    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64')
    
    try {
        // First, get the session confirmation number
        const url = process.env.OCI_URL!
         await fetch(`${url}/api/rest/model/atg/rest/SessionConfirmationActor/getSessionConfirmationNumber?pushSite=mffMobile`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Basic ${basicAuth}`
            }        
        }).then(async res => {
            //console.log("Session Response", await res.json())
            const sessionConfirmationNumber = await res.json().then(data => {
            console.log("Session Confirmation Number within .then",JSON.stringify(data))
                return data.sessionConfirmationNumber
            })
            console.log("Session Confirmation Number",sessionConfirmationNumber)
            const body = {
                title:data.title,
                body:data.body,
                token:data.token,
                profileId:data.profileId,
                orderId:data.orderId,
                _dynSessConf:`${sessionConfirmationNumber}`
            }
            console.log("Body",body)
            const cookies = res.headers.get('set-cookie')
            console.log("Cookies",cookies)

            await fetch(`${url}/node1/rest/model/atg/userprofiling/ProfileActor/saveNotification?pushSite=mffMobile`, {
                method: 'POST',
                headers: {                
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${basicAuth}`,  
                    'cookie': `${cookies}`
                },
                body:JSON.stringify(body)
            }).then(res => {
                if(res.ok){
                    console.log("Push Response",res)
                    return res
                }else{
                    console.log("Error","Failed to push data")
                    return res
                }
            }).catch(err => {
                console.log("Error","Failed to push data")
                return err
            })
            
            return res
        })
        
        
        


        
        
        return {
            success: true,
            
                
        };
    } catch (error) {
        console.error('Error in pushToDB:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
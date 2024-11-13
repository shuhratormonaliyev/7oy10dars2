async function getToken() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                'Authorization': `Basic ${btoa("0f2d44fba4b248b9b53d2a3aad9628bd"+ ":" + "bb10b533d00043519fd4b50b4549ff1a")}`
            },
            body: "grant_type=client_credentials"
        });
        
        const auth = await response.json();
        localStorage.setItem('token', `${auth.token_type} ${auth.access_token}`);
        
    } catch (error) {
        console.log(error);   
    }
}

export { getToken };

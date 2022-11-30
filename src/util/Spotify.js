const ID = 'e64b59ce42bf46ef937b24de3866098d';
const redirectURI = "https://gleeful-gnome-4f52fc.netlify.app/";
let userAccess;
let Spotify = {
    getAccessToken(){
        if(userAccess){
            return userAccess;
        }
        //check for user acces token
        const userAccessMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if(userAccessMatch && expiresInMatch){
            userAccess = userAccessMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => userAccess = '', expiresIn *1000);
            window.history.pushState('Access Token', null, '/');
            return userAccess;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}&limit=50`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse.tracks){
                return [];
            } return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },
    savePlaylist(name,trackURIs){
        if(!name && !trackURIs){
            return;
        } 
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let userID;
        return fetch('https://api.spotify.com/v1/me',{headers: headers}
        ).then(response => {
            if(response.ok){
                return response.json();
            }
        }).then(responseJson => {
            userID = responseJson.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body : JSON.stringify({ uris: trackURIs})
                });
            });
        })
    }, 
    getUserPlaylists(){
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let userID;
        return fetch('https://api.spotify.com/v1/me',{headers: headers}
        ).then(response => {
            if(response.ok){
                return response.json();
            }
        }).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{headers: headers}
            ).then(response => {
                if(response.ok){
                    return response.json();
                }
            }).then(jsonResponse => {
                if(!jsonResponse) {
                    return [];
                } return jsonResponse.items.map(playlist => ({
                    name: playlist.name,
                    id: playlist.id
                }))
            })
        })
    }
};
export {Spotify};
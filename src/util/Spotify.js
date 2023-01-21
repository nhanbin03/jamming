const clientID = `${process.env.REACT_APP_SPOTIFY_API}`;
const redirectURI = `${process.env.REACT_APP_REDIRECT_URI}`;
let accessToken;
let userID;

const Spotify = {
    getAccessToken() {
        console.log(process.env.REACT_APP_SPOTIFY_API, process.env.REACT_APP_REDIRECT_URI);
        if (accessToken) {
            return accessToken;
        }

        const accessTokeMatch = window.location.href.match(/access_token=([^&]*)/)
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if (accessTokeMatch && expiresInMatch) {
            accessToken = accessTokeMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }
    },
    
    async search(term) {
        const accessToken = this.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async getUserID() {
        if (userID)
            return userID;
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: headers
        });
        return (await response.json()).id;
    },

    async createPlaylist(name, userID) {
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name })
        });
        return await response.json();
    },

    async savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) return;
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        const userID = await this.getUserID();
        const playlistID = (await this.createPlaylist(playlistName, userID)).id;

        const responseAddItem = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackURIs })
        });
        return {
            name: playlistName,
            id: playlistID
        }
    },
    
    async getSavedPlaylists() {
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        const userID = await this.getUserID();
        
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers
        });
        const jsonResponse = await response.json();

        let savedPlaylists = jsonResponse.items;
        savedPlaylists = savedPlaylists.map(playlist => {
            return {
                name: playlist.name,
                id: playlist.id
            }
        });
        return savedPlaylists;
    },

    async unfollowPlaylist(playlist) {
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        const playlistID = playlist.id;

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/followers`, {
            headers: headers,
            method: 'DELETE'
        })

    }

}

export default Spotify;
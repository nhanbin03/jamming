import Config from "../config"

const clientID = Config.SPOTIFY_API;
const redirectURI = 'http://localhost:3000/'
let accessToken;

const Spotify = {
    getAccessToken() {
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

    async savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) return;
        const accessToken = this.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        const responseUser = await fetch('https://api.spotify.com/v1/me', {
            headers: headers
        });
        const jsonResponseUser = await responseUser.json();

        const userID = jsonResponseUser.id;
        const responsePlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: playlistName })
        });
        const jsonResponsePlaylist = await responsePlaylist.json();

        const playlistID = jsonResponsePlaylist.id;
        const responseAddItem = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackURIs })
        });
        const jsonResponseAddItem = await responseAddItem.json();

    }
}

export default Spotify;
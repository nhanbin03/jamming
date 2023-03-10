import React from 'react'
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        // { name: 'name1', artist: 'artist1', album: 'album1', id: 1 },
        // { name: 'name2', artist: 'artist2', album: 'album2', id: 2 },
        // { name: 'name3', artist: 'artist3', album: 'album3', id: 3 }
      ],
      playlistName: "New Playlist",
      playlistTracks: [
        // { name: 'name4', artist: 'artist4', album: 'album4', id: 4 },
        // { name: 'name5', artist: 'artist5', album: 'album5', id: 5 },
        // { name: 'name6', artist: 'artist6', album: 'album6', id: 6 }
      ],
      savedPlaylists: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.unfollowPlaylist = this.unfollowPlaylist.bind(this);
  }

  componentDidMount() {
    Spotify.getAccessToken();

    Spotify.getSavedPlaylists().then(playlists => this.setState({ savedPlaylists: playlists }));
    
  }

  addTrack(track) {
    const tracks = this.state.playlistTracks;
    if (!tracks.find(savedTrack => savedTrack.id === track.id)) {
      tracks.push(track);
      this.setState({ playlistTracks: tracks });
    }
  }

  removeTrack(id) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(savedTrack => {
      return savedTrack.id !== id
    });
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }
  
  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    const savedPlaylist = await Spotify.savePlaylist(this.state.playlistName, trackURIs);

    const savedPlaylists = this.state.savedPlaylists;
    savedPlaylists.push(savedPlaylist);

    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
      savedPlaylists: savedPlaylists
    })
  }

  async search(term) {
    const searchResults = await Spotify.search(term);
    this.setState({ searchResults: searchResults })
  }

  async unfollowPlaylist(playlist) {
    await Spotify.unfollowPlaylist(playlist);
    let savedPlaylists = this.state.savedPlaylists;
    savedPlaylists = savedPlaylists.filter(savedPlaylist => savedPlaylist.id !== playlist.id);
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [],
      savedPlaylists: savedPlaylists
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                           onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks} 
                      onRemoveTrack={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} 
                      onRemovePlaylist={this.unfollowPlaylist}
                      savedPlaylists={this.state.savedPlaylists} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react'
import TrackList from '../TrackList/TrackList'
import PlaylistList from '../PlaylistList/PlaylistList';

import './Playlist.css'

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    handleNameChange(e) {
        const name = e.target.value;
        this.props.onNameChange(name);
    }
    render() {
        return (
            <div className="Playlist">
                <input defaultValue={"New Playlist"} onChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playlistTracks} onClick={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
                <h2>Your Playlists</h2>
                <PlaylistList />
            </div>
        );
    }
}

export default Playlist;
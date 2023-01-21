import React from 'react'

import './SavedPlaylist.css'

class SavedPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.handleRemove = this.handleRemove.bind(this);
    }
    handleRemove() {
        this.props.onRemove(this.props.playlist);
    }
    render() {
        return (
            <div className="SavedPlaylist">
                <div className="Playlist-information">
                    {this.props.playlist.name}
                </div>
                <button className="Playlist-removal"
                        onClick={this.handleRemove}>x</button>
            </div>
        );
    }
}

export default SavedPlaylist;
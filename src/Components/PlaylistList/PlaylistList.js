import React from 'react'
import SavedPlaylist from '../SavedPlaylist/SavedPlaylist';

import './PlaylistList.css'

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="PlaylistList">
                {this.props.savedPlaylists.map(playlist => {
                    return <SavedPlaylist playlist={playlist}
                                          key={playlist.id}
                                          onRemove={this.props.onRemove} />
                })}
            </div>
        );
    }
}

export default PlaylistList;
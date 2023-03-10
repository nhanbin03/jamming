import React from 'react'
import Track from '../Track/Track'

import './TrackList.css'

class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        return <Track track={track} key={track.id} onClick={this.props.onClick} isRemoval={this.props.isRemoval}/>;
                    })
                }
            </div>
        );
    }
}

export default TrackList;
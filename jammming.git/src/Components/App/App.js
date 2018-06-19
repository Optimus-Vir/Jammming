import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist.js'
import SearchBar from '../SearchBar/SearchBar.js'
import SearchResults from '../SearchResults/SearchResults.js'
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
                  searchResults: [],
                  playlistName: "Songs",
                  playlistTracks: []
                }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track) {
  if (this.state.playlistTracks.findIndex(_track => _track.id === track.id) === -1) {
      let playlistTracks = this.state.playlistTracks
      playlistTracks.push(track)
      this.setState({playlistTracks: playlistTracks})
    } else {
      return;
    }
  }

  removeTrack(track) {
    let trackID = track.id
    let trackIndex = this.state.playlistTracks.indexOf(this.state.playlistTracks.find(function (track) { return track.id === trackID; }))
    let playlistTracks = this.state.playlistTracks
    playlistTracks.splice(trackIndex, 1)
    this.setState({playlistTracks: playlistTracks})
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(spotifySearchResults => {
      this.setState({
                    searchResults: spotifySearchResults
                  })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
          <SearchResults searchResults = {this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

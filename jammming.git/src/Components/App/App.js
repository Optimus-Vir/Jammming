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
                  searchResults: [
                                  {
                                    name: "Rusalka, Rusalka / Wild Rushes",
                                    artist: "The Decemberists",
                                    album: "I'll Be Your Girl",
                                    id: 1
                                  },
                                  {
                                    name: "Rivendell",
                                    artist: "Rush",
                                    album: "Fly By Night",
                                    id: 2
                                  },
                                  {
                                    name: "Settled Down",
                                    artist: "Mandolin Orange",
                                    album: "Such Jubilee",
                                    id: 3
                                  },
                                  {
                                    name: "Landslide",
                                    artist: "Fleetwood Mac",
                                    album: "Fleetwood Mac",
                                    id: 4
                                  }
                                ],
                  playlistName: "Songs",
                  playlistTracks: [
                                  {
                                    name: "Rusalka, Rusalka / Wild Rushes",
                                    artist: "The Decemberists",
                                    album: "I'll Be Your Girl",
                                    id: 1
                                  },
                                  {
                                    name: "Rivendell",
                                    artist: "Rush",
                                    album: "Fly By Night",
                                    id: 2
                                  },
                                  {
                                    name: "Settled Down",
                                    artist: "Mandolin Orange",
                                    album: "Such Jubilee",
                                    id: 3
                                  },
                                  {
                                    name: "Landslide",
                                    artist: "Fleetwood Mac",
                                    album: "Fleetwood Mac",
                                    id: 4
                                  }
                                ]

                }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track) {
  if (this.state.playlistTracks.findIndex(trackX => trackX.id === track.id) === -1) {
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
    let trackURIs = [];
    this.state.playlistTracks.map(_track => {
      trackURIs.push(_track.uri)
    });
    return trackURIs
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
    this.setState({searchResults: Spotify.search(searchTerm).then(tracks => {
          this.setState({
            searchResults: tracks
          })
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

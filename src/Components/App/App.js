import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';
import {Spotify} from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName:'playlist1',
      playlistTracks: [],
      playLists: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  search(search){
    Spotify.search(search).then(result => {
      this.setState({
        searchResults: result
      })
    });
  }
  updatePlayListName(name){
    this.setState({playlistName: name});
  }
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if (tracks.find(single => single.id === track.id)){
      return;
    } else {
      tracks.push(track);
      this.setState({ playlistTracks: tracks})
    }
  }
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(current => current.id !== track.id);
    this.setState({playlistTracks: tracks});
  }
  savePlaylist(){
    let tracks = this.state.playlistTracks;
    let trackURIs = tracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    });
  }
  getUserPlaylists(){
    Spotify.getUserPlaylists().then(result => {
      this.setState({
        playLists: result
      })
    })
  }
  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlayListName} onMount={this.getUserPlaylists} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;

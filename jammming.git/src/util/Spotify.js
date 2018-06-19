let accessToken = ""

const redirectURI = "http://optimus-vir.surge.sh/"
const clientID = "f6351574ae514c54b8bc1311b3bfd671"

const spotifyAuthorizeURIBase = "https://accounts.spotify.com/authorize"


const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      window.location = `${spotifyAuthorizeURIBase}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      console.log("Access token not available.")
    }
  },

  search(searchTerm) {  // Passes term to Spotify request and resturns results in JSON
    let accessToken = this.getAccessToken()
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
                                                                                  headers: {
                                                                                            Authorization: `Bearer ${accessToken}`
                                                                                          }
                                                                                }).then(response => {
                                                                                  return response.json();
                                                                                }).then(jsonResponse => {
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
                                                                                });


    },

    savePlaylist(playlistName, trackURIs) {
      if (playlistName || trackURIs.length) {
        let accessToken = this.getAccessToken();
        let headers = {
                        Authorization: `Bearer ${accessToken}`
                    }
        return fetch("https://api.spotify.com/v1/me", {
                                                        headers: headers
                                                      }
                                                    ).then(response => {
                                                      return response.json();
                                                    }).then(jsonResponse => {
                                                      let userID = jsonResponse.id
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({
                                      name: playlistName
                                    })
            }).then(response => response.json()
          ).then(jsonResponse => {
            let playlistID = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/{playlistID}/tracks`, {
                headers: headers,
                method:"POST",
                body: JSON.stringify({
                                      uris: trackURIs
                                    })
                              });
                          });
                      });
    } else {
        return;
      }
  }
}

export default Spotify

let accessToken = ""

const redirectURI = "http://localhost:3000/"
const clientID = "f6351574ae514c54b8bc1311b3bfd671"

const Spotify = {
  spotifyAuthorizeURIBase: "https://accounts.spotify.com/authorize",
  urlAccessToken: window.location.href.match(/access_token=([^&]*)/),
  urlExpiresIn: window.location.href.match(/expires_in=([^&]*)/),
  getAccessToken: function() {  //Retrieves accessToken if it is present or available in URL
    if (accessToken) {
      return accessToken
      console.log("Access token available")
    } else if (this.urlAccessToken) {
      const expires_in = Number(this.urlExpiresIn[1])
      window.setTimeout(() => accessToken = "", expires_in * 1000)
      window.history.pushState("Access Token", null, "/")
      return accessToken
      console.log("Access token was available in URL")
    } else {
      window.location = `${this.spotifyAuthorizeURIBase}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      console.log("Access token not available.")
    }
  },

  search: function(searchTerm) {  // Passes term to Spotify request and resturns results in JSON
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
                                                                            headers: {Authorization: `Bearer ${accessToken}`}
                                                                          }).then(response => {
                                                                            return response.json()
                                                                          }).then(JSONResponse => {
                                                                            if (JSONResponse) {
                                                                              return JSONResponse.tracks.items.map(track => ({
                                                                                    id: track.id,
                                                                                    name: track.name,
                                                                                    artist: track.artists[0].name,
                                                                                    album: track.album.name,
                                                                                    uri: track.uri
                                                                                    })
                                                                                  )
                                                                            } else {
                                                                              return []
                                                                            }
                                                                          })
                                                                        }

}

export default Spotify

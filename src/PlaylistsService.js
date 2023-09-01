const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistsWithSongs(playlistId) {
    const playlist = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
      values: [playlistId],
    };

    const song = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id LEFT JOIN playlists ON playlistsongs.playlist_id = playlists.id WHERE playlistsongs.playlist_id = $1',
      values: [playlistId],
    };

    // ambil result kedua query
    const playlists = await this._pool.query(playlist);
    const songs = await this._pool.query(song);

    return {
      playlist: {
        id: playlists.rows[0].id,
        name: playlists.rows[0].name,
        songs: songs.rows,
      },
    };
  }
}

module.exports = PlaylistsService;

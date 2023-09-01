const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistsWithSongs(id) {
    const playlistQuery = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
      values: [id],
    };

    const songsQuery = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id LEFT JOIN playlists ON playlistsongs.playlist_id = playlists.id WHERE playlistsongs.playlist_id = $1',
      values: [id],
    };

    // Eksekusi kedua query
    const playlistResult = await this._pool.query(playlistQuery);
    const songsResult = await this._pool.query(songsQuery);

    // Dapatkan hasil query sebagai objek
    const playlistData = playlistResult.rows[0];
    const songsData = songsResult.rows;

    // Buat objek sesuai format yang diinginkan
    const formattedPlaylist = {
      id: playlistData.id,
      name: playlistData.name,
      songs: songsData.map((song) => ({
        id: song.id,
        title: song.title,
        performer: song.performer,
      })),
    };

    return {
      playlist: formattedPlaylist,
    };
  }
}

module.exports = PlaylistsService;

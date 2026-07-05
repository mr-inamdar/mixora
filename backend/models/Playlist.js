const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); //[cite: 14]
const User = require("./User");
const Song = require("./Song");

const Playlist = sequelize.define("Playlist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner_id: {
  type: DataTypes.INTEGER,
  allowNull: false
}
}, {
  timestamps: true
});

// User to Playlist Relationship[cite: 14]
User.hasMany(Playlist, { foreignKey: "owner_id", onDelete: "CASCADE" });
Playlist.belongsTo(User, { foreignKey: "owner_id" });

// Playlist to Song Relationship (Many-to-Many via explicit through table)[cite: 14]
Playlist.belongsToMany(Song, { through: "PlaylistSongs", foreignKey: "playlist_id" });
Song.belongsToMany(Playlist, { through: "PlaylistSongs", foreignKey: "song_id" });

module.exports = Playlist; //[cite: 14]

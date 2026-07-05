const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); //[cite: 15]
const User = require("./User");

const Song = sequelize.define("Song", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  album: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  urduName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hindiName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  audio_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  uploaded_by: {
  type: DataTypes.INTEGER,
  allowNull: true
}
}, {
  timestamps: true
});

// Relationships[cite: 15]
User.hasMany(Song, {
  foreignKey: "uploaded_by"
});

Song.belongsTo(User, {
  foreignKey: "uploaded_by"
});

module.exports = Song; //[cite: 15]

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    UserID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Fullname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "Username"
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "Email"
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
      {
        name: "Username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Username" },
        ]
      },
      {
        name: "Email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Email" },
        ]
      },
    ]
  });
};

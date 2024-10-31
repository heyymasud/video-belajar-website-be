const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review', {
    ReviewID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    KelasID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kelas',
        key: 'KelasID'
      }
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'UserID'
      }
    },
    Rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Komentar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TanggalReview: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'review',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ReviewID" },
        ]
      },
      {
        name: "KelasID",
        using: "BTREE",
        fields: [
          { name: "KelasID" },
        ]
      },
      {
        name: "UserID",
        using: "BTREE",
        fields: [
          { name: "UserID" },
        ]
      },
    ]
  });
};

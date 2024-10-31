const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('material', {
    MaterialID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ModulID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'modulkelas',
        key: 'ModulID'
      }
    },
    JenisMaterial: {
      type: DataTypes.ENUM('Rangkuman','Video','Quiz'),
      allowNull: false
    },
    Link: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'material',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MaterialID" },
        ]
      },
      {
        name: "ModulID",
        using: "BTREE",
        fields: [
          { name: "ModulID" },
        ]
      },
    ]
  });
};

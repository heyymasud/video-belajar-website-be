const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modulkelas', {
    ModulID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    JudulModul: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    KelasID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kelas',
        key: 'KelasID'
      }
    }
  }, {
    sequelize,
    tableName: 'modulkelas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ModulID" },
        ]
      },
      {
        name: "KelasID",
        using: "BTREE",
        fields: [
          { name: "KelasID" },
        ]
      },
    ]
  });
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    OrderID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'UserID'
      }
    },
    KelasID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kelas',
        key: 'KelasID'
      }
    },
    TanggalOrder: {
      type: DataTypes.DATE,
      allowNull: false
    },
    StatusOrder: {
      type: DataTypes.ENUM('Pending','Completed','Cancelled'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "OrderID" },
        ]
      },
      {
        name: "UserID",
        using: "BTREE",
        fields: [
          { name: "UserID" },
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

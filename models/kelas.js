const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kelas', {
    KelasID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NamaKelas: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    KategoriKelasID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kategorikelas',
        key: 'KategoriKelasID'
      }
    },
    TutorID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tutor',
        key: 'TutorID'
      }
    },
    Harga: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kelas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "KelasID" },
        ]
      },
      {
        name: "KategoriKelasID",
        using: "BTREE",
        fields: [
          { name: "KategoriKelasID" },
        ]
      },
      {
        name: "TutorID",
        using: "BTREE",
        fields: [
          { name: "TutorID" },
        ]
      },
    ]
  });
};

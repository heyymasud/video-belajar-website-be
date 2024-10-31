var DataTypes = require("sequelize").DataTypes;
var _kategorikelas = require("./kategorikelas");
var _kelas = require("./kelas");
var _kelassaya = require("./kelassaya");
var _material = require("./material");
var _modulkelas = require("./modulkelas");
var _order = require("./order");
var _pembayaran = require("./pembayaran");
var _pretest = require("./pretest");
var _review = require("./review");
var _tutor = require("./tutor");
var _user = require("./user");

function initModels(sequelize) {
  var kategorikelas = _kategorikelas(sequelize, DataTypes);
  var kelas = _kelas(sequelize, DataTypes);
  var kelassaya = _kelassaya(sequelize, DataTypes);
  var material = _material(sequelize, DataTypes);
  var modulkelas = _modulkelas(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var pembayaran = _pembayaran(sequelize, DataTypes);
  var pretest = _pretest(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var tutor = _tutor(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  kelas.belongsTo(kategorikelas, { as: "KategoriKela", foreignKey: "KategoriKelasID"});
  kategorikelas.hasMany(kelas, { as: "kelas", foreignKey: "KategoriKelasID"});
  kelassaya.belongsTo(kelas, { as: "Kela", foreignKey: "KelasID"});
  kelas.hasMany(kelassaya, { as: "kelassayas", foreignKey: "KelasID"});
  modulkelas.belongsTo(kelas, { as: "Kela", foreignKey: "KelasID"});
  kelas.hasMany(modulkelas, { as: "modulkelas", foreignKey: "KelasID"});
  order.belongsTo(kelas, { as: "Kela", foreignKey: "KelasID"});
  kelas.hasMany(order, { as: "orders", foreignKey: "KelasID"});
  pretest.belongsTo(kelas, { as: "Kela", foreignKey: "KelasID"});
  kelas.hasMany(pretest, { as: "pretests", foreignKey: "KelasID"});
  review.belongsTo(kelas, { as: "Kela", foreignKey: "KelasID"});
  kelas.hasMany(review, { as: "reviews", foreignKey: "KelasID"});
  material.belongsTo(modulkelas, { as: "Modul", foreignKey: "ModulID"});
  modulkelas.hasMany(material, { as: "materials", foreignKey: "ModulID"});
  pembayaran.belongsTo(order, { as: "Order", foreignKey: "OrderID"});
  order.hasMany(pembayaran, { as: "pembayarans", foreignKey: "OrderID"});
  kelas.belongsTo(tutor, { as: "Tutor", foreignKey: "TutorID"});
  tutor.hasMany(kelas, { as: "kelas", foreignKey: "TutorID"});
  kelassaya.belongsTo(user, { as: "User", foreignKey: "UserID"});
  user.hasMany(kelassaya, { as: "kelassayas", foreignKey: "UserID"});
  order.belongsTo(user, { as: "User", foreignKey: "UserID"});
  user.hasMany(order, { as: "orders", foreignKey: "UserID"});
  review.belongsTo(user, { as: "User", foreignKey: "UserID"});
  user.hasMany(review, { as: "reviews", foreignKey: "UserID"});

  return {
    kategorikelas,
    kelas,
    kelassaya,
    material,
    modulkelas,
    order,
    pembayaran,
    pretest,
    review,
    tutor,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

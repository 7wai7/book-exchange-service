'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  File.init({
    book_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    field: DataTypes.STRING,
    originalName: DataTypes.STRING,
    filename: DataTypes.STRING,
    mime: DataTypes.STRING,
    size: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};
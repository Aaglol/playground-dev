'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
  class PlaygroundFamily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  PlaygroundFamily.init({
    playground_user: DataTypes.INTEGER,
    family_name: DataTypes.STRING,
    family_description: DataTypes.STRING,
    family_status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'playground_families',
  });

  return PlaygroundFamily;
};

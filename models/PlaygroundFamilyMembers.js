'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

const PlaygroundFamily = require('./playgroundfamily');

module.exports = (sequelize) => {
  class PlaygroundFamilyMembers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      console.log('models', models);
    }
  }
  PlaygroundFamilyMembers.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    family_permission: DataTypes.INTEGER,
    connected_family: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'playground_family_members',
  });

  PlaygroundFamilyMembers.belongsTo(PlaygroundFamily(sequelize));

  return PlaygroundFamilyMembers;
};
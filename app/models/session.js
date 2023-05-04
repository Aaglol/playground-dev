'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Session.init({
    user_id: DataTypes.INTEGER,
    user_session: DataTypes.STRING,
    user_session_expires_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'playground_sessions',
    timestamps: false,
  });

  return Session;
};
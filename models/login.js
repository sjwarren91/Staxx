module.exports = function(sequelize, DataTypes) {
  var Login = sequelize.define(
    "Login",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 16]
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 16]
        }
      }
    },
    {
      timestamps: true,
      updatedAt: false
    }
  );

  return Login;
};

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: ["^[a-z]+$", "i"]
        }
      },
      lastname: {
        type: DataTypes.STRING,
        validate: {
          is: ["^[a-z]+$", "i"]
        }
      }
    },
    {
      timestamps: true,
      updatedAt: false
    }
  );

  return User;
};

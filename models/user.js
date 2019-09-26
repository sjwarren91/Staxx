module.exports = function(sequelize, DataTypes) {
  var Owner = sequelize.define(
    "Owner",
    {
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
      },
      goal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
          min: 0.01
        }
      }
    },
    {
      timestamps: true,
      updatedAt: false
    }
  );

  return Owner;
};

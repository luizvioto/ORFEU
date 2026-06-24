import { Model, DataTypes } from "sequelize";
import sequelize from "./dbconfig.js";

class User extends Model {}

User.init(
  { 
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nome: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    telefone: { 
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT, 
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, 
  { 
    sequelize: sequelize, 
    modelName: 'User',
    tableName: 'users',
    timestamps: false 
  }
);

export default User;
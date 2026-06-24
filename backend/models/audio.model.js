import { Model, DataTypes } from "sequelize";
import sequelize from "./dbconfig.js";

class Audio extends Model {}

Audio.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    titulo: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    audio_url: { 
      type: DataTypes.STRING, 
      allowNull: false 
    }
  },
  {
    sequelize: sequelize,
    modelName: 'Audio',
    tableName: 'audios',
    timestamps: true 
  }
);

export default Audio;
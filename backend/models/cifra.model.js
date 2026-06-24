import { Model, DataTypes } from "sequelize";
import sequelize from "./dbconfig.js";

class Cifra extends Model {}

Cifra.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        musica: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        artista: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        modelName: "Cifra",
        tableName: "cifras",
        timestamps: false,
    },
);

export default Cifra;

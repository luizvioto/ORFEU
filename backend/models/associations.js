import User from "./user.model.js";
import Cifra from "./cifra.model.js";
import Audio from "./audio.model.js";

User.hasMany(Cifra, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Cifra.belongsTo(User, {
    foreignKey: "userId",
});

User.hasMany(Audio, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Audio.belongsTo(User, {
    foreignKey: "userId",
});

export { User, Cifra, Audio };

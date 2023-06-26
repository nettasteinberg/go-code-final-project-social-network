import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    } catch (e) {
        console.log(e);
    }
}

export const comparePasswordWithDBPassword = async (passwordFromFront, passwordFromDB) => {
    try {
        return await bcrypt.compare(passwordFromFront, passwordFromDB);
    } catch (e) {
        console.log(e);
    }
}
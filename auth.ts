/** @format */

const bcrypt = require("bcrypt");

export class Auth {
	private static saltRounds: number = 10;

	public static async hashPassword(password: string): Promise<string> {
		const hash: string = await bcrypt.hash(password, this.saltRounds);
		return hash;
	}

	public static async checkPassword(
		password: string,
		hash: string
	): Promise<boolean> {
		const result: boolean = await bcrypt.compare(password, hash);
    return result
	}
}

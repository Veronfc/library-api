/** @format */

const bcrypt = require("bcrypt");

export class Auth {
	private static saltRounds: number = 10;

	public static async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(
			password,
			this.saltRounds,
			(err: Error, hash: string) => {
				return hash;
			}
		);
	}

	public static async checkPassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash, (err: Error, result: boolean) => {
			return result;
		});
	}
}

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Demo: hardcoded admin users
const admins = [
	{
		username: "admin",
		passwordHash: bcrypt.hashSync("admin123", 10),
		role: "admin"
	},
	{
		username: "superadmin",
		passwordHash: bcrypt.hashSync("supersecret", 10),
		role: "superadmin"
	}
];

export async function POST(request: Request) {
	const { username, password } = await request.json();
	const user = admins.find(u => u.username === username);
	if (!user) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
	const valid = await bcrypt.compare(password, user.passwordHash);
	if (!valid) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
	// Set session cookie (for demo, not secure)
	return NextResponse.json({ success: true, role: user.role }, {
		status: 200,
		headers: {
			"Set-Cookie": `isAdmin=true; role=${user.role}; path=/; HttpOnly`
		}
	});
}

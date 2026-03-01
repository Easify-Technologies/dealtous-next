import jwt from "jsonwebtoken";

export function verifyUser(request) {

  try {

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Invalid token");
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET
    );

    // This must match what you put in user login token
    return {
      userId: decoded.userId,
      email: decoded.email
    };

  } catch (error) {

    throw new Error("Unauthorized");

  }

}

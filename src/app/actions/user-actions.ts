"use server";

import fs from "fs";
import path from "path";

export async function updatePasskeyInCode(userId: string, currentPasskey: string, newPasskey: string) {
  try {
    const filePath = path.join(process.cwd(), "src", "lib", "constants", "predefined-users.ts");
    let fileContent = fs.readFileSync(filePath, "utf-8");

    // We need to carefully replace the passkey for the specific user object.
    // Since we know the file structure, we can look for the id: "USER_ID" and then the next passkey: "currentPasskey"
    
    // A simple regex might be tricky if we don't scope it to the block, 
    // but assuming users have unique passkeys or we can just match the block:
    // Regex to find the block for the specific userId and replace its passkey
    
    const userBlockRegex = new RegExp(`(id:\\s*"${userId}"[\\s\\S]*?passkey:\\s*")(${currentPasskey})(")`, "g");
    
    if (!userBlockRegex.test(fileContent)) {
      return { success: false, message: "Invalid current password or user not found." };
    }

    fileContent = fileContent.replace(userBlockRegex, `$1${newPasskey}$3`);

    fs.writeFileSync(filePath, fileContent, "utf-8");
    
    return { success: true, message: "Password updated successfully in source code." };
  } catch (error) {
    console.error("Error updating passkey:", error);
    return { success: false, message: "Server error occurred while updating the file." };
  }
}

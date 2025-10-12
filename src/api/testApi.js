import { authService } from "./services/authService.js";

async function testRegister() {
  try {
    const res = await authService.register({
      first_name: "James",
      last_name: "Rodriguez",
      username: "jrodriguez10",
      email: "james.rodriguez@univalle.edu.co",
      password: "james100810"
    });
    console.log("✅ Registro exitoso:", res);
  } catch (err) {
    console.error("❌ Error al registrar:", err);
  }
}

testRegister();
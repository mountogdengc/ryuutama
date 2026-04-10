import "./styles/ryuutama.css";
import { registerSidebarHook } from "./helpers/sidebar.mjs";

Hooks.once("init", () => {
  console.log("Ryuutama | Initializing Ryuutama system");
  registerSidebarHook();
});

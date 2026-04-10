export function registerSidebarHook() {
  Hooks.on("renderSidebarTab", (app, html) => {
    if (app.tabName !== "chat") return;

    const sidebarEl = html instanceof HTMLElement ? html : html[0];
    if (!sidebarEl) return;

    // Don't inject twice
    if (sidebarEl.querySelector(".ryuutama-journey-controls")) return;

    const controlsDiv = document.createElement("div");
    controlsDiv.classList.add("ryuutama-journey-controls");
    controlsDiv.style.padding = "4px";
    controlsDiv.style.borderBottom = "1px solid var(--color-parchment, #e8d8c0)";

    const currentTerrain = game.settings.get("ryuutama", "terrain");
    const currentWeather = game.settings.get("ryuutama", "weather");
    const night = game.settings.get("ryuutama", "night");

    // Build terrain options
    let terrainOptions = '<option value="">-- None --</option>';
    for (let i = 1; i <= 16; i++) {
      const name = game.settings.get("ryuutama", `terrainName${i}`);
      if (name) {
        const dc = game.settings.get("ryuutama", `terrain${i}`);
        const selected = currentTerrain === `terrain${i}` ? "selected" : "";
        terrainOptions += `<option value="terrain${i}" ${selected}>${name} (DC ${dc})</option>`;
      }
    }

    // Build weather options
    let weatherOptions = '<option value="">-- None --</option>';
    for (let i = 1; i <= 16; i++) {
      const name = game.settings.get("ryuutama", `weatherName${i}`);
      if (name) {
        const dc = game.settings.get("ryuutama", `weather${i}`);
        const selected = currentWeather === `weather${i}` ? "selected" : "";
        weatherOptions += `<option value="weather${i}" ${selected}>${name} (DC ${dc})</option>`;
      }
    }

    if (game.user.isGM) {
      controlsDiv.innerHTML = `
        <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
          <select class="terrain-select" style="flex: 1; min-width: 100px;">${terrainOptions}</select>
          <select class="weather-select" style="flex: 1; min-width: 100px;">${weatherOptions}</select>
          <label style="font-size: 11px;"><input type="checkbox" class="night-toggle" ${night ? "checked" : ""} /> Night</label>
        </div>
      `;

      controlsDiv.querySelector(".terrain-select").addEventListener("change", (e) => {
        game.settings.set("ryuutama", "terrain", e.target.value);
      });
      controlsDiv.querySelector(".weather-select").addEventListener("change", (e) => {
        game.settings.set("ryuutama", "weather", e.target.value);
      });
      controlsDiv.querySelector(".night-toggle").addEventListener("change", (e) => {
        game.settings.set("ryuutama", "night", e.target.checked);
      });
    } else {
      // Players see read-only current conditions
      const terrainName = currentTerrain
        ? game.settings.get("ryuutama", `terrainName${currentTerrain.replace("terrain", "")}`)
        : "None";
      const weatherName = currentWeather
        ? game.settings.get("ryuutama", `weatherName${currentWeather.replace("weather", "")}`)
        : "None";
      controlsDiv.innerHTML = `
        <div style="font-size: 11px; display: flex; gap: 8px;">
          <span>Terrain: <strong>${terrainName}</strong></span>
          <span>Weather: <strong>${weatherName}</strong></span>
          ${night ? "<span>Night</span>" : ""}
        </div>
      `;
    }

    const form = sidebarEl.querySelector("#chat-form");
    if (form) {
      form.parentNode.insertBefore(controlsDiv, form);
    }
  });
}

/**
 * Register the chat message hook for crit/fumble styling.
 */
export function registerChatHooks() {
  Hooks.on("renderChatMessageHTML", (message, html) => {
    if (!message.isRoll || !message.rolls?.length) return;

    const roll = message.rolls[0];
    const dice = roll.dice;
    const smallDice = dice.filter((r) => r.faces < 6);
    const maxRolls = dice.filter((r) => r.results[0].result === r.faces);
    const largeCrits = dice.filter(
      (r) => r.results[0].result === r.faces || r.results[0].result === 6
    );
    const fumbleRolls = dice.filter((r) => r.results[0].result === 1);

    if (
      dice.length > 1 &&
      ((smallDice.length > 0 && maxRolls.length === dice.length) ||
        largeCrits.length === dice.length)
    ) {
      html.querySelector(".dice-total")?.classList.add("critical");
    }
    if (dice.length > 1 && fumbleRolls.length === dice.length) {
      html.querySelector(".dice-total")?.classList.add("fumble");
    }
  });
}

// Modo debug para revisar contenido: se activa tocando 4 veces seguidas el
// título de una categoría en /levels, y queda persistido (no se pierde al
// entrar a un nivel y volver). Se desactiva con el mismo gesto, cantidad de
// taps configurable vía DEBUG_DEACTIVATE_TAPS (subila si querés que sea más
// difícil desactivarlo por error mientras estás revisando contenido).
const DEBUG_UNLOCK_KEY = "imaginalo_debug_unlock_all";

export const DEBUG_ACTIVATE_TAPS = 4;
export const DEBUG_DEACTIVATE_TAPS = 4;
export const DEBUG_ADVANCE_LEVEL_TAPS = 2;

export function isDebugUnlockActive(): boolean {
  return localStorage.getItem(DEBUG_UNLOCK_KEY) === "1";
}

export function setDebugUnlockActive(active: boolean): void {
  if (active) {
    localStorage.setItem(DEBUG_UNLOCK_KEY, "1");
  } else {
    localStorage.removeItem(DEBUG_UNLOCK_KEY);
  }
}

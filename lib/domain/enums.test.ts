import { describe, expect, it } from "vitest";
import { AREAS, AREA_LAST, SENIORITY_LEVELS, isArea, isSeniority } from "./enums";
import { SENIORITY_TONES, avatarTone } from "./palette";

describe("enums canónicos", () => {
  it("tiene los 9 niveles de seniority en orden de mayor a menor", () => {
    expect(SENIORITY_LEVELS).toHaveLength(9);
    expect(SENIORITY_LEVELS[0]).toBe("C-Level");
    expect(SENIORITY_LEVELS.at(-1)).toBe("No identificado");
  });

  it("tiene las 11 áreas con 'Otro' al final", () => {
    expect(AREAS).toHaveLength(11);
    expect(AREAS.at(-1)).toBe(AREA_LAST);
  });

  it("rechaza valores fuera del enum", () => {
    expect(isSeniority("Gerente")).toBe(true);
    expect(isSeniority("Manager")).toBe(false);
    expect(isArea("Tecnología")).toBe(true);
    expect(isArea("Educación")).toBe(false); // del handoff, no del clasificador real
  });
});

describe("paleta", () => {
  it("asigna los 8 tonos y deja 'No identificado' en gris neutro", () => {
    expect(SENIORITY_TONES["C-Level"]).toBe("#26215C");
    expect(SENIORITY_TONES["Trainee"]).toBe("#CFCBF4");
    expect(SENIORITY_TONES["No identificado"]).toBe("rgba(13,27,42,.18)");
  });

  it("da un tono de avatar estable para la misma llave", () => {
    expect(avatarTone("abc")).toBe(avatarTone("abc"));
    expect(avatarTone(0)).toBe("#26215C");
  });
});

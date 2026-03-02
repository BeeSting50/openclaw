import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  loadLazyLocaleTranslation,
  resolveNavigatorLocale,
} from "../../ui/src/i18n/lib/registry.ts";

describe("ui i18n locale registry", () => {
  function readNestedString(map: Record<string, unknown>, path: string[]): string | undefined {
    let current: unknown = map;
    for (const segment of path) {
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[segment];
    }
    return typeof current === "string" ? current : undefined;
  }

  it("lists supported locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "zh-CN", "zh-TW", "pt-BR", "de"]);
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("resolves browser locale fallbacks", () => {
    expect(resolveNavigatorLocale("de-DE")).toBe("de");
    expect(resolveNavigatorLocale("pt-PT")).toBe("pt-BR");
    expect(resolveNavigatorLocale("zh-HK")).toBe("zh-TW");
    expect(resolveNavigatorLocale("en-US")).toBe("en");
  });

  it("loads lazy locale translations from the registry", async () => {
    const de = await loadLazyLocaleTranslation("de");
    const zhCN = await loadLazyLocaleTranslation("zh-CN");

    expect(readNestedString((de ?? {}) as Record<string, unknown>, ["common", "health"])).toBe(
      "Status",
    );
    expect(readNestedString((zhCN ?? {}) as Record<string, unknown>, ["common", "health"])).toBe(
      "健康状况",
    );
    expect(await loadLazyLocaleTranslation("en")).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { buildMeta, jstNow } from "./update-diary-meta.mjs";

const NOW = "2026-03-29 12:00:00";

describe("buildMeta", () => {
  describe("優先度1: パスが一致 → IDと日付をそのまま保持", () => {
    it("既存エントリがそのまま保持される", () => {
      const oldMeta = {
        "1": { path: "テスト日記.md", created_at: "2026-03-28 00:00:00" },
        "2": { path: "2026-03/新しいキーボードを買った.md", created_at: "2026-03-15 20:00:00" },
      };
      const files = ["テスト日記.md", "2026-03/新しいキーボードを買った.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["1"]).toEqual({ path: "テスト日記.md", created_at: "2026-03-28 00:00:00" });
      expect(newMeta["2"]).toEqual({ path: "2026-03/新しいキーボードを買った.md", created_at: "2026-03-15 20:00:00" });
      expect(changed).toBe(false);
    });
  });

  describe("優先度2: basename 一致（ディレクトリ移動）→ IDと日付引き継ぎ", () => {
    it("ルートからサブディレクトリへ移動した場合、IDと日付が保持される", () => {
      const oldMeta = {
        "1": { path: "テスト日記.md", created_at: "2026-03-28 00:00:00" },
      };
      const files = ["2026-03/テスト日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["1"]).toEqual({ path: "2026-03/テスト日記.md", created_at: "2026-03-28 00:00:00" });
      expect(newMeta["2"]).toBeUndefined();
      expect(changed).toBe(true);
    });

    it("サブディレクトリ間の移動でも IDと日付が保持される", () => {
      const oldMeta = {
        "1": { path: "2026-01/日記.md", created_at: "2026-01-01 10:00:00" },
      };
      const files = ["2026-03/日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["1"]).toEqual({ path: "2026-03/日記.md", created_at: "2026-01-01 10:00:00" });
      expect(changed).toBe(true);
    });
  });

  describe("優先度3: 日付プレフィックス一致（改名検出）→ IDと日付引き継ぎ", () => {
    it("ファイル名が変わっても日付プレフィックスが同じならIDが保持される", () => {
      const oldMeta = {
        "1": { path: "20260317-お仕事あれこれ20260317.md", created_at: "2026-03-17 23:37:01" },
      };
      const files = ["20260317-お仕事あれこれ.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["1"]).toEqual({ path: "20260317-お仕事あれこれ.md", created_at: "2026-03-17 23:37:01" });
      expect(newMeta["2"]).toBeUndefined();
      expect(changed).toBe(true);
    });

    it("削除+改名が同時に起きた場合、日付プレフィックスで先勝ち", () => {
      const oldMeta = {
        "37": { path: "20260317-お仕事あれこれ20260317.md", created_at: "2026-03-17 23:37:01" },
        "38": { path: "20260317.md", created_at: "2026-03-17 23:37:01" },
      };
      const files = ["20260317-お仕事あれこれ.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      // ID 37 が先勝ちで引き継がれる
      expect(newMeta["37"]).toEqual({ path: "20260317-お仕事あれこれ.md", created_at: "2026-03-17 23:37:01" });
      expect(newMeta["38"]).toBeUndefined();
      expect(newMeta["39"]).toBeUndefined();
      expect(changed).toBe(true);
    });
  });

  describe("優先度4: 新規ファイル → 新しいIDを採番して現在時刻付与", () => {
    it("旧JSONに存在しないファイルには新IDと現在時刻が付与される", () => {
      const oldMeta = {};
      const files = ["2026-03/新しい日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["1"]).toEqual({ path: "2026-03/新しい日記.md", created_at: NOW });
      expect(changed).toBe(true);
    });

    it("既存エントリがある場合、新規ファイルは max(ID)+1 で採番される", () => {
      const oldMeta = {
        "1": { path: "テスト日記.md", created_at: "2026-03-28 00:00:00" },
      };
      const files = ["テスト日記.md", "20260317.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2"]).toEqual({ path: "20260317.md", created_at: NOW });
      expect(changed).toBe(true);
    });
  });

  describe("孤立エントリの削除", () => {
    it("ファイルが削除された場合、対応するIDが消える", () => {
      const oldMeta = {
        "1": { path: "テスト日記.md", created_at: "2026-03-28 00:00:00" },
        "2": { path: "削除された日記.md", created_at: "2026-03-01 00:00:00" },
      };
      const files = ["テスト日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2"]).toBeUndefined();
      expect(Object.keys(newMeta)).toEqual(["1"]);
      expect(changed).toBe(true);
    });

    it("削除されたIDは再利用されない", () => {
      const oldMeta = {
        "1": { path: "テスト日記.md", created_at: "2026-03-28 00:00:00" },
        "2": { path: "削除される.md", created_at: "2026-03-01 00:00:00" },
      };
      const files = ["テスト日記.md", "新規追加.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2"]).toBeUndefined();
      expect(newMeta["3"]).toEqual({ path: "新規追加.md", created_at: NOW });
      expect(changed).toBe(true);
    });
  });

  describe("差分なし時", () => {
    it("ファイル構成に変更がなければ changed が false", () => {
      const oldMeta = {
        "1": { path: "2026-01/初詣に行った.md", created_at: "2026-01-01 10:00:00" },
        "2": { path: "2026-03/キーボード.md", created_at: "2026-03-15 20:00:00" },
      };
      const files = ["2026-01/初詣に行った.md", "2026-03/キーボード.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(changed).toBe(false);
      expect(newMeta).toEqual(oldMeta);
    });
  });

  describe("複合シナリオ", () => {
    it("追加・移動・削除が同時に発生する場合", () => {
      const oldMeta = {
        "1": { path: "テスト日記.md", created_at: "2026-03-28 00:00:00" },
        "2": { path: "2026-01/初詣に行った.md", created_at: "2026-01-01 10:00:00" },
        "3": { path: "削除対象.md", created_at: "2026-02-01 00:00:00" },
      };
      // テスト日記.md → 2026-03/テスト日記.md (移動)
      // 初詣に行った.md → そのまま (保持)
      // 削除対象.md → 削除
      // 新規追加.md → 新規
      const files = [
        "2026-03/テスト日記.md",
        "2026-01/初詣に行った.md",
        "新規追加.md",
      ];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2"]).toEqual({ path: "2026-01/初詣に行った.md", created_at: "2026-01-01 10:00:00" });
      expect(newMeta["1"]).toEqual({ path: "2026-03/テスト日記.md", created_at: "2026-03-28 00:00:00" });
      expect(newMeta["4"]).toEqual({ path: "新規追加.md", created_at: NOW });
      expect(newMeta["3"]).toBeUndefined();
      expect(changed).toBe(true);
    });

    it("同名ファイルが異なるディレクトリにある場合、先勝ちとなる", () => {
      const oldMeta = {
        "1": { path: "日記.md", created_at: "2026-01-01 00:00:00" },
      };
      // 同名ファイルが2箇所に存在（移動 + 新規と区別つかないケース）
      const files = ["2026-01/日記.md", "2026-02/日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      // ソート順で 2026-01 が先に処理され、ID=1 を引き継ぐ
      expect(newMeta["1"]).toEqual({ path: "2026-01/日記.md", created_at: "2026-01-01 00:00:00" });
      // 2番目は usedIds に 1 が登録済みなので新規採番
      expect(newMeta["2"]).toEqual({ path: "2026-02/日記.md", created_at: NOW });
      expect(changed).toBe(true);
    });
  });
});

describe("jstNow", () => {
  it("UTC 2026-03-29T03:00:00Z → JST 2026-03-29 12:00:00", () => {
    const date = new Date("2026-03-29T03:00:00Z");
    expect(jstNow(date)).toBe("2026-03-29 12:00:00");
  });

  it("日付をまたぐケース: UTC 2026-03-29T20:00:00Z → JST 2026-03-30 05:00:00", () => {
    const date = new Date("2026-03-29T20:00:00Z");
    expect(jstNow(date)).toBe("2026-03-30 05:00:00");
  });

  it("YYYY-MM-DD HH:mm:ss 形式で出力される", () => {
    const result = jstNow(new Date("2026-01-05T00:05:09Z"));
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(result).toBe("2026-01-05 09:05:09");
  });
});

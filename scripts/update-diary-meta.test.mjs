import { describe, it, expect } from "vitest";
import { buildMeta, jstNow } from "./update-diary-meta.mjs";

const NOW = "2026-03-29 12:00:00";

describe("buildMeta", () => {
  describe("優先度1: 相対パスが一致 → 日付をそのまま保持", () => {
    it("既存エントリがそのまま保持される", () => {
      const oldMeta = {
        "テスト日記.md": "2026-03-28 00:00:00",
        "2026-03/新しいキーボードを買った.md": "2026-03-15 20:00:00",
      };
      const files = ["テスト日記.md", "2026-03/新しいキーボードを買った.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["テスト日記.md"]).toBe("2026-03-28 00:00:00");
      expect(newMeta["2026-03/新しいキーボードを買った.md"]).toBe(
        "2026-03-15 20:00:00"
      );
      expect(changed).toBe(false);
    });
  });

  describe("優先度2: ファイル名一致（ディレクトリ移動）→ 日付引き継ぎ", () => {
    it("ルートからサブディレクトリへ移動した場合、日付が保持される", () => {
      const oldMeta = {
        "テスト日記.md": "2026-03-28 00:00:00",
      };
      const files = ["2026-03/テスト日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2026-03/テスト日記.md"]).toBe("2026-03-28 00:00:00");
      expect(newMeta["テスト日記.md"]).toBeUndefined();
      expect(changed).toBe(true);
    });

    it("サブディレクトリ間の移動でも日付が保持される", () => {
      const oldMeta = {
        "2026-01/日記.md": "2026-01-01 10:00:00",
      };
      const files = ["2026-03/日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2026-03/日記.md"]).toBe("2026-01-01 10:00:00");
      expect(changed).toBe(true);
    });
  });

  describe("優先度3: 新規ファイル → 現在時刻付与", () => {
    it("旧JSONに存在しないファイルには現在時刻が付与される", () => {
      const oldMeta = {};
      const files = ["2026-03/新しい日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["2026-03/新しい日記.md"]).toBe(NOW);
      expect(changed).toBe(true);
    });
  });

  describe("孤立エントリの削除", () => {
    it("ファイルが削除された場合、対応するキーが消える", () => {
      const oldMeta = {
        "テスト日記.md": "2026-03-28 00:00:00",
        "削除された日記.md": "2026-03-01 00:00:00",
      };
      const files = ["テスト日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      expect(newMeta["削除された日記.md"]).toBeUndefined();
      expect(Object.keys(newMeta)).toEqual(["テスト日記.md"]);
      expect(changed).toBe(true);
    });
  });

  describe("差分なし時", () => {
    it("ファイル構成に変更がなければ changed が false", () => {
      const oldMeta = {
        "2026-01/初詣に行った.md": "2026-01-01 10:00:00",
        "2026-03/キーボード.md": "2026-03-15 20:00:00",
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
        "テスト日記.md": "2026-03-28 00:00:00",
        "2026-01/初詣に行った.md": "2026-01-01 10:00:00",
        "削除対象.md": "2026-02-01 00:00:00",
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

      expect(newMeta["2026-01/初詣に行った.md"]).toBe("2026-01-01 10:00:00");
      expect(newMeta["2026-03/テスト日記.md"]).toBe("2026-03-28 00:00:00");
      expect(newMeta["新規追加.md"]).toBe(NOW);
      expect(newMeta["テスト日記.md"]).toBeUndefined();
      expect(newMeta["削除対象.md"]).toBeUndefined();
      expect(changed).toBe(true);
    });

    it("同名ファイルが異なるディレクトリにある場合、先勝ちとなる", () => {
      const oldMeta = {
        "日記.md": "2026-01-01 00:00:00",
      };
      // 同名ファイルが2箇所に存在（移動 + 新規と区別つかないケース）
      const files = ["2026-01/日記.md", "2026-02/日記.md"];

      const { newMeta, changed } = buildMeta(oldMeta, files, NOW);

      // filenameToDate は先勝ち、ソート順で 2026-01 が先に処理される
      expect(newMeta["2026-01/日記.md"]).toBe("2026-01-01 00:00:00");
      // 2番目は filenameToDate から既に取得済みの値を使う
      // （buildMeta は filenameToDate を消費しないので両方とも旧日付を取得）
      expect(newMeta["2026-02/日記.md"]).toBe("2026-01-01 00:00:00");
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

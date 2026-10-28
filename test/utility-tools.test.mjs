import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { analyzeText } from "../src/tools/utility/wordCounter.js";
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toAlternatingCase,
  toInverseCase,
} from "../src/tools/utility/caseConverter.js";
import {
  formatJson,
  validateJson,
  sortKeysRecursively,
  unescapeJsonString,
} from "../src/tools/utility/jsonFormatter.js";
import {
  encodeBase64,
  decodeBase64,
} from "../src/tools/utility/base64Tool.js";
import {
  encodeUrl,
  decodeUrl,
  parseUrlParameters,
  rebuildUrl,
} from "../src/tools/utility/urlTool.js";
import {
  calculateWhatIsPercentOf,
  calculatePercentIsWhatOf,
  calculatePercentageChange,
  calculateAddSubtractPercent,
} from "../src/tools/utility/percentageCalculator.js";
import { calculateAge } from "../src/tools/utility/ageCalculator.js";
import { generateSingleUuid, generateUuids } from "../src/tools/utility/uuidGenerator.js";
import { md5, shaDigest, calculateAllHashes } from "../src/tools/utility/hashGenerator.js";
import { computeTextDiff } from "../src/tools/utility/textDiff.js";
import { generateSlug } from "../src/tools/utility/slugGenerator.js";
import {
  generateQrSvg,
  formatWifiString,
  formatVCardString,
} from "../src/tools/utility/qrCodeGenerator.js";
import { jsonToCsv, csvToJson, flattenObject } from "../src/tools/utility/csvConverter.js";
import {
  textToList,
  shuffleList,
  sortList,
  deduplicateList,
  reverseList,
  wrapListItems,
  chunkList,
  setOperations,
} from "../src/tools/utility/listTools.js";
import { decodeJwt } from "../src/tools/utility/jwtDecoder.js";
import { timestampToDate, dateToTimestamp } from "../src/tools/utility/timestampConverter.js";
import { generatePassword, calculateEntropy } from "../src/tools/utility/passwordGenerator.js";
import {
  getAvailableTools,
  getToolById,
  searchTools,
} from "../src/data/toolsRegistry.js";

describe("1. Word Counter Core Logic", () => {
  test("analyzes word, character, sentence, and paragraph counts accurately", () => {
    const sample = "The quick brown fox jumps over the lazy dog.\n\nAntigravity is amazing!";
    const res = analyzeText(sample);

    assert.equal(res.wordCount, 12);
    assert.equal(res.paragraphCount, 2);
    assert.equal(res.sentenceCount, 2);
    assert.ok(res.characterCount > 50);
    assert.ok(res.charactersNoSpaces < res.characterCount);
    assert.ok(res.readingTimeSeconds >= 0);
    assert.ok(res.speakingTimeSeconds >= 0);
  });

  test("handles empty string safely", () => {
    const res = analyzeText("");
    assert.equal(res.wordCount, 0);
    assert.equal(res.characterCount, 0);
    assert.equal(res.sentenceCount, 0);
    assert.equal(res.paragraphCount, 0);
  });
});

describe("2. Case Converter Core Logic", () => {
  test("transforms case styles accurately", () => {
    const input = "hello world and quick brown fox";

    assert.equal(toUpperCase(input), "HELLO WORLD AND QUICK BROWN FOX");
    assert.equal(toLowerCase("HELLO"), "hello");
    assert.equal(toCamelCase(input), "helloWorldAndQuickBrownFox");
    assert.equal(toPascalCase(input), "HelloWorldAndQuickBrownFox");
    assert.equal(toSnakeCase(input), "hello_world_and_quick_brown_fox");
    assert.equal(toKebabCase(input), "hello-world-and-quick-brown-fox");
    assert.equal(toConstantCase(input), "HELLO_WORLD_AND_QUICK_BROWN_FOX");
    assert.equal(toTitleCase("the quick brown fox"), "The Quick Brown Fox");
    assert.equal(toSentenceCase("first sentence. second sentence!"), "First sentence. Second sentence!");
    assert.equal(toInverseCase("AbCd"), "aBcD");
  });
});

describe("3. JSON Formatter & Validator Core Logic", () => {
  test("formats, minifies, sorts keys and handles invalid syntax", () => {
    const unformatted = '{"b": 2, "a": 1, "c": [3, 2]}';
    const formatted = formatJson(unformatted, { indent: 2, sortKeys: true });

    assert.equal(formatted.success, true);
    assert.ok(formatted.output.includes('"a": 1'));

    const minified = formatJson(unformatted, { minify: true });
    assert.equal(minified.success, true);
    assert.equal(minified.output, '{"b":2,"a":1,"c":[3,2]}');

    const invalid = validateJson('{"bad": json}');
    assert.equal(invalid.valid, false);
    assert.ok(invalid.error !== null);

    const unescaped = unescapeJsonString('\\"hello\\": \\"world\\"');
    assert.equal(unescaped, '"hello": "world"');
  });
});

describe("4. Base64 Core Logic", () => {
  test("safely encodes and decodes Unicode & emojis", () => {
    const unicodeText = "Hello World! 🚀 Café München 123";
    const encoded = encodeBase64(unicodeText);
    const decoded = decodeBase64(encoded);

    assert.equal(decoded.success, true);
    assert.equal(decoded.output, unicodeText);

    // URL safe mode
    const urlSafe = encodeBase64("subject?test=1&value=yes+", { urlSafe: true });
    assert.ok(!urlSafe.includes("+"));
    assert.ok(!urlSafe.includes("/"));
    assert.equal(decodeBase64(urlSafe).output, "subject?test=1&value=yes+");

    // Invalid base64 detection
    const bad = decodeBase64("$$$NOT_VALID_BASE64###");
    assert.equal(bad.success, false);
  });
});

describe("5. URL Tool Core Logic", () => {
  test("encodes, decodes, and parses query parameters", () => {
    const encoded = encodeUrl("name=John Doe & Sons", "component");
    assert.equal(encoded, "name%3DJohn%20Doe%20%26%20Sons");

    const decoded = decodeUrl(encoded);
    assert.equal(decoded.success, true);
    assert.equal(decoded.output, "name=John Doe & Sons");

    const parsed = parseUrlParameters("https://example.com/search?q=pdf+tools&lang=en#results");
    assert.equal(parsed.host, "example.com");
    assert.equal(parsed.params.length, 2);
    assert.equal(parsed.params[0].key, "q");
    assert.equal(parsed.params[1].key, "lang");

    const rebuilt = rebuildUrl("https://example.com/search", [
      { key: "page", value: "2" },
    ], "#top");
    assert.equal(rebuilt, "https://example.com/search?page=2#top");
  });
});

describe("6. Percentage Calculator Core Logic", () => {
  test("calculates percentages and changes accurately", () => {
    const whatIs = calculateWhatIsPercentOf(20, 150);
    assert.equal(whatIs.result, 30);

    const isWhat = calculatePercentIsWhatOf(30, 150);
    assert.equal(isWhat.result, 20);

    const changeInc = calculatePercentageChange(50, 75);
    assert.equal(changeInc.percent, 50);
    assert.equal(changeInc.type, "increase");

    const changeDec = calculatePercentageChange(100, 80);
    assert.equal(changeDec.percent, 20);
    assert.equal(changeDec.type, "decrease");

    const addTax = calculateAddSubtractPercent(100, 18, "add");
    assert.equal(addTax.result, 118);

    const discount = calculateAddSubtractPercent(200, 25, "subtract");
    assert.equal(discount.result, 150);
  });
});

describe("7. Age Calculator Core Logic", () => {
  test("calculates exact calendar age and birthday metrics", () => {
    const birth = "2000-05-15";
    const target = "2024-05-15";
    const res = calculateAge(birth, target);

    assert.equal(res.years, 24);
    assert.equal(res.months, 0);
    assert.equal(res.days, 0);
    assert.ok(res.totalDays > 8000);
    assert.equal(res.dayBorn, "Monday");
    assert.equal(res.zodiac.sign, "Taurus");
  });
});

describe("8. UUID Generator Core Logic", () => {
  test("generates valid RFC 4122 v4 UUIDs", () => {
    const single = generateSingleUuid();
    assert.match(
      single,
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

    const bulk = generateUuids({ count: 5, uppercase: true, hyphens: false, wrap: "braces" });
    assert.equal(bulk.length, 5);
    assert.ok(bulk[0].startsWith("{"));
    assert.ok(bulk[0].endsWith("}"));
    assert.ok(!bulk[0].includes("-"));
  });
});

describe("9. Hash Generator Core Logic", () => {
  test("calculates standard MD5 and SHA digests matching reference vectors", async () => {
    assert.equal(md5("hello"), "5d41402abc4b2a76b9719d911017c592");

    const sha256Val = await shaDigest("SHA-256", "hello");
    assert.equal(sha256Val, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");

    const all = await calculateAllHashes("test string");
    assert.ok(all.md5.length === 32);
    assert.ok(all.sha1.length === 40);
    assert.ok(all.sha256.length === 64);
    assert.ok(all.sha384.length === 96);
    assert.ok(all.sha512.length === 128);
  });
});

describe("10. Text Diff Core Logic", () => {
  test("computes additions, deletions and identical lines correctly", () => {
    const orig = "Line 1\nLine 2\nLine 3";
    const mod = "Line 1\nLine 2 Modified\nLine 3\nLine 4";

    const diff = computeTextDiff(orig, mod);
    assert.equal(diff.stats.additions, 2);
    assert.equal(diff.stats.deletions, 1);
    assert.equal(diff.stats.unchanged, 2);
  });
});

describe("11. Slug Generator Core Logic", () => {
  test("generates clean URL slugs with accent stripping and stop words", () => {
    const title = "Top 10 Best PDF & Online Tools in 2026: A Full Review!";
    const slug = generateSlug(title, { separator: "-", lowercase: true });
    assert.equal(slug, "top-10-best-pdf-online-tools-in-2026-a-full-review");

    const french = generateSlug("Crème Brûlée Déjà Vu");
    assert.equal(french, "creme-brulee-deja-vu");

    const withStopWords = generateSlug("This is a test of the slug generator", {
      removeStopWords: true,
    });
    assert.equal(withStopWords, "test-slug-generator");
  });
});

describe("13. QR Code Generator Core Logic", () => {
  test("generates valid SVG markup and supports WiFi and vCard strings", () => {
    const svg = generateQrSvg("https://www.bitsandtools.com");
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.includes("</svg>"));
    assert.ok(svg.includes("<rect"));

    const wifi = formatWifiString({ ssid: "HomeWiFi", password: "SecretPassword123" });
    assert.equal(wifi, "WIFI:T:WPA;S:HomeWiFi;P:SecretPassword123;H:false;;");

    const vcard = formatVCardString({ name: "Alex Turner", phone: "+1234567890", email: "alex@example.com" });
    assert.ok(vcard.includes("BEGIN:VCARD"));
    assert.ok(vcard.includes("FN:Alex Turner"));
    assert.ok(vcard.includes("END:VCARD"));
  });
});

describe("14. JSON to CSV & CSV to JSON Core Logic", () => {
  test("converts array of objects to CSV with headers and RFC 4180 escaping", () => {
    const sample = [
      { id: 1, name: 'Alice "Tech" Smith', role: "Engineer" },
      { id: 2, name: "Bob, Jr.", role: "Designer" },
    ];
    const res = jsonToCsv(sample);
    assert.equal(res.success, true);
    assert.equal(res.rowCount, 2);
    assert.ok(res.output.includes("id,name,role"));
    assert.ok(res.output.includes('"Alice ""Tech"" Smith"'));
    assert.ok(res.output.includes('"Bob, Jr."'));

    // Reverse conversion
    const backToJson = csvToJson(res.output);
    assert.equal(backToJson.success, true);
    assert.equal(backToJson.data.length, 2);
    assert.equal(backToJson.data[0].id, 1);
    assert.equal(backToJson.data[0].name, 'Alice "Tech" Smith');
  });

  test("flattens nested JSON objects into dot-notated columns", () => {
    const nested = [{ user: { name: "John", address: { city: "Berlin" } } }];
    const res = jsonToCsv(nested, { flatten: true });
    assert.equal(res.success, true);
    assert.ok(res.output.includes("user.name,user.address.city"));
  });
});

describe("15. List Tools Core Logic", () => {
  test("shuffles, sorts, deduplicates, and wraps list items", () => {
    const raw = "Banana\nApple\nCherry\nBanana\napple";
    const list = textToList(raw);
    assert.equal(list.length, 5);

    const dedup = deduplicateList(list, false);
    assert.equal(dedup.uniqueCount, 3);
    assert.equal(dedup.removedCount, 2);

    const sortedAsc = sortList(list, { order: "asc" });
    assert.equal(sortedAsc[0].toLowerCase(), "apple");

    const reversed = reverseList(["1", "2", "3"]);
    assert.deepEqual(reversed, ["3", "2", "1"]);

    const wrapped = wrapListItems(["A", "B"], "'", "'");
    assert.deepEqual(wrapped, ["'A'", "'B'"]);

    const chunked = chunkList(["1", "2", "3", "4", "5"], 2);
    assert.equal(chunked.length, 3);
    assert.deepEqual(chunked[0], ["1", "2"]);

    // Set operations
    const setA = ["Apple", "Orange", "Banana"];
    const setB = ["Banana", "Grape", "Apple"];
    const intersect = setOperations(setA, setB, "intersection");
    assert.deepEqual(intersect.sort(), ["Apple", "Banana"]);

    const diff = setOperations(setA, setB, "diffA");
    assert.deepEqual(diff, ["Orange"]);
  });
});

describe("16. JWT Decoder Core Logic", () => {
  test("decodes header, payload, and claims from a valid token", () => {
    // Standard mock JWT token (alg: HS256, payload: { sub: "1234567890", name: "John Doe", iat: 1516239022, exp: 4102444800 })
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
      "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjQxMDI0NDQ4MDB9." +
      "4PE_smJeA5d22s_b_w-K_e3P6VfX4zJ2b5zE-vF7FqU";

    const res = decodeJwt(token);
    assert.equal(res.success, true);
    assert.equal(res.header.alg, "HS256");
    assert.equal(res.payload.name, "John Doe");
    assert.equal(res.claims.isExpired, false); // expires in 2100
    assert.ok(res.claims.expirationDate !== null);
  });

  test("rejects invalid JWT string safely", () => {
    const res = decodeJwt("not.a.valid.jwt.token");
    assert.equal(res.success, false);
    assert.ok(res.error.includes("Invalid JWT format"));
  });
});

describe("17. Unix Timestamp Converter Core Logic", () => {
  test("converts epoch seconds and milliseconds to date formats", () => {
    const epochSec = 1700000000;
    const res = timestampToDate(epochSec);
    assert.equal(res.epochSeconds, 1700000000);
    assert.equal(res.iso, "2023-11-14T22:13:20.000Z");
    assert.equal(res.dayOfWeek, "Tuesday");

    // Milliseconds check
    const epochMs = 1700000000000;
    const resMs = timestampToDate(epochMs);
    assert.equal(resMs.epochSeconds, 1700000000);

    // Date to timestamp check
    const fromDate = dateToTimestamp("2023-11-14T22:13:20.000Z");
    assert.equal(fromDate.epochSeconds, 1700000000);
  });
});

describe("18. Password Generator Core Logic", () => {
  test("generates strong passwords with NIST entropy rating", () => {
    const res = generatePassword({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true });
    assert.equal(res.password.length, 20);
    assert.ok(/[A-Z]/.test(res.password));
    assert.ok(/[a-z]/.test(res.password));
    assert.ok(/\d/.test(res.password));
    assert.ok(/[^a-zA-Z\d]/.test(res.password));
    assert.ok(res.entropy.bits >= 80);
    assert.ok(res.entropy.score === "Strong" || res.entropy.score === "Very Strong");

    // Passphrase mode
    const pass = generatePassword({ mode: "passphrase", wordCount: 4, separator: "-" });
    assert.equal(pass.password.split("-").length, 4);
    assert.ok(pass.entropy.bits > 30);
  });
});

describe("19. Option 3 Tools Registry & Page Metadata Verification", () => {
  test("Option 3 tools are active, available, and registered in toolsRegistry", async () => {
    const { getAvailableTools, getToolById } = await import("../src/data/toolsRegistry.js");
    const available = getAvailableTools();
    assert.equal(available.length, 55);

    const option3Ids = [
      "qr-code-generator",
      "json-to-csv",
      "list-tools",
      "jwt-decoder",
      "timestamp-converter",
      "password-generator",
    ];

    for (const id of option3Ids) {
      const tool = getToolById(id);
      assert.ok(tool, `Tool ${id} must exist in registry`);
      assert.equal(tool.status, "available", `Tool ${id} must have status available`);
      assert.equal(tool.route, `/${id}`, `Tool ${id} must route to /${id}`);
    }
  });

  test("Option 3 pages export valid canonical metadata and schemas", () => {
    const pages = [
      { name: "QR Code Generator", path: "src/app/qr-code-generator/page.jsx", canonical: "/qr-code-generator" },
      { name: "JSON to CSV", path: "src/app/json-to-csv/page.jsx", canonical: "/json-to-csv" },
      { name: "List Tools", path: "src/app/list-tools/page.jsx", canonical: "/list-tools" },
      { name: "JWT Decoder", path: "src/app/jwt-decoder/page.jsx", canonical: "/jwt-decoder" },
      { name: "Unix Timestamp Converter", path: "src/app/timestamp-converter/page.jsx", canonical: "/timestamp-converter" },
      { name: "Password Generator", path: "src/app/password-generator/page.jsx", canonical: "/password-generator" },
    ];

    for (const page of pages) {
      const content = fs.readFileSync(page.path, "utf8");
      assert.ok(content.includes(`canonical: "${page.canonical}"`), `${page.name} must specify canonical`);
      assert.ok(content.includes("export const metadata = {"), `${page.name} must export metadata`);
      assert.ok(content.includes('"@type": "WebApplication"'), `${page.name} must include WebApplication schema`);
      assert.ok(content.includes("<FAQSection"), `${page.name} must include FAQSection`);
      assert.ok(content.includes("<HowItWorks"), `${page.name} must include HowItWorks`);
      assert.ok(content.includes("<RelatedTools"), `${page.name} must include RelatedTools`);
    }
  });
});

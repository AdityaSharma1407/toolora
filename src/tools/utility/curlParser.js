/**
 * Client-Side cURL Command Parser & Multi-Language Code Generator.
 * Parses cURL bash commands into structured HTTP request components (Method, URL, Headers, Body, Auth).
 * Generates ready-to-run code for JavaScript (Fetch), Axios, Python (Requests), Node.js, PHP, and Go.
 * 100% pure JavaScript with zero external dependencies.
 */

/**
 * Tokenizes a command line string respecting single, double quotes, and escaped characters.
 * @param {string} cmd
 * @returns {string[]}
 */
export function tokenizeCommandLine(cmd = "") {
  // Normalize multi-line backslashes
  const clean = cmd
    .replace(/\\\r?\n/g, " ")
    .replace(/[\r\n]+/g, " ")
    .trim();

  const tokens = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (/\s/.test(char) && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Parses a cURL command into structured HTTP request details.
 * @param {string} curlCmd
 * @returns {{
 *   method: string,
 *   url: string,
 *   headers: Record<string, string>,
 *   data: string | null,
 *   auth: { user?: string, pass?: string } | null
 * }}
 */
export function parseCurl(curlCmd = "") {
  const tokens = tokenizeCommandLine(curlCmd);
  let method = "GET";
  let explicitMethod = false;
  let url = "";
  const headers = {};
  let data = null;
  let auth = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === "curl") continue;

    // Method: -X, --request
    if ((token === "-X" || token === "--request") && i + 1 < tokens.length) {
      method = tokens[++i].toUpperCase();
      explicitMethod = true;
      continue;
    }

    // Headers: -H, --header
    if ((token === "-H" || token === "--header") && i + 1 < tokens.length) {
      const headerStr = tokens[++i];
      const colonIdx = headerStr.indexOf(":");
      if (colonIdx > 0) {
        const key = headerStr.slice(0, colonIdx).trim();
        const value = headerStr.slice(colonIdx + 1).trim();
        headers[key] = value;
      }
      continue;
    }

    // Body Data: -d, --data, --data-raw, --data-binary, --json
    if (
      (token === "-d" ||
        token === "--data" ||
        token === "--data-raw" ||
        token === "--data-binary" ||
        token === "--json") &&
      i + 1 < tokens.length
    ) {
      data = tokens[++i];
      if (!explicitMethod && method === "GET") {
        method = "POST";
      }
      if (token === "--json") {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
      }
      continue;
    }

    // Basic Auth: -u, --user
    if ((token === "-u" || token === "--user") && i + 1 < tokens.length) {
      const authStr = tokens[++i];
      const [user, pass] = authStr.split(":");
      auth = { user, pass: pass || "" };
      continue;
    }

    // User-Agent: -A, --user-agent
    if ((token === "-A" || token === "--user-agent") && i + 1 < tokens.length) {
      headers["User-Agent"] = tokens[++i];
      continue;
    }

    // Cookie: -b, --cookie
    if ((token === "-b" || token === "--cookie") && i + 1 < tokens.length) {
      headers["Cookie"] = tokens[++i];
      continue;
    }

    // URL token: check if not an option
    if (!token.startsWith("-") && !url) {
      url = token.replace(/^['"]|['"]$/g, "");
    }
  }

  // If basic auth present, encode header if not explicitly set
  if (auth && !headers["Authorization"]) {
    try {
      const base64Auth = typeof btoa === "function" 
        ? btoa(`${auth.user}:${auth.pass}`) 
        : Buffer.from(`${auth.user}:${auth.pass}`).toString("base64");
      headers["Authorization"] = `Basic ${base64Auth}`;
    } catch {
      // Ignore encoding error in fallback
    }
  }

  return { method, url, headers, data, auth };
}

/**
 * Generates Fetch JavaScript code snippet.
 */
export function generateFetchCode(parsed) {
  const { method, url, headers, data } = parsed;
  const options = {
    method,
  };

  if (Object.keys(headers).length > 0) {
    options.headers = headers;
  }

  if (data) {
    options.body = data;
  }

  const optionsStr = JSON.stringify(options, null, 2);

  return `const response = await fetch("${url || "https://api.example.com"}", ${optionsStr});
const result = await response.json();
console.log(result);`;
}

/**
 * Generates Axios code snippet.
 */
export function generateAxiosCode(parsed) {
  const { method, url, headers, data } = parsed;
  let parsedData = null;
  if (data) {
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }
  }

  const config = {
    method: method.toLowerCase(),
    url: url || "https://api.example.com",
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    data: parsedData,
  };

  return `import axios from 'axios';

const response = await axios(${JSON.stringify(config, null, 2)});
console.log(response.data);`;
}

/**
 * Generates Python Requests code snippet.
 */
export function generatePythonCode(parsed) {
  const { method, url, headers, data } = parsed;
  const lines = ["import requests", ""];

  if (Object.keys(headers).length > 0) {
    lines.push(`headers = ${JSON.stringify(headers, null, 4)}`);
  } else {
    lines.push("headers = {}");
  }

  let bodyArg = "";
  if (data) {
    try {
      JSON.parse(data);
      lines.push(`json_data = ${data}`);
      bodyArg = ", json=json_data";
    } catch {
      lines.push(`data = ${JSON.stringify(data)}`);
      bodyArg = ", data=data";
    }
  }

  lines.push(
    `response = requests.${method.toLowerCase()}("${url || "https://api.example.com"}", headers=headers${bodyArg})`
  );
  lines.push("print(response.status_code)");
  lines.push("print(response.text)");

  return lines.join("\n");
}

/**
 * Generates Node.js native http/https code snippet.
 */
export function generateNodeHttpCode(parsed) {
  const { method, url, headers, data } = parsed;
  return `import https from 'https';

const options = {
  method: '${method}',
  headers: ${JSON.stringify(headers, null, 2)}
};

const req = https.request('${url || "https://api.example.com"}', options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(body));
});

${data ? `req.write(${JSON.stringify(data)});\n` : ""}req.end();`;
}

/**
 * Generates PHP cURL code snippet.
 */
export function generatePhpCode(parsed) {
  const { method, url, headers, data } = parsed;
  const headerList = Object.entries(headers).map(([k, v]) => `'${k}: ${v}'`);

  return `<?php
$ch = curl_init('${url || "https://api.example.com"}');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => '${method}',
    CURLOPT_HTTPHEADER => [
        ${headerList.join(",\n        ")}
    ],
    ${data ? `CURLOPT_POSTFIELDS => ${JSON.stringify(data)},` : ""}
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`;
}

/**
 * Generates Go net/http code snippet.
 */
export function generateGoCode(parsed) {
  const { method, url, headers, data } = parsed;
  return `package main

import (
\t"fmt"
\t"io"
\t"net/http"
\t${data ? `"strings"` : ""}
)

func main() {
\tclient := &http.Client{}
\t${
  data
    ? `payload := strings.NewReader(${JSON.stringify(data)})
\treq, err := http.NewRequest("${method}", "${url || "https://api.example.com"}", payload)`
    : `req, err := http.NewRequest("${method}", "${url || "https://api.example.com"}", nil)`
}
\tif err != nil {
\t\tpanic(err)
\t}

${Object.entries(headers)
  .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
  .join("\n")}

\tres, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer res.Body.Close()

\tbody, _ := io.ReadAll(res.Body)
\tfmt.Println(string(body))
}`;
}

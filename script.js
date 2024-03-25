// @ts-check
(() => {
  "use strict";

  /**
   * @typedef {boolean | { text: string, result: string, breaksRule: RegExp }} Rule
   */

  // Based on:
  // Th* *uic* *r*wn *ox *umps ov*r the la*y **g
  // A * C * E * G H I * * L M N O P * R S T U V W X Y *
  /** @type {Object.<string, Rule>} */
  const RULES = {
    a: true,
    b: false,
    c: true,
    d: false,
    e: {
      text: 'Censored in "The quick", but not in "The lazy"',
      result: "Allowed before voiced consonant letters",
      breaksRule: /e\s*[^\sbdghjlmnrvwz]|e$/g,
    },
    f: false,
    g: true,
    h: true,
    i: true,
    j: false,
    k: false,
    l: true,
    m: true,
    n: true,
    o: {
      text: 'Censored in "brown", but not in "fox" and "over"',
      result: "Allowed before non-semivowel consonants",
      breaksRule: /o\s*[^\sbcdfghklmnpqrstvxyz]|o$/g,
    },
    p: true,
    q: false,
    r: true,
    s: true,
    t: true,
    u: true,
    v: true,
    w: true,
    x: true,
    y: true,
    z: false,
  };

  /** @type {?HTMLTableSectionElement} */
  const rulesEl = document.querySelector("#rules");
  if (!rulesEl) {
    throw new Error("Rules not found");
  }

  /**
   * @param {HTMLElement} element
   * @param {boolean | string} status
   */
  const setElementToStatus = (element, status) => {
    if (typeof status === "boolean") {
      element.textContent = status ? "✓ Allowed" : "✗ Disallowed";
      element.classList.add(status ? "green" : "red");
    } else {
      element.textContent = "~ " + status;
      element.classList.add("yellow");
    }
  };

  Object.entries(RULES).forEach(([letter, rule]) => {
    const alphabetStatus = typeof rule === "boolean" ? rule : true;
    const textStatus = typeof rule === "boolean" ? rule : rule.text;
    const result = typeof rule === "boolean" ? rule : rule.result;

    const tr = document.createElement("tr");
    rulesEl.append(tr);
    tr.dataset[`letter${letter.toUpperCase()}`] = "";
    const letterNameEl = document.createElement("td");
    const alphabetStatusEl = document.createElement("td");
    const textStatusEl = document.createElement("td");
    const resultEl = document.createElement("td");
    tr.append(letterNameEl, alphabetStatusEl, textStatusEl, resultEl);
    letterNameEl.textContent = letter.toUpperCase();
    letterNameEl.classList.add("bold");
    resultEl.classList.add("bold");
    setElementToStatus(alphabetStatusEl, alphabetStatus);
    setElementToStatus(textStatusEl, textStatus);
    setElementToStatus(resultEl, result);
  });

  /** @type {?HTMLInputElement} */
  const input = document.querySelector("#input");
  if (!input) {
    throw new Error("Input not found");
  }
  /** @type {?HTMLDivElement} */
  const validity = document.querySelector("#validity");
  if (!validity) {
    throw new Error("Validity not found");
  }

  const check = () => {
    const toCheck = input.value.toLowerCase().trim();
    validity.hidden = toCheck === "";
    const brokenRules = Object.entries(RULES).filter(([letter, rule]) => {
      if (typeof rule === "boolean") {
        return !rule && toCheck.includes(letter);
      }
      return toCheck.match(rule.breaksRule);
    });
    validity.innerHTML = "";
    document
      .querySelectorAll(".letter-highlight")
      .forEach((el) => el.classList.remove("letter-highlight"));
    const issueCount = document.createElement("strong");
    validity.append(issueCount);
    if (brokenRules.length === 0) {
      validity.classList.remove("failure");
      validity.classList.add("success");
      issueCount.textContent = "No issues found!";
    } else {
      validity.classList.remove("success");
      validity.classList.add("failure");
      let issues = 0;
      const ul = document.createElement("ul");
      validity.append(ul);
      brokenRules.forEach(([brokenLetter, brokenRule]) => {
        const instances =
          typeof brokenRule === "boolean"
            ? [...toCheck].filter((l) => brokenLetter === l).length
            : [...toCheck.matchAll(brokenRule.breaksRule)].length;
        const li = document.createElement("li");
        ul.append(li);
        const strong = document.createElement("strong");
        strong.textContent = brokenLetter;
        li.append(
          typeof brokenRule === "boolean" ? "Use of " : "Inappropriate use of ",
          strong,
          ` (${instances} instance${instances === 1 ? "" : "s"})`
        );
        issues += instances;
        document
          .querySelector(`[data-letter-${brokenLetter}]`)
          ?.classList.add("letter-highlight");
      });
      issueCount.textContent = `${issues} issue${
        issues === 1 ? "" : "s"
      } found.`;
    }
  };

  check();
  input.addEventListener("input", check);
})();

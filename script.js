// @ts-check
(() => {
  "use strict";

  /**
   * @typedef {boolean | { text: string, result: string }} Rule
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
    const letterNameEl = document.createElement("td");
    const alphabetStatusEl = document.createElement("td");
    const textStatusEl = document.createElement("td");
    const resultEl = document.createElement("td");
    tr.append(letterNameEl, alphabetStatusEl, textStatusEl, resultEl);
    letterNameEl.textContent = letter.toUpperCase();
    letterNameEl.classList.add("letter");
    setElementToStatus(alphabetStatusEl, alphabetStatus);
    setElementToStatus(textStatusEl, textStatus);
    setElementToStatus(resultEl, result);
  });
})();

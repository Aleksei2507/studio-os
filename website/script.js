const flows = {
  greenfield: {
    label: "Greenfield workflow",
    summary: "A new product moves from problem understanding to verified outcome.",
    stages: [
      "Interview",
      "Discovery",
      "Briefing",
      "Planning",
      "Architecture",
      "Interface Design",
      "Task Decomposition",
      "Development",
      "Validation",
      "QA",
      "Product Outcome",
      "Release",
      "Retrospective",
    ],
  },
  brownfield: {
    label: "Brownfield workflow",
    summary: "An existing product starts with codebase, design-system, and delivery evidence.",
    stages: [
      "Onboarding",
      "Briefing",
      "Planning",
      "Architecture",
      "Interface Design",
      "Task Decomposition",
      "Development",
      "Validation",
      "QA",
      "Product Outcome",
      "Release",
      "Retrospective",
    ],
  },
};

const flowButtons = Array.from(document.querySelectorAll("[data-flow]"));
const stageTrack = document.querySelector("#stage-track");
const flowSummary = document.querySelector("#flow-summary");

function selectFlow(flowId) {
  const flow = flows[flowId];

  if (!flow || !stageTrack || !flowSummary) return;

  for (const button of flowButtons) {
    const selected = button.dataset.flow === flowId;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }

  flowSummary.textContent = flow.summary;
  document.querySelector("#flow-panel").setAttribute("aria-labelledby", `flow-tab-${flowId}`);
  stageTrack.setAttribute("aria-label", flow.label);
  stageTrack.replaceChildren(
    ...flow.stages.map((stage) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = stage;
      item.append(label);
      return item;
    }),
  );
  document.dispatchEvent(new Event("studio:layout"));
}

for (const button of flowButtons) {
  button.addEventListener("click", () => selectFlow(button.dataset.flow));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const index = flowButtons.indexOf(button);
    const next = flowButtons[(index + direction + flowButtons.length) % flowButtons.length];
    next.focus();
    selectFlow(next.dataset.flow);
  });
}

const installTabs = Array.from(document.querySelectorAll("[data-install-tab]"));
const installPanels = Array.from(document.querySelectorAll("[data-install-panel]"));

function selectInstallTab(tabId) {
  for (const tab of installTabs) {
    const selected = tab.dataset.installTab === tabId;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }

  for (const panel of installPanels) {
    panel.hidden = panel.dataset.installPanel !== tabId;
  }
  document.dispatchEvent(new Event("studio:layout"));
}

for (const tab of installTabs) {
  tab.addEventListener("click", () => selectInstallTab(tab.dataset.installTab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const index = installTabs.indexOf(tab);
    const next = installTabs[(index + direction + installTabs.length) % installTabs.length];
    next.focus();
    selectInstallTab(next.dataset.installTab);
  });
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Some embedded hosts deny Clipboard API access but allow a copy gesture.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Copy unavailable");
  } finally {
    textarea.remove();
  }
}

for (const button of document.querySelectorAll("[data-copy-target]")) {
  button.addEventListener("click", async () => {
    const target = document.querySelector(`#${button.dataset.copyTarget}`);

    if (!target) return;

    try {
      await copyText(target.textContent.trim());
      button.textContent = "Copied";
      document.querySelector("#copy-status").textContent = "Copied to clipboard.";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1600);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Copy manually";
      document.querySelector("#copy-status").textContent = "Command selected. Use your browser’s copy command.";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1600);
    }
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const artifactTabs = Array.from(document.querySelectorAll("[data-artifact]"));
function selectArtifact(tab) {
  for (const candidate of artifactTabs) {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    document.getElementById(candidate.getAttribute("aria-controls")).hidden = !selected;
  }
  document.dispatchEvent(new CustomEvent("studio:artifact", {
    detail: document.getElementById(tab.getAttribute("aria-controls")),
  }));
}
for (const tab of artifactTabs) {
  tab.addEventListener("click", () => {
    if (tab.getAttribute("aria-selected") !== "true") selectArtifact(tab);
  });
  tab.addEventListener("keydown", (event) => {
    const index = artifactTabs.indexOf(tab);
    const targetIndex = {
      ArrowRight: (index + 1) % artifactTabs.length,
      ArrowLeft: (index - 1 + artifactTabs.length) % artifactTabs.length,
      Home: 0,
      End: artifactTabs.length - 1,
    }[event.key];
    if (targetIndex === undefined) return;
    event.preventDefault();
    const next = artifactTabs[targetIndex];
    next.focus();
    selectArtifact(next);
  });
}

// Synchronize initial keyboard focus with the selected installation panel.
selectInstallTab("codex");

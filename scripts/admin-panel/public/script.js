// Studio OS admin panel client. Read + comment-write only — no model calls,
// no stage execution. Talks only to this repository's own /api/* endpoints.

function renderMarkdown(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inCode = false;
  let inList = false;

  const inline = (text) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const rawLine of lines) {
    if (rawLine.trim().startsWith("```")) {
      if (inCode) {
        html += "</code></pre>";
        inCode = false;
      } else {
        closeList();
        html += "<pre><code>";
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html += inline(rawLine) + "\n";
      continue;
    }
    const heading = rawLine.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      continue;
    }
    if (/^-{3,}$/.test(rawLine.trim())) {
      closeList();
      html += "<hr>";
      continue;
    }
    const item = rawLine.match(/^\s*[-*]\s+(.*)$/);
    if (item) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(item[1])}</li>`;
      continue;
    }
    if (rawLine.trim() === "") {
      closeList();
      continue;
    }
    closeList();
    html += `<p>${inline(rawLine)}</p>`;
  }
  closeList();
  if (inCode) html += "</code></pre>";
  return html;
}

function parseProjectState(text) {
  const fields = {};
  const completedStages = [];
  const latestArtifacts = [];
  let mode = null;
  for (const line of text.split("\n")) {
    if (/^Completed Stages:/.test(line)) {
      mode = "stages";
      continue;
    }
    if (/^Latest Artifacts:/.test(line)) {
      mode = "artifacts";
      continue;
    }
    const item = line.match(/^-\s+(.*)$/);
    if (item && mode === "stages") {
      completedStages.push(item[1]);
      continue;
    }
    if (item && mode === "artifacts") {
      latestArtifacts.push(item[1]);
      continue;
    }
    const kv = line.match(/^([A-Za-z][A-Za-z0-9 ]*):\s*(.*)$/);
    if (kv && mode !== "stages" && mode !== "artifacts") {
      fields[kv[1].trim()] = kv[2].trim();
    } else if (kv && line.trim() !== "" && !item) {
      mode = null;
      fields[kv[1].trim()] = kv[2].trim();
    }
  }
  return { fields, completedStages, latestArtifacts };
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

// --- Tabs ---

function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`view-${tab.dataset.tab}`).classList.add("active");
    });
  });
}

// --- Dashboard ---

async function loadDashboard() {
  const statePanel = document.getElementById("state-panel");
  const timelinePanel = document.getElementById("timeline-panel");
  try {
    const { projectState } = await fetchJson("/api/state");
    if (!projectState) {
      statePanel.innerHTML = '<p class="muted">No .studio/project-state.md in this workspace yet.</p>';
      return;
    }
    const { fields, completedStages } = parseProjectState(projectState);
    const highlight = ["Mode", "Workflow", "Work Type", "Current Stage", "Status", "Product Readiness", "Increment Progress", "Active Work Item"];
    const dt = highlight
      .filter((key) => fields[key])
      .map((key) => `<div class="state-field"><dt>${key}</dt><dd>${fields[key]}</dd></div>`)
      .join("");
    statePanel.innerHTML = `<div class="state-grid">${dt}</div>`;

    if (completedStages.length) {
      const items = completedStages
        .slice(-12)
        .map((stage) => `<li>${stage}</li>`)
        .join("");
      timelinePanel.innerHTML = `<h2 style="margin-top:0;font-size:13px;color:var(--text-muted);">Recent stages</h2><ul class="timeline">${items}</ul>`;
    }
  } catch (err) {
    statePanel.innerHTML = `<p class="muted">Failed to load project state: ${err.message}</p>`;
  }
}

// --- Artifacts ---

let artifactCache = null;

function groupWorkItems(paths) {
  const groups = {};
  for (const p of paths) {
    const id = p.split("/")[1];
    groups[id] = groups[id] || [];
    groups[id].push(p);
  }
  return groups;
}

function treeGroupHtml(title, paths) {
  const items = paths
    .sort()
    .map((p) => `<button class="tree-item" data-path="${p}">${p}</button>`)
    .join("");
  return `<details class="tree-group" open><summary>${title} (${paths.length})</summary>${items}</details>`;
}

async function loadArtifactTree() {
  const tree = document.getElementById("artifact-tree");
  try {
    artifactCache = await fetchJson("/api/artifacts");
    let html = "";
    html += treeGroupHtml("docs/", artifactCache.docs);
    const workItemGroups = groupWorkItems(artifactCache.workItems);
    for (const [id, paths] of Object.entries(workItemGroups)) {
      html += treeGroupHtml(`work-items/${id}/`, paths);
    }
    html += treeGroupHtml(".studio/", artifactCache.studio);
    tree.innerHTML = html || '<p class="muted">No artifacts found.</p>';
    tree.querySelectorAll(".tree-item").forEach((btn) => {
      btn.addEventListener("click", () => selectArtifact(btn.dataset.path));
    });
  } catch (err) {
    tree.innerHTML = `<p class="muted">Failed to load artifacts: ${err.message}</p>`;
  }
}

async function loadFeedbackFor(artifactPath, container) {
  const { open } = await fetchJson("/api/feedback");
  const slug = artifactPath.replace(/^\/+/, "").replace(/\.md$/, "").replace(/[\\/]/g, "-");
  const matching = open.filter((name) => name.startsWith(slug + "-"));
  if (!matching.length) {
    container.innerHTML = '<p class="muted">No open comments on this artifact.</p>';
    return;
  }
  container.innerHTML = matching
    .map(
      (name) =>
        `<div class="feedback-item" data-file="${name}"><div class="fb-body">Loading…</div><button data-resolve="${name}">Mark resolved</button></div>`
    )
    .join("");
  container.querySelectorAll("[data-resolve]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await fetchJson("/api/feedback/resolve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file: btn.dataset.resolve }),
      });
      await loadFeedbackFor(artifactPath, container);
    });
  });
}

async function selectArtifact(relPath) {
  document.querySelectorAll(".tree-item").forEach((b) => b.classList.toggle("active", b.dataset.path === relPath));
  const detail = document.getElementById("artifact-detail");
  detail.innerHTML = '<p class="muted">Loading…</p>';
  try {
    const { content } = await fetchJson(`/api/artifact?path=${encodeURIComponent(relPath)}`);
    detail.innerHTML = `
      <button class="raw-toggle" id="raw-toggle">View raw</button>
      <h2 style="margin-top:0;">${relPath}</h2>
      <div class="rendered" id="rendered-body">${renderMarkdown(content)}</div>
      <pre id="raw-body" style="display:none;"><code></code></pre>
      <div class="comment-box">
        <h3 style="font-size:13px;color:var(--text-muted);">Leave a comment</h3>
        <textarea id="comment-text" placeholder="Feedback the active Runtime should see next turn…"></textarea>
        <button id="comment-submit">Add comment</button>
        <div id="feedback-list" class="feedback-list"></div>
      </div>
    `;
    detail.querySelector("#raw-body code").textContent = content;
    const rawToggle = detail.querySelector("#raw-toggle");
    rawToggle.addEventListener("click", () => {
      const rendered = detail.querySelector("#rendered-body");
      const raw = detail.querySelector("#raw-body");
      const showingRaw = raw.style.display !== "none";
      raw.style.display = showingRaw ? "none" : "block";
      rendered.style.display = showingRaw ? "block" : "none";
      rawToggle.textContent = showingRaw ? "View raw" : "View rendered";
    });
    const feedbackList = detail.querySelector("#feedback-list");
    await loadFeedbackFor(relPath, feedbackList);
    detail.querySelector("#comment-submit").addEventListener("click", async () => {
      const textarea = detail.querySelector("#comment-text");
      const comment = textarea.value.trim();
      if (!comment) return;
      await fetchJson("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ artifactPath: relPath, comment }),
      });
      textarea.value = "";
      await loadFeedbackFor(relPath, feedbackList);
    });
  } catch (err) {
    detail.innerHTML = `<p class="muted">Failed to load artifact: ${err.message}</p>`;
  }
}

// --- Work Items ---

async function loadWorkItems() {
  const board = document.getElementById("work-items-board");
  try {
    if (!artifactCache) {
      artifactCache = await fetchJson("/api/artifacts");
    }
    const { fields } = parseProjectState((await fetchJson("/api/state")).projectState || "");
    const activeWorkItem = fields["Active Work Item"] || "None";
    const groups = groupWorkItems(artifactCache.workItems);
    if (!Object.keys(groups).length) {
      board.innerHTML = '<p class="muted">No work items yet.</p>';
      return;
    }
    board.innerHTML = Object.entries(groups)
      .map(([id, paths]) => {
        const isActive = activeWorkItem.includes(id);
        const links = paths
          .sort()
          .map((p) => `<button class="tree-item" data-path="${p}" data-goto-artifact="1">${p.split("/").pop()}</button>`)
          .join("");
        return `<div class="work-item-card">
          <h3>${id} ${isActive ? '<span class="badge ok">active</span>' : ""}</h3>
          ${links}
        </div>`;
      })
      .join("");
    board.querySelectorAll("[data-goto-artifact]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector('.tab[data-tab="artifacts"]').click();
        selectArtifact(btn.dataset.path);
      });
    });
  } catch (err) {
    board.innerHTML = `<p class="muted">Failed to load work items: ${err.message}</p>`;
  }
}

// --- Traceability ---

function gotoArtifact(relPath) {
  document.querySelector('.tab[data-tab="artifacts"]').click();
  selectArtifact(relPath);
}

async function loadTraceability() {
  const panel = document.getElementById("traceability-panel");
  try {
    const data = await fetchJson("/api/traceability");
    if (!data.workItemId) {
      panel.innerHTML = '<p class="muted">No active Work Item with a numbered Acceptance Criteria scheme.</p>';
      return;
    }
    if (!data.acceptanceCriteria.length) {
      panel.innerHTML = `<p class="muted">${data.workItemId} has no numbered AC&lt;n&gt; entries yet.</p>`;
      return;
    }
    const briefPath = `${data.workItemId}/brief.md`;
    const tasksPath = `${data.workItemId}/tasks.md`;

    const rows = data.acceptanceCriteria
      .map((ac) => {
        const taskChips = ac.taskIds.length
          ? ac.taskIds.map((id) => `<button class="tree-item" data-goto-task="${id}">${id}</button>`).join(" ")
          : data.hasTasksFile
            ? '<span class="muted">not covered</span>'
            : '<span class="muted">Task Decomposition skipped</span>';
        const status = ac.verified
          ? '<span class="badge ok">verified</span>'
          : ac.taskIds.length || !data.hasTasksFile
            ? '<span class="badge warn">pending</span>'
            : '<span class="badge warn">uncovered</span>';
        return `<tr>
          <td><button class="tree-item" data-goto-artifact="${briefPath}">${ac.id}</button></td>
          <td>${ac.text}</td>
          <td>${taskChips}</td>
          <td>${status}</td>
        </tr>`;
      })
      .join("");

    const taskRows = data.tasks.length
      ? data.tasks
          .map(
            (t) => `<tr>
              <td><button class="tree-item" data-goto-artifact="${tasksPath}">${t.id}</button></td>
              <td>${t.title}</td>
              <td>${t.satisfies.join(", ")}</td>
              <td>${t.estimate}</td>
            </tr>`,
          )
          .join("")
      : "";

    panel.innerHTML = `
      <h2 style="margin-top:0;">${data.workItemId}</h2>
      <h3 style="font-size:13px;color:var(--text-muted);">Acceptance Criteria coverage</h3>
      <table class="trace-table">
        <thead><tr><th>AC</th><th>Text</th><th>Covered by</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${
        data.hasTasksFile
          ? `<h3 style="font-size:13px;color:var(--text-muted);">Tasks</h3>
             <table class="trace-table">
               <thead><tr><th>ID</th><th>Title</th><th>Satisfies</th><th>Estimate</th></tr></thead>
               <tbody>${taskRows}</tbody>
             </table>`
          : ""
      }
    `;
    panel.querySelectorAll("[data-goto-artifact]").forEach((btn) => {
      btn.addEventListener("click", () => gotoArtifact(btn.dataset.gotoArtifact));
    });
    panel.querySelectorAll("[data-goto-task]").forEach((btn) => {
      btn.addEventListener("click", () => gotoArtifact(tasksPath));
    });
  } catch (err) {
    panel.innerHTML = `<p class="muted">Failed to load traceability: ${err.message}</p>`;
  }
}

initTabs();
loadDashboard();
loadArtifactTree().then(loadWorkItems);
loadTraceability();

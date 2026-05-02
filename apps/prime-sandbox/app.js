import { createPrimeDeveloperSandbox } from '../../src/sandbox/developer-sandbox.js';

const blueprint = createPrimeDeveloperSandbox({
  workspaceName: 'Prime Pro Services Unified Engineering Console',
});

const nav = document.getElementById('workspace-nav');
['Command Terminal','MCP Control','Cloud Runtime','Local Runtime','Web Browser QA','LLM Router'].forEach((item, idx) => {
  const el = document.createElement('button');
  el.className = `nav-item ${idx === 0 ? 'active' : ''}`;
  el.textContent = item;
  nav.appendChild(el);
});

const status = document.getElementById('status-list');
[
  'MCP servers connected',
  'Cloud role validated',
  'Local container runtime healthy',
  'Secrets provider online',
].forEach((line) => {
  const li = document.createElement('li');
  li.textContent = line;
  status.appendChild(li);
});

const renderListCard = (id, title, items) => {
  const card = document.getElementById(id);
  card.innerHTML = `<h3>${title}</h3><ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
};

renderListCard('capabilities', 'Advanced Capabilities', Object.entries(blueprint.capabilities).map(([k, v]) => `${k}: ${v}`));
renderListCard('automation', 'Automation & Release', [...blueprint.automation.workflows, ...blueprint.automation.releasePatterns]);
renderListCard('security', 'Security Guardrails', [...blueprint.security.dataControls, ...blueprint.security.executionSafety]);
renderListCard('onboarding', 'Onboarding Checklist', blueprint.onboardingChecklist);

const mcpCard = document.getElementById('mcp-services');
mcpCard.innerHTML = `<h3>MCP Services</h3>${blueprint.orchestration.mcp.map((s) => `<div class="pill">${s.name}</div>`).join('')}`;

const routing = document.getElementById('model-routing');
routing.innerHTML = `<h3>LLM Routing</h3>
  <p><strong>Strategy:</strong> ${blueprint.orchestration.aiModelRouting.strategy}</p>
  <p><strong>Coding:</strong> ${blueprint.orchestration.aiModelRouting.coding.join(', ')}</p>
  <p><strong>Planning:</strong> ${blueprint.orchestration.aiModelRouting.planning.join(', ')}</p>
  <p><strong>Multimodal:</strong> ${blueprint.orchestration.aiModelRouting.multimodal.join(', ')}</p>`;

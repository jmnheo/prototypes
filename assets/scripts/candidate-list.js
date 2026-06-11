const rowsDefault = [
  ["권진", "평가 완료", "green", "면접 완료", "green", "joinus.net", "3월 17일 (토) 오후 3시 45분"],
  ["박상아", "평가중", "blue", "면접 완료", "green", "jobportal.kr", "3월 18일 (일) 오전 11시 15분"],
  ["지웅현", "평가중", "blue", "면접 완료", "green", "joinus.net", "3월 18일 (일) 오전 11시 15분"],
  ["김민지", "-", "", "면접 예정", "orange", "careers.com", "3월 16일 (금) 오전 9시 00분"],
  ["허승진", "-", "", "면접 예정", "orange", "직접 지원", "3월 15일 (목) 오후 12시 30분"],
  ["박준영", "-", "", "면접 예정", "orange", "careers.com", "3월 17일 (토) 오후 3시 45분"],
  ["이소연", "-", "", "면접 예정", "orange", "직접 지원", "3월 18일 (일) 오전 11시 15분"],
  ["구혜원", "-", "", "면접 요청", "gray", "careers.com", "3월 16일 (금) 오전 9시 00분"],
  ["박민하", "-", "", "면접 요청", "gray", "careers.com", "3월 15일 (목) 오후 12시 30분"],
  ["정영훈", "-", "", "면접 예정", "orange", "직접 지원", "3월 17일 (토) 오후 3시 45분"],
  ["김백호", "-", "", "면접 예정", "orange", "직접 지원", "3월 18일 (일) 오전 11시 15분"],
  ["유주상", "-", "", "면접 예정", "orange", "jobportal.kr", "3월 16일 (금) 오전 9시 00분"],
  ["김희연", "-", "", "면접 예정", "orange", "jobportal.kr", "3월 15일 (목) 오후 12시 30분"],
];

const rowsFiltered = rowsDefault.slice(3);
const jobOptions = ["글로벌 사업개발", "상품 기획", "제조 솔루션", "품질"];
const getRowId = (row) => row[0];

const states = {
  default: { firstFilter: "지원분야", rows: rowsDefault },
  "panel-open": { firstFilter: "지원분야", rows: rowsDefault, popup: true },
  "panel-menu-open": { firstFilter: "지원분야", rows: rowsDefault, popup: true, menu: true, focused: true },
  "panel-selected-open": { rows: rowsFiltered, popup: true, selected: true, applied: true, selectedJob: "상품 기획" },
  "panel-selected": { rows: rowsFiltered, popup: true, selected: true, menu: true, focused: true, applied: true, selectedJob: "상품 기획" },
  "filter-applied": { rows: rowsFiltered, applied: true, selectedJob: "상품 기획" },
};

const getState = (stateKey, selectedJob) => {
  const state = { ...states[stateKey] };
  const job = selectedJob || state.selectedJob;

  if (job) {
    state.selectedJob = job;
    state.firstFilter = `직군: ${job.replace(/\s/g, "")}`;
  }

  return state;
};

const getSelectedIds = (screen) => (screen.dataset.selectedRows || "").split(",").filter(Boolean);

const setSelectedIds = (screen, ids) => {
  screen.dataset.selectedRows = [...new Set(ids)].join(",");
};

const getActionState = (screen) => ({
  modalAction: screen.dataset.modalAction || "",
  modalOption: screen.dataset.modalOption || "",
  modalMenu: screen.dataset.modalMenu === "true",
  actionApplied: screen.dataset.actionApplied || "",
  feedbackActive: screen.dataset.feedbackActive === "true",
  appliedRows: (screen.dataset.appliedRows || "").split(",").filter(Boolean),
});

const setActionState = (screen, state) => {
  screen.dataset.modalAction = state.modalAction || "";
  screen.dataset.modalOption = state.modalOption || "";
  screen.dataset.modalMenu = state.modalMenu ? "true" : "";
  screen.dataset.actionApplied = state.actionApplied || "";
  screen.dataset.feedbackActive = state.feedbackActive ? "true" : "";
  screen.dataset.appliedRows = state.appliedRows ? [...new Set(state.appliedRows)].join(",") : "";
};

const getVisibleRowIds = (state) => state.rows.map(getRowId);
const getSelectedVisibleCount = (state) => getVisibleRowIds(state).filter((id) => state.selectedIds.includes(id)).length;

const renderSelects = (state) => `
  <div class="filters">
    <div class="select ${state.applied ? "applied" : ""}" data-action="open-position-filter"><span>${state.firstFilter}</span></div>
    ${!state.popup && !state.applied && !getSelectedVisibleCount(state) ? `<span class="guide-tooltip guide-filter-tooltip">지원분야 필터로 평가 대상자를 빠르게 좁힐 수 있습니다.</span>` : ""}
    <div class="select"><span>평가 상태</span></div>
    <div class="select"><span>지원경로</span></div>
  </div>
`;

const renderTabs = () => `
  <div class="stage-tabs">
    <div class="stage-tab active"><span class="label">서류 스크리닝</span><span class="count">943</span></div>
    <div class="stage-tab"><span class="label">1차 인터뷰</span><span class="count">6</span></div>
    <div class="stage-tab"><span class="label">2차 인터뷰</span><span class="count">0</span></div>
    <div class="stage-tab"><span class="label">입사 제안</span><span class="count">0</span></div>
  </div>
`;

const renderHead = (state) => {
  const visibleIds = getVisibleRowIds(state);
  const selectedVisibleCount = visibleIds.filter((id) => state.selectedIds.includes(id)).length;
  const checkedClass = selectedVisibleCount === visibleIds.length && visibleIds.length ? "checked" : "";
  const indeterminateClass = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length ? "indeterminate" : "";

  return `
  <div class="table-head">
    <div class="head-check" data-action="toggle-all-rows"><span class="checkbox ${checkedClass} ${indeterminateClass}"></span>${state.applied && !state.popup && !selectedVisibleCount && !state.actionApplied ? `<span class="guide-pulse guide-head-check-pulse"></span>` : ""}</div>
    <div class="head-cell name-head"><span>이름</span></div>
    <div class="head-cell"><span>평가 상태</span></div>
    <div class="head-cell"><span>면접 상태</span></div>
    <div class="head-cell"><span>지원경로</span></div>
    <div class="head-cell"><span>등록일</span></div>
  </div>
`;
};

const renderTag = (label, tone) => {
  if (label === "-") return `<span class="dash">-</span>`;
  return `<span class="tag ${tone}">${label}</span>`;
};

const renderSource = (source) => {
  if (source === "직접 지원") return `<span class="source direct">${source}</span>`;
  return `<img class="source-icon" src="../assets/icons/⚙️Interwork-icon.svg" alt="" /><span class="source">${source}</span>`;
};

const getDisplayRow = (row, state) => {
  if (state.actionApplied === "평가 배정") {
    return [row[0], "평가중", "blue", row[3], row[4], row[5], row[6]];
  }

  return row;
};

const renderRows = (state) => state.rows.map((sourceRow) => {
  const row = getDisplayRow(sourceRow, state);
  const id = getRowId(row);
  const selected = state.selectedIds.includes(id);
  const highlighted = state.appliedRows.includes(id);

  return `
  <div class="row ${selected ? "selected" : ""} ${highlighted ? "applied-highlight" : ""}" data-row-id="${id}">
    <div class="row-cell" data-action="toggle-row" data-row-id="${id}"><span class="checkbox ${selected ? "checked" : ""}"></span></div>
    <div class="row-cell"><span class="applicant">${row[0]}</span><img class="quick-note" src="../assets/icons/⚙️memo-icon.svg" alt="" /></div>
    <div class="row-cell">${renderTag(row[1], row[2])}</div>
    <div class="row-cell">${renderTag(row[3], row[4])}</div>
    <div class="row-cell">${renderSource(row[5])}</div>
    <div class="row-cell"><span class="date">${row[6]}</span></div>
  </div>
`;
}).join("");

const renderBulkAction = (state) => {
  const selectedVisibleCount = getSelectedVisibleCount(state);

  if (!selectedVisibleCount) return "";

  return `
    <div class="bulk-action">
      <div class="bulk-summary">
        <span class="bulk-count">${selectedVisibleCount}명 선택됨</span>
        <span class="bulk-clear" data-action="clear-row-selection">선택 취소</span>
      </div>
      <div class="bulk-buttons">
        <button type="button" data-action="open-bulk-modal" data-modal-action="평가 배정"><span class="bulk-icon user-check"></span>평가 배정${state.modalAction ? "" : `<span class="guide-tooltip guide-bulk-tooltip">선택한 지원자에게 평가표를 배정할 수 있습니다.</span>`}</button>
        <button type="button" data-action="open-bulk-modal" data-modal-action="면접 생성"><span class="bulk-icon calendar"></span>면접 생성</button>
        <button type="button" class="wide" data-action="open-bulk-modal" data-modal-action="메시지 보내기"><span class="bulk-icon chat"></span>메시지 보내기</button>
        <button type="button" class="danger" data-action="open-bulk-modal" data-modal-action="불합격 처리"><span class="bulk-icon block"></span>불합격 처리</button>
      </div>
    </div>
  `;
};

const actionOptions = [
  "[1차 직무적합성] 상품 기획",
  "[1차 직무적합성] 제조 솔루션",
  "[1차 직무적합성] 회계",
];

const assignees = [
  ["김민수", "kimmin@doodlin.co.kr", "피플팀", "김"],
  ["이영희", "leey@doodlin.co.kr", "프로덕트팀", "이"],
  ["박지훈", "parkj@doodlin.co.kr", "프로덕트팀", "박"],
  ["최수진", "chois@doodlin.co.kr", "마케팅팀", "최"],
];

const renderAssigneeList = (state) => {
  if (!state.modalOption) {
    return `
      <div class="assignee-empty">
        <span class="assignee-empty-icon"></span>
        <span>평가표를 먼저 선택하세요.</span>
      </div>
    `;
  }

  return `
    <div class="assignee-search">이름, 이메일, 부서로 검색</div>
    <div class="assignee-list">
      ${assignees.map(([name, email, team, initial]) => `
        <div class="assignee-item">
          <span class="assignee-check checkbox checked"></span>
          <span class="avatar">${initial}</span>
          <span class="assignee-person">
            <span class="assignee-name">${name}</span>
            <span class="assignee-email">${email}</span>
          </span>
          <span class="assignee-team">${team}</span>
        </div>
      `).join("")}
    </div>
  `;
};

const renderPreview = () => `
  <div class="evaluation-preview">
    <img class="scorecard-preview-image" src="../assets/screenshots/scorecardPreview.png" alt="" />
  </div>
`;

const renderBulkModal = (state) => {
  if (!state.modalAction) return "";
  const selectedCount = getSelectedVisibleCount(state);
  const optionText = state.modalOption || "선택";

  return `
    <div class="modal-dim"></div>
    <div class="bulk-modal ${state.modalOption ? "option-selected" : ""}" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-title"><span>${selectedCount}명의 지원자</span>에게 평가를 배정합니다.</div>
        <button type="button" class="modal-close" data-action="close-bulk-modal" aria-label="닫기"></button>
      </div>
      <div class="modal-body">
        <div class="modal-main">
          <div class="modal-field">
            <div class="modal-label">평가표<span class="required">*</span></div>
            <button type="button" class="modal-select ${state.modalOption ? "selected" : ""}" data-action="toggle-modal-menu">
              <span>${optionText}</span>
            </button>
            ${state.modalMenu ? `
            <div class="modal-menu">
              ${actionOptions.map((option) => `
              <button type="button" class="modal-option ${state.modalOption === option ? "selected" : ""}" data-action="select-modal-option" data-modal-option="${option}">
                <span>${option}</span>
              </button>
              `).join("")}
            </div>
            ` : ""}
          </div>
          <div class="modal-field assignee-field">
            <div class="modal-label">평가자</div>
            ${renderAssigneeList(state)}
          </div>
        </div>
        ${state.modalOption ? renderPreview() : ""}
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-button primary" data-action="apply-bulk-action" ${state.modalOption ? "" : "disabled"}>확인</button>
      </div>
    </div>
  `;
};

const renderActionToast = (state) => {
  if (!state.feedbackActive) return "";

  return `
    <div class="action-toast">
      <span class="toast-icon"></span>
      <span>평가가 배정되었습니다</span>
    </div>
  `;
};

const renderPopup = (state) => {
  if (!state.popup) return "";
  const firstValue = state.selected
    ? `<span class="combo-chip" data-action="clear-job-filter"><span class="combo-chip-label">${state.selectedJob}</span><span class="combo-chip-close"></span></span>`
    : `<span class="combo-placeholder">선택</span>`;
  return `
    <div class="filter-popup">
      <div class="filter-fields">
        <div class="field"><div class="field-label">직군</div>${!state.menu && !state.selected ? `<span class="guide-pulse guide-job-pulse"></span>` : ""}<div class="combo ${state.selected ? "selected" : ""} ${state.focused ? "focused" : ""}" data-action="open-job-menu">${firstValue}</div></div>
        <div class="field"><div class="field-label">경력사항</div><div class="combo"><span class="combo-placeholder">선택</span></div></div>
        <div class="field"><div class="field-label">고용형태</div><div class="combo"><span class="combo-placeholder">선택</span></div></div>
        <div class="field"><div class="field-label">근무지</div><div class="combo"><span class="combo-placeholder">선택</span></div></div>
      </div>
    </div>
    ${state.menu ? `
      <div class="combo-menu">
        ${jobOptions.map((job) => `
          <div class="menu-item ${state.selectedJob === job ? "selected" : ""}" data-action="toggle-job-filter" data-job="${job}">
            <span class="menu-check"></span><span class="menu-label">${job}</span>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
};

const renderScreen = (state) => `
  <div class="app-frame ${getSelectedVisibleCount(state) ? "has-selection" : ""}">
    <header class="header"><h1 class="header-title">2026년 대규모 채용</h1></header>
    <div class="content">
      <div class="toolbar-top">
        ${renderSelects(state)}
        <div class="view-toggle"><span class="view grid"></span><span class="view list"></span></div>
      </div>
      <div class="tabs-bar">${renderTabs()}</div>
      ${renderBulkAction(state)}
      ${renderHead(state)}
      <div class="table">
        <div class="rows">${renderRows(state)}</div>
      </div>
      ${renderPopup(state)}
      ${renderBulkModal(state)}
      ${renderActionToast(state)}
    </div>
  </div>
`;

document.querySelectorAll(".screen").forEach((screen) => {
  const state = getState(screen.dataset.state, screen.dataset.selectedJob);
  state.selectedIds = getSelectedIds(screen);
  Object.assign(state, getActionState(screen));
  screen.innerHTML = renderScreen(state);
});

const setScreenState = (screen, stateKey, selectedJob = "") => {
  screen.dataset.state = stateKey;
  screen.dataset.selectedJob = selectedJob;
  const state = getState(stateKey, selectedJob);
  state.selectedIds = getSelectedIds(screen);
  Object.assign(state, getActionState(screen));
  screen.innerHTML = renderScreen(state);
};

const scheduleActionFeedbackClear = (screen) => {
  window.clearTimeout(Number(screen.dataset.feedbackTimer || 0));
  const timer = window.setTimeout(() => {
    setActionState(screen, {
      actionApplied: screen.dataset.actionApplied,
    });
    setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
  }, 2600);
  screen.dataset.feedbackTimer = String(timer);
};

document.addEventListener("click", (event) => {
  const screen = event.target.closest(".screen");
  const actionTarget = event.target.closest("[data-action]");

  if (screen && actionTarget) {
    const action = actionTarget.dataset.action;

    if (action === "toggle-row") {
      const rowId = actionTarget.dataset.rowId;
      const selectedIds = getSelectedIds(screen);
      const nextIds = selectedIds.includes(rowId)
        ? selectedIds.filter((id) => id !== rowId)
        : [...selectedIds, rowId];

      setSelectedIds(screen, nextIds);
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "toggle-all-rows") {
      const state = getState(screen.dataset.state, screen.dataset.selectedJob);
      const visibleIds = getVisibleRowIds(state);
      const selectedIds = getSelectedIds(screen);
      const visibleSelectedCount = visibleIds.filter((id) => selectedIds.includes(id)).length;
      const nextIds = visibleSelectedCount === visibleIds.length
        ? selectedIds.filter((id) => !visibleIds.includes(id))
        : [...selectedIds, ...visibleIds];

      setSelectedIds(screen, nextIds);
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "clear-row-selection") {
      setSelectedIds(screen, []);
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "open-bulk-modal") {
      setActionState(screen, {
        modalAction: "평가 배정",
        modalOption: "",
        modalMenu: false,
        actionApplied: "",
      });
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "close-bulk-modal") {
      setActionState(screen, {});
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "toggle-modal-menu") {
      setActionState(screen, {
        modalAction: screen.dataset.modalAction,
        modalOption: screen.dataset.modalOption,
        modalMenu: screen.dataset.modalMenu !== "true",
        actionApplied: "",
      });
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "select-modal-option") {
      setActionState(screen, {
        modalAction: screen.dataset.modalAction,
        modalOption: actionTarget.dataset.modalOption,
        modalMenu: false,
        actionApplied: "",
      });
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      return;
    }

    if (action === "apply-bulk-action") {
      if (!screen.dataset.modalOption) return;
      const appliedAction = screen.dataset.modalAction;
      const appliedRows = getSelectedIds(screen);
      setSelectedIds(screen, []);
      setActionState(screen, {
        actionApplied: appliedAction,
        feedbackActive: true,
        appliedRows,
      });
      setScreenState(screen, screen.dataset.state, screen.dataset.selectedJob);
      scheduleActionFeedbackClear(screen);
      return;
    }

    if (action === "open-position-filter") {
      setScreenState(screen, screen.dataset.state === "filter-applied" ? "panel-selected" : "panel-open", screen.dataset.selectedJob);
      return;
    }

    if (action === "open-job-menu") {
      setScreenState(screen, screen.dataset.state === "panel-selected" || screen.dataset.state === "panel-selected-open" ? "panel-selected" : "panel-menu-open", screen.dataset.selectedJob);
      return;
    }

    if (action === "toggle-job-filter") {
      const selectedJob = actionTarget.dataset.job;
      const nextJob = screen.dataset.selectedJob === selectedJob ? "" : selectedJob;
      setScreenState(screen, nextJob ? "panel-selected" : "panel-menu-open", nextJob);
      return;
    }

    if (action === "clear-job-filter") {
      setScreenState(screen, "panel-menu-open");
      return;
    }
  }

  const selectedMenuScreen = document.querySelector('.screen[data-state="panel-selected"]');
  if (selectedMenuScreen) {
    const filterSurface = event.target.closest(".filters, .filter-popup, .combo-menu");
    const jobMenuSurface = event.target.closest('.combo-menu, [data-action="open-job-menu"]');
    const isFilterSurface = filterSurface && filterSurface.closest(".screen") === selectedMenuScreen;
    const isJobMenuSurface = jobMenuSurface && jobMenuSurface.closest(".screen") === selectedMenuScreen;

    if (!isFilterSurface) {
      setScreenState(selectedMenuScreen, "filter-applied", selectedMenuScreen.dataset.selectedJob);
      return;
    }

    if (!isJobMenuSurface) {
      setScreenState(selectedMenuScreen, "panel-selected-open", selectedMenuScreen.dataset.selectedJob);
      return;
    }
  }

  const menuScreen = document.querySelector('.screen[data-state="panel-menu-open"]');
  if (menuScreen) {
    const filterSurface = event.target.closest(".filters, .filter-popup, .combo-menu");
    const jobMenuSurface = event.target.closest('.combo-menu, [data-action="open-job-menu"]');
    const isFilterSurface = filterSurface && filterSurface.closest(".screen") === menuScreen;
    const isJobMenuSurface = jobMenuSurface && jobMenuSurface.closest(".screen") === menuScreen;

    if (!isFilterSurface) {
      setScreenState(menuScreen, "default");
      return;
    }

    if (!isJobMenuSurface) {
      setScreenState(menuScreen, "panel-open");
      return;
    }
  }

  const selectedOpenScreen = document.querySelector('.screen[data-state="panel-selected-open"]');
  if (selectedOpenScreen) {
    const filterSurface = event.target.closest(".filters, .filter-popup");

    if (!filterSurface || filterSurface.closest(".screen") !== selectedOpenScreen) {
      setScreenState(selectedOpenScreen, "filter-applied", selectedOpenScreen.dataset.selectedJob);
      return;
    }
  }

  const openScreen = document.querySelector('.screen[data-state="panel-open"]');
  if (openScreen) {
    const filterSurface = event.target.closest(".filters, .filter-popup");

    if (!filterSurface || filterSurface.closest(".screen") !== openScreen) {
      setScreenState(openScreen, "default");
    }
  }
});

const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

const panel = document.getElementById("controlPanel");
const panelHeader = document.getElementById("panelHeader");
const panelToggleButton = document.getElementById("panelToggleButton");
const panelCollapseButton = document.getElementById("panelCollapseButton");
const wheelModeBadge = document.getElementById("wheelModeBadge");

const presetSelect = document.getElementById("presetSelect");
const presetColorControls = document.getElementById("presetColorControls");
const presetColor1Button = document.getElementById("presetColor1Button");
const presetColor2Button = document.getElementById("presetColor2Button");
const presetSwapColorsButton = document.getElementById("presetSwapColorsButton");
const presetColor1Input = document.getElementById("presetColor1Input");
const presetColor2Input = document.getElementById("presetColor2Input");
const checkerSizeGroup = document.getElementById("checkerSizeGroup");
const checkerSizeTitle = document.getElementById("checkerSizeTitle");
const checkerPixelSizeRange = document.getElementById("checkerPixelSizeRange");
const checkerPixelSizeOutput = document.getElementById("checkerPixelSizeOutput");
const checkerPresetButtons = document.getElementById("checkerPresetButtons");
const customSection = document.getElementById("customSection");
const customCssInput = document.getElementById("customCssInput");
const customPresetName = document.getElementById("customPresetName");
const saveCustomPresetButton = document.getElementById("saveCustomPresetButton");
const imageSourceSection = document.getElementById("imageSourceSection");
const chooseImageSourceButton = document.getElementById("chooseImageSourceButton");
const useFallbackImageButton = document.getElementById("useFallbackImageButton");
const imageSourceInput = document.getElementById("imageSourceInput");
const imageSourceOutput = document.getElementById("imageSourceOutput");

const tileShiftXRange = document.getElementById("tileShiftXRange");
const tileShiftXOutput = document.getElementById("tileShiftXOutput");
const tileShiftYRange = document.getElementById("tileShiftYRange");
const tileShiftYOutput = document.getElementById("tileShiftYOutput");
const tileShiftYGroup = tileShiftYRange.closest(".control-group");
const shiftModeToggleButton = document.getElementById("shiftModeToggleButton");
const shiftModeToggleIcon = document.getElementById("shiftModeToggleIcon");
const shiftStepModeToggleButton = document.getElementById("shiftStepModeToggleButton");
const shiftStepModeToggleIcon = document.getElementById("shiftStepModeToggleIcon");
const renderFilterToggleButton = document.getElementById("renderFilterToggleButton");
const renderFilterToggleIcon = document.getElementById("renderFilterToggleIcon");
const resetTransformButton = document.getElementById("resetTransformButton");
const cycleIncludeShiftX = document.getElementById("cycleIncludeShiftX");
const cycleIncludeShiftY = document.getElementById("cycleIncludeShiftY");
const cycleIncludeRotation = document.getElementById("cycleIncludeRotation");
const cycleIncludeSize = document.getElementById("cycleIncludeSize");
const rotationRange = document.getElementById("rotationRange");
const rotationOutput = document.getElementById("rotationOutput");
const wheelRotationStepInput = document.getElementById("wheelRotationStepInput");

const modulesWideInput = document.getElementById("modulesWideInput");
const modulesHighInput = document.getElementById("modulesHighInput");
const tilesPerModuleXInput = document.getElementById("tilesPerModuleXInput");
const tilesPerModuleYInput = document.getElementById("tilesPerModuleYInput");
const physicalWidthInput = document.getElementById("physicalWidthInput");
const physicalHeightInput = document.getElementById("physicalHeightInput");
const pixelsWideInput = document.getElementById("pixelsWideInput");
const pixelsHighInput = document.getElementById("pixelsHighInput");
const showTileLinesInput = document.getElementById("showTileLinesInput");
const tileLineWidthInput = document.getElementById("tileLineWidthInput");
const tileLineColorInput = document.getElementById("tileLineColorInput");
const showSubGridLinesInput = document.getElementById("showSubGridLinesInput");
const subGridPresetButtons = document.getElementById("subGridPresetButtons");
const allPanelsOnButton = document.getElementById("allPanelsOnButton");
const allPanelsOffButton = document.getElementById("allPanelsOffButton");
const allSubGridOnButton = document.getElementById("allSubGridOnButton");
const allSubGridOffButton = document.getElementById("allSubGridOffButton");
const identifyPanelsButton = document.getElementById("identifyPanelsButton");
const identifySubGridButton = document.getElementById("identifySubGridButton");
const selectionReportButton = document.getElementById("selectionReportButton");
const selectionReportModal = document.getElementById("selectionReportModal");
const selectionReportText = document.getElementById("selectionReportText");
const copySelectionReportButton = document.getElementById("copySelectionReportButton");
const closeSelectionReportButton = document.getElementById("closeSelectionReportButton");
const infoBox = document.getElementById("infoBox");

const STORAGE_KEY = "led-stress-custom-presets";
const IMAGE_SOURCE_DATA_STORAGE_KEY = "led-stress-image-source-data-url";
const IMAGE_SOURCE_NAME_STORAGE_KEY = "led-stress-image-source-name";
const FALLBACK_IMAGE_SRC = "tekniskfeil.png";

const basePresets = [
  {
    id: "checker",
    name: "Checkerboard (Equal Count)",
    css: "conic-gradient(#fff 25%, #000 0 50%, #fff 0 75%, #000 0)",
  },
  {
    id: "checker-square",
    name: "Checkerboard (Equal Size)",
    css: "",
  },
  {
    id: "line-wrap",
    name: "Vertical Line",
    css: "",
  },
  {
    id: "curtain",
    name: "Curtain",
    css: "",
  },
  {
    id: "rgb-stripes",
    name: "RGB Stripes",
    css: "linear-gradient(90deg, #ff0000 0 33.33%, #00ff00 33.33% 66.66%, #0000ff 66.66% 100%)",
  },
  {
    id: "image-fullscreen",
    name: "Local Image (Fullscreen)",
    css: "",
  },
  {
    id: "custom",
    name: "Custom (Edit Below)",
    css: "linear-gradient(90deg, #fff 0 50%, #000 50% 100%)",
  },
];

let customPresets = loadCustomPresets();
let activePresetId = "checker-square";
let wheelModeIndex = 0;
let shiftCoordinateMode = "tile";
let shiftStepMode = "pixel";
let renderFilterMode = "nearest";
let patternColor1 = "#ffffff";
let patternColor2 = "#000000";
let screenModeLocalShiftX = sanitizeNumber(tileShiftXRange.value, 0);
let screenModeLocalShiftY = sanitizeNumber(tileShiftYRange.value, 0);
let suppressScreenShiftInputSync = false;
let previousShiftXSliderValue = sanitizeNumber(tileShiftXRange.value, 0);
let previousShiftYSliderValue = sanitizeNumber(tileShiftYRange.value, 0);
const wheelModes = ["shift-x", "shift-y", "rotation", "size"];
let latestDrawToken = 0;
let drawScheduled = false;
let subGridStepSize = 16;
let persistedImageSourceDataUrl = "";
let persistedImageSourceName = "";
let fullscreenImageElement = null;
let fullscreenImageSrc = "";
let identifyPanelsEnabled = false;
let identifySubGridEnabled = false;
const tileCache = new Map();
const sourceTileCache = new Map();
let wheelModeBadgeTimer = null;
let isPointerOverPanel = false;
let lastCanvasPointerX = null;
let lastCanvasPointerY = null;
const panelPowerOverrides = new Set();
const subGridPowerOverrides = new Set();
const selectedPanelKeys = new Set();
const selectedSubGridKeys = new Set();
let inspectedPanelKey = null;
const WHEEL_DELTA_UNIT = 100;
const MAX_TILE_SOURCE_DIMENSION = 4096;
const BASE_TILE_TRANSFORM_OVERSCAN_FACTOR = 17;
const MAX_TRANSFORM_SURFACE_PIXELS = 16777216;
const INSPECT_BLEED_RADIUS = 2;
const OFF_TILE_COLOR = "#000000";
const MAX_CHECKER_PRESET_BUTTONS = 6;
const SUBGRID_PRESET_VALUES = [2, 4, 8, 16, 32, 64];
const CHECKER_DIAGONAL_SCALE = 2;

function getPanelPowerKey(tileX, tileY, geom) {
  return `${geom.totalTilesX}x${geom.totalTilesY}:${tileX},${tileY}`;
}

function isPanelForcedOff(tileX, tileY, geom) {
  return panelPowerOverrides.has(getPanelPowerKey(tileX, tileY, geom));
}

function togglePanelPower(tileX, tileY, geom) {
  const key = getPanelPowerKey(tileX, tileY, geom);
  if (panelPowerOverrides.has(key)) {
    panelPowerOverrides.delete(key);
    return;
  }

  panelPowerOverrides.add(key);
}

function togglePanelSelection(tileX, tileY, geom) {
  const key = getPanelPowerKey(tileX, tileY, geom);
  if (selectedPanelKeys.has(key)) {
    selectedPanelKeys.delete(key);
  } else {
    selectedPanelKeys.add(key);
  }
}

function getSubGridConfig(geom, sourceWidth, sourceHeight) {
  const pixels = getEffectiveScreenPixelDimensions(geom, sourceWidth, sourceHeight);
  const step = clampValue(
    Math.max(1, Math.round(sanitizeNumber(subGridStepSize, 16))),
    1,
    Math.max(1, Math.min(pixels.width, pixels.height)),
  );
  return { pixels, step };
}

function getSubGridPowerKey(cellX, cellY, pixelsWidth, pixelsHeight, step) {
  return `${pixelsWidth}x${pixelsHeight}@${step}:${cellX},${cellY}`;
}

function toggleSubGridPowerAtViewportPoint(viewportX, viewportY, geom, frame, sourceWidth, sourceHeight) {
  const { pixels, step } = getSubGridConfig(geom, sourceWidth, sourceHeight);

  if (
    viewportX < frame.x ||
    viewportY < frame.y ||
    viewportX >= frame.x + frame.width ||
    viewportY >= frame.y + frame.height
  ) {
    return false;
  }

  const u = (viewportX - frame.x) / Math.max(1e-9, frame.width);
  const v = (viewportY - frame.y) / Math.max(1e-9, frame.height);
  const pixelX = clampValue(Math.floor(u * pixels.width), 0, pixels.width - 1);
  const pixelY = clampValue(Math.floor(v * pixels.height), 0, pixels.height - 1);
  const cellX = Math.floor(pixelX / step);
  const cellY = Math.floor(pixelY / step);
  const key = getSubGridPowerKey(cellX, cellY, pixels.width, pixels.height, step);

  if (subGridPowerOverrides.has(key)) {
    subGridPowerOverrides.delete(key);
  } else {
    subGridPowerOverrides.add(key);
  }

  return true;
}

function getSubGridCellAtViewportPoint(viewportX, viewportY, geom, frame, sourceWidth, sourceHeight) {
  const { pixels, step } = getSubGridConfig(geom, sourceWidth, sourceHeight);

  if (
    viewportX < frame.x ||
    viewportY < frame.y ||
    viewportX >= frame.x + frame.width ||
    viewportY >= frame.y + frame.height
  ) {
    return null;
  }

  const u = (viewportX - frame.x) / Math.max(1e-9, frame.width);
  const v = (viewportY - frame.y) / Math.max(1e-9, frame.height);
  const pixelX = clampValue(Math.floor(u * pixels.width), 0, pixels.width - 1);
  const pixelY = clampValue(Math.floor(v * pixels.height), 0, pixels.height - 1);
  const cellX = Math.floor(pixelX / step);
  const cellY = Math.floor(pixelY / step);

  return {
    cellX,
    cellY,
    pixelsWidth: pixels.width,
    pixelsHeight: pixels.height,
    step,
    key: getSubGridPowerKey(cellX, cellY, pixels.width, pixels.height, step),
  };
}

function toggleSubGridSelectionAtViewportPoint(viewportX, viewportY, geom, frame, sourceWidth, sourceHeight) {
  const hit = getSubGridCellAtViewportPoint(viewportX, viewportY, geom, frame, sourceWidth, sourceHeight);
  if (!hit) {
    return false;
  }

  if (selectedSubGridKeys.has(hit.key)) {
    selectedSubGridKeys.delete(hit.key);
  } else {
    selectedSubGridKeys.add(hit.key);
  }

  return true;
}

function toExcelColumnName(columnIndexZeroBased) {
  let n = Math.max(0, Math.floor(columnIndexZeroBased));
  let out = "";
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}

function formatExcelCell(columnIndexZeroBased, rowIndexZeroBased) {
  return `${toExcelColumnName(columnIndexZeroBased)}${Math.max(1, Math.floor(rowIndexZeroBased) + 1)}`;
}

function drawSelectedPanelOutlines(geom, frame) {
  if (selectedPanelKeys.size === 0) {
    return;
  }

  const tileW = frame.width / geom.totalTilesX;
  const tileH = frame.height / geom.totalTilesY;
  const stroke = Math.max(4, sanitizeNumber(tileLineWidthInput.value, 2) * 3);

  ctx.save();
  ctx.strokeStyle = tileLineColorInput.value || "#7f007f";
  ctx.lineWidth = stroke;

  selectedPanelKeys.forEach((key) => {
    const separator = key.indexOf(":");
    if (separator < 0) {
      return;
    }

    const dims = key.slice(0, separator);
    if (dims !== `${geom.totalTilesX}x${geom.totalTilesY}`) {
      return;
    }

    const [xRaw, yRaw] = key.slice(separator + 1).split(",");
    const x = Number(xRaw);
    const y = Number(yRaw);
    if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= geom.totalTilesX || y >= geom.totalTilesY) {
      return;
    }

    const dx = frame.x + x * tileW;
    const dy = frame.y + y * tileH;
    // Align stroke outer edge to panel boundary by drawing inset half stroke width.
    ctx.strokeRect(dx + stroke / 2, dy + stroke / 2, Math.max(0, tileW - stroke), Math.max(0, tileH - stroke));
  });

  ctx.restore();
}

function drawSelectedSubGridOutlines(geom, frame, sourceWidth, sourceHeight) {
  if (selectedSubGridKeys.size === 0) {
    return;
  }

  const { pixels, step } = getSubGridConfig(geom, sourceWidth, sourceHeight);
  const keyPrefix = `${pixels.width}x${pixels.height}@${step}:`;
  const stroke = Math.max(3, sanitizeNumber(tileLineWidthInput.value, 2) * 2.5);
  const subGridColor = getAccentColorFromBase(tileLineColorInput.value || "#7f007f");

  ctx.save();
  ctx.strokeStyle = subGridColor;
  ctx.lineWidth = stroke;

  selectedSubGridKeys.forEach((key) => {
    if (!key.startsWith(keyPrefix)) {
      return;
    }

    const coordPart = key.slice(keyPrefix.length);
    const [cellXRaw, cellYRaw] = coordPart.split(",");
    const cellX = Number(cellXRaw);
    const cellY = Number(cellYRaw);
    if (!Number.isInteger(cellX) || !Number.isInteger(cellY) || cellX < 0 || cellY < 0) {
      return;
    }

    const startPxX = cellX * step;
    const startPxY = cellY * step;
    if (startPxX >= pixels.width || startPxY >= pixels.height) {
      return;
    }

    const endPxX = Math.min((cellX + 1) * step, pixels.width);
    const endPxY = Math.min((cellY + 1) * step, pixels.height);
    const dx = frame.x + (startPxX / pixels.width) * frame.width;
    const dy = frame.y + (startPxY / pixels.height) * frame.height;
    const dw = ((endPxX - startPxX) / pixels.width) * frame.width;
    const dh = ((endPxY - startPxY) / pixels.height) * frame.height;

    // Align stroke outer edge to sub-grid boundary by drawing inset half stroke width.
    ctx.strokeRect(dx + stroke / 2, dy + stroke / 2, Math.max(0, dw - stroke), Math.max(0, dh - stroke));
  });

  ctx.restore();
}

function showSelectionReport() {
  const geom = getGeometry();
  const lines = ["Selection Report", ""];

  lines.push("Panels:");
  let panelCount = 0;
  selectedPanelKeys.forEach((key) => {
    const separator = key.indexOf(":");
    if (separator < 0) {
      return;
    }

    const dims = key.slice(0, separator);
    if (dims !== `${geom.totalTilesX}x${geom.totalTilesY}`) {
      return;
    }

    const [xRaw, yRaw] = key.slice(separator + 1).split(",");
    const panelCol = Number(xRaw);
    const panelRow = Number(yRaw);
    if (!Number.isInteger(panelCol) || !Number.isInteger(panelRow)) {
      return;
    }

    const panelCell = formatExcelCell(panelCol, panelRow);
    lines.push(`- Panel ${panelCell}`);
    panelCount += 1;
  });
  if (panelCount === 0) {
    lines.push("- None");
  }

  lines.push("");
  lines.push("Sub-grid:");
  let subGridCount = 0;
  selectedSubGridKeys.forEach((key) => {
    const match = key.match(/^(\d+)x(\d+)@(\d+):(\d+),(\d+)$/);
    if (!match) {
      return;
    }

    const pixelsW = Number(match[1]);
    const pixelsH = Number(match[2]);
    const step = Number(match[3]);
    const cellCol = Number(match[4]);
    const cellRow = Number(match[5]);
    if (![pixelsW, pixelsH, step, cellCol, cellRow].every(Number.isFinite)) {
      return;
    }

    const panelPixelW = pixelsW / Math.max(1, geom.totalTilesX);
    const panelPixelH = pixelsH / Math.max(1, geom.totalTilesY);
    const centerPxX = (cellCol + 0.5) * step;
    const centerPxY = (cellRow + 0.5) * step;
    const panelCol = clampValue(Math.floor(centerPxX / Math.max(1e-9, panelPixelW)), 0, geom.totalTilesX - 1);
    const panelRow = clampValue(Math.floor(centerPxY / Math.max(1e-9, panelPixelH)), 0, geom.totalTilesY - 1);
    const panelOriginX = panelCol * panelPixelW;
    const panelOriginY = panelRow * panelPixelH;
    const localCol = Math.max(0, Math.floor((centerPxX - panelOriginX) / Math.max(1, step)));
    const localRow = Math.max(0, Math.floor((centerPxY - panelOriginY) / Math.max(1, step)));

    const panelRef = formatExcelCell(panelCol, panelRow);
    const localRef = formatExcelCell(localCol, localRow);
    lines.push(`- Panel ${panelRef}, Sub-grid ${localRef} (@ ${step}px)`);
    subGridCount += 1;
  });
  if (subGridCount === 0) {
    lines.push("- None");
  }

  if (selectionReportModal && selectionReportText) {
    selectionReportText.value = lines.join("\n");
    selectionReportModal.hidden = false;
    selectionReportText.focus();
    selectionReportText.select();
    return;
  }

  window.alert(lines.join("\n"));
}

async function copySelectionReportText() {
  if (!selectionReportText) {
    return;
  }

  const text = selectionReportText.value || "";
  if (!text) {
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall through to legacy copy path.
  }

  selectionReportText.focus();
  selectionReportText.select();
  document.execCommand("copy");
}

function closeSelectionReport() {
  if (!selectionReportModal) {
    return;
  }

  selectionReportModal.hidden = true;
}

function setAllPanelsPower(isOn) {
  panelPowerOverrides.clear();
  if (isOn) {
    return;
  }

  const geom = getGeometry();
  for (let y = 0; y < geom.totalTilesY; y += 1) {
    for (let x = 0; x < geom.totalTilesX; x += 1) {
      panelPowerOverrides.add(getPanelPowerKey(x, y, geom));
    }
  }
}

function setAllSubGridPower(isOn) {
  if (isOn) {
    subGridPowerOverrides.clear();
    return;
  }

  const geom = getGeometry();
  const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();
  const { pixels, step } = getSubGridConfig(geom, sourceWidth, sourceHeight);
  const cellsX = Math.ceil(pixels.width / step);
  const cellsY = Math.ceil(pixels.height / step);
  const keyPrefix = `${pixels.width}x${pixels.height}@${step}:`;

  // Replace only current-config cell states while preserving any historical states for other configs.
  Array.from(subGridPowerOverrides).forEach((key) => {
    if (key.startsWith(keyPrefix)) {
      subGridPowerOverrides.delete(key);
    }
  });

  for (let cellY = 0; cellY < cellsY; cellY += 1) {
    for (let cellX = 0; cellX < cellsX; cellX += 1) {
      subGridPowerOverrides.add(getSubGridPowerKey(cellX, cellY, pixels.width, pixels.height, step));
    }
  }
}

function toggleInspectedPanel(tileX, tileY, geom) {
  const key = getPanelPowerKey(tileX, tileY, geom);
  inspectedPanelKey = inspectedPanelKey === key ? null : key;
}

function isPanelInspected(tileX, tileY, geom) {
  return inspectedPanelKey === getPanelPowerKey(tileX, tileY, geom);
}

function getInspectedPanelTile(geom) {
  if (!inspectedPanelKey) {
    return null;
  }

  const separator = inspectedPanelKey.indexOf(":");
  if (separator < 0) {
    return null;
  }

  const dims = inspectedPanelKey.slice(0, separator);
  const coords = inspectedPanelKey.slice(separator + 1);
  if (dims !== `${geom.totalTilesX}x${geom.totalTilesY}`) {
    return null;
  }

  const [xRaw, yRaw] = coords.split(",");
  const tileX = Number(xRaw);
  const tileY = Number(yRaw);
  if (!Number.isInteger(tileX) || !Number.isInteger(tileY)) {
    return null;
  }

  if (tileX < 0 || tileY < 0 || tileX >= geom.totalTilesX || tileY >= geom.totalTilesY) {
    return null;
  }

  return { tileX, tileY };
}

function getTileAtViewportPoint(viewportX, viewportY, geom, frame) {
  if (
    viewportX < frame.x ||
    viewportY < frame.y ||
    viewportX >= frame.x + frame.width ||
    viewportY >= frame.y + frame.height
  ) {
    return null;
  }

  const tileW = frame.width / geom.totalTilesX;
  const tileH = frame.height / geom.totalTilesY;
  const tileX = Math.floor((viewportX - frame.x) / tileW);
  const tileY = Math.floor((viewportY - frame.y) / tileH);

  if (tileX < 0 || tileY < 0 || tileX >= geom.totalTilesX || tileY >= geom.totalTilesY) {
    return null;
  }

  return { tileX, tileY };
}

function applyInputDelta({
  rawDeltaY,
  deltaMode = 0,
  sourceData = {},
}) {
  const deltaScale = deltaMode === 1
    ? 40
    : deltaMode === 2
      ? Math.max(window.innerHeight, 1)
      : 1;

  const scaledDeltaY = rawDeltaY * deltaScale;
  const normalizedStepsRaw = scaledDeltaY / WHEEL_DELTA_UNIT;
  const immediateStep = -Math.trunc(normalizedStepsRaw);

  if (immediateStep === 0) {
    return;
  }

  applyWheelLogicalDelta(immediateStep);
}

function renderPresetOptions() {
  presetSelect.innerHTML = "";

  const presets = [...basePresets.filter((p) => p.id !== "custom"), ...customPresets, basePresets.find((p) => p.id === "custom")];

  presets.forEach((preset) => {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.name;
    presetSelect.appendChild(option);
  });

  presetSelect.value = activePresetId;
}

function saveCustomPresets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
}

function loadCustomPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => x && x.id && x.name && x.css) : [];
  } catch {
    return [];
  }
}

function getActivePreset() {
  const all = [...basePresets, ...customPresets];
  return all.find((p) => p.id === activePresetId) || basePresets[0];
}

function isCheckerPreset(presetId) {
  return presetId === "checker" || presetId === "checker-square";
}

function isLinePreset(presetId) {
  return presetId === "line-wrap";
}

function isCurtainPreset(presetId) {
  return presetId === "curtain";
}

function isFullscreenImagePreset(presetId) {
  return presetId === "image-fullscreen";
}

function usesSizeSliderPreset(presetId) {
  return isCheckerPreset(presetId) || isLinePreset(presetId);
}

function getActiveWheelModes() {
  const modes = [];
  const isCurtainTileMode = isCurtainPreset(activePresetId) && shiftCoordinateMode !== "screen";

  if (cycleIncludeShiftX?.checked !== false) {
    modes.push("shift-x");
  }

  if (!isCurtainTileMode && cycleIncludeShiftY?.checked !== false) {
    modes.push("shift-y");
  }

  if (cycleIncludeRotation?.checked !== false) {
    modes.push("rotation");
  }

  if (usesSizeSliderPreset(activePresetId) && cycleIncludeSize?.checked !== false) {
    modes.push("size");
  }

  if (modes.length === 0) {
    modes.push("shift-x");
  }

  return modes;
}

function handleCycleInclusionToggle(toggledInput) {
  const inputs = [cycleIncludeShiftX, cycleIncludeShiftY, cycleIncludeRotation, cycleIncludeSize].filter(Boolean);
  const enabledCount = inputs.reduce((count, input) => count + (input.checked ? 1 : 0), 0);

  if (enabledCount === 0 && toggledInput) {
    toggledInput.checked = true;
    return;
  }

  updateWheelModeBadge({ transient: false });
}

function getCurrentWheelMode() {
  const allModes = getActiveWheelModes();
  const mode = wheelModes[wheelModeIndex];
  if (allModes.includes(mode)) {
    return mode;
  }

  const fallback = allModes[0] || "shift-x";
  const fallbackIndex = wheelModes.indexOf(fallback);
  if (fallbackIndex >= 0) {
    wheelModeIndex = fallbackIndex;
  }
  return fallback;
}

function usesPresetColorControls(presetId) {
  return isCheckerPreset(presetId) || isLinePreset(presetId) || isCurtainPreset(presetId);
}

function loadPersistedImageSource() {
  persistedImageSourceDataUrl = localStorage.getItem(IMAGE_SOURCE_DATA_STORAGE_KEY) || "";
  persistedImageSourceName = localStorage.getItem(IMAGE_SOURCE_NAME_STORAGE_KEY) || "";
}

function persistImageSource(dataUrl, name) {
  persistedImageSourceDataUrl = dataUrl || "";
  persistedImageSourceName = name || "";

  try {
    if (persistedImageSourceDataUrl) {
      localStorage.setItem(IMAGE_SOURCE_DATA_STORAGE_KEY, persistedImageSourceDataUrl);
      localStorage.setItem(IMAGE_SOURCE_NAME_STORAGE_KEY, persistedImageSourceName);
    } else {
      localStorage.removeItem(IMAGE_SOURCE_DATA_STORAGE_KEY);
      localStorage.removeItem(IMAGE_SOURCE_NAME_STORAGE_KEY);
    }
  } catch {
    // Keep current session image even if persistence fails (for example storage quota limits).
  }

  fullscreenImageElement = null;
  fullscreenImageSrc = "";
}

function updateImageSourceControlsUI() {
  if (!imageSourceSection) {
    return;
  }

  const visible = isFullscreenImagePreset(activePresetId);
  imageSourceSection.hidden = !visible;
  if (!visible) {
    return;
  }

  if (persistedImageSourceDataUrl) {
    const label = persistedImageSourceName || "Selected image";
    imageSourceOutput.textContent = `Selected: ${label}`;
  } else {
    imageSourceOutput.textContent = `Fallback: ${FALLBACK_IMAGE_SRC}`;
  }
}

function getActiveFullscreenImageSrc() {
  return persistedImageSourceDataUrl || FALLBACK_IMAGE_SRC;
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image source: ${src}`));
    image.src = src;
  });
}

async function getFullscreenImageElement() {
  const preferredSrc = getActiveFullscreenImageSrc();
  if (fullscreenImageElement && fullscreenImageSrc === preferredSrc) {
    return fullscreenImageElement;
  }

  try {
    const image = await loadImageElement(preferredSrc);
    fullscreenImageElement = image;
    fullscreenImageSrc = preferredSrc;
    return image;
  } catch {
    if (preferredSrc !== FALLBACK_IMAGE_SRC) {
      try {
        const fallbackImage = await loadImageElement(FALLBACK_IMAGE_SRC);
        fullscreenImageElement = fallbackImage;
        fullscreenImageSrc = FALLBACK_IMAGE_SRC;
        return fallbackImage;
      } catch {
        return null;
      }
    }

    return null;
  }
}

function drawImageCover(image, width, height) {
  if (!image) {
    return;
  }

  const iw = Math.max(1, image.naturalWidth || image.width);
  const ih = Math.max(1, image.naturalHeight || image.height);
  const scale = Math.max(width / iw, height / ih);
  const drawW = iw * scale;
  const drawH = ih * scale;
  const dx = (width - drawW) / 2;
  const dy = (height - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
}

function drawImageCoverTransformed(image, width, height, shiftXPercent, shiftYPercent, rotationDeg) {
  if (!image) {
    return;
  }

  const iw = Math.max(1, image.naturalWidth || image.width);
  const ih = Math.max(1, image.naturalHeight || image.height);
  const scale = Math.max(width / iw, height / ih);
  const drawW = iw * scale;
  const drawH = ih * scale;

  const panXPx = (shiftXPercent / 100) * width;
  const panYPx = (shiftYPercent / 100) * height;
  const rad = (rotationDeg * Math.PI) / 180;

  ctx.save();
  ctx.translate(width / 2 + panXPx, height / 2 + panYPx);
  ctx.rotate(rad);
  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

function normalizeHexColor(value, fallback = "#000000") {
  const raw = (value || "").trim();
  const match = raw.match(/^#([0-9a-fA-F]{6})$/);
  if (!match) {
    return fallback;
  }

  return `#${match[1].toLowerCase()}`;
}

function hexToRgbArray(hex) {
  const color = normalizeHexColor(hex, "#000000");
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

function rgbToHex(r, g, b) {
  const clampChannel = (value) => clampValue(Math.round(value), 0, 255);
  const toHex = (value) => clampChannel(value).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  const rn = clampValue(r, 0, 255) / 255;
  const gn = clampValue(g, 0, 255) / 255;
  const bn = clampValue(b, 0, 255) / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  return { h, s, l };
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clampValue(s, 0, 1);
  const light = clampValue(l, 0, 1);
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  let rp = 0;
  let gp = 0;
  let bp = 0;

  if (hue < 60) {
    rp = c;
    gp = x;
  } else if (hue < 120) {
    rp = x;
    gp = c;
  } else if (hue < 180) {
    gp = c;
    bp = x;
  } else if (hue < 240) {
    gp = x;
    bp = c;
  } else if (hue < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }

  return {
    r: (rp + m) * 255,
    g: (gp + m) * 255,
    b: (bp + m) * 255,
  };
}

function getAccentColorFromBase(hex) {
  const [r, g, b] = hexToRgbArray(hex);
  const hsl = rgbToHsl(r, g, b);
  const accentHue = (hsl.h + 36) % 360;
  const accentSat = clampValue(hsl.s * 0.8 + 0.2, 0.2, 1);
  const accentLight = clampValue(hsl.l < 0.5 ? hsl.l + 0.18 : hsl.l - 0.18, 0.18, 0.82);
  const accentRgb = hslToRgb(accentHue, accentSat, accentLight);
  return rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b);
}

function getReadableTextColor(hex) {
  const [r, g, b] = hexToRgbArray(hex);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.55 ? "#101418" : "#f6fbff";
}

function applyPresetColorButtonStyle(button, hexColor) {
  const color = normalizeHexColor(hexColor, "#000000");
  button.style.background = color;
  const icon = button.querySelector(".mode-toggle-icon");
  if (icon) {
    icon.style.color = getReadableTextColor(color);
    icon.style.borderColor = "rgba(16, 20, 24, 0.45)";
  }
}

function updatePresetColorControlsUI() {
  if (!presetColorControls) {
    return;
  }

  const visible = usesPresetColorControls(activePresetId);
  presetColorControls.hidden = !visible;
  if (!visible) {
    return;
  }

  patternColor1 = normalizeHexColor(patternColor1, "#ffffff");
  patternColor2 = normalizeHexColor(patternColor2, "#000000");
  presetColor1Input.value = patternColor1;
  presetColor2Input.value = patternColor2;
  applyPresetColorButtonStyle(presetColor1Button, patternColor1);
  applyPresetColorButtonStyle(presetColor2Button, patternColor2);
}

function sanitizeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getGeometry() {
  const modulesWide = Math.max(1, Math.floor(sanitizeNumber(modulesWideInput.value, 5)));
  const modulesHigh = Math.max(1, Math.floor(sanitizeNumber(modulesHighInput.value, 3)));
  const tilesPerModuleX = Math.max(1, Math.floor(sanitizeNumber(tilesPerModuleXInput.value, 2)));
  const tilesPerModuleY = Math.max(1, Math.floor(sanitizeNumber(tilesPerModuleYInput.value, 4)));

  const totalTilesX = modulesWide * tilesPerModuleX;
  const totalTilesY = modulesHigh * tilesPerModuleY;

  return {
    modulesWide,
    modulesHigh,
    tilesPerModuleX,
    tilesPerModuleY,
    totalTilesX,
    totalTilesY,
  };
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.floor(window.innerWidth * dpr);
  const height = Math.floor(window.innerHeight * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
}

function drawCheckerboardByPixelSize(tctx, width, height, checkerSizePx, color1, color2, originX = 0, originY = 0) {
  const size = Math.max(1, Math.round(checkerSizePx));
  const c1 = hexToRgbArray(color1);
  const c2 = hexToRgbArray(color2);
  const img = tctx.createImageData(width, height);
  const data = img.data;
  let i = 0;

  // Phase-aware rasterization: origin shifts checker boundaries themselves.
  for (let y = 0; y < height; y += 1) {
    const gridY = Math.floor((y - originY) / size);
    for (let x = 0; x < width; x += 1) {
      const gridX = Math.floor((x - originX) / size);
      const rgb = ((gridX + gridY) & 1) === 1 ? c2 : c1;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
      i += 4;
    }
  }

  tctx.putImageData(img, 0, 0);
}

function drawCheckerboardByCount(
  tctx,
  width,
  height,
  checkerCount,
  tileWidth,
  tileHeight,
  color1,
  color2,
  originX = 0,
  originY = 0,
) {
  const count = Math.max(1, Math.round(checkerCount));
  const cellWidth = Math.max(1e-9, tileWidth / count);
  const cellHeight = Math.max(1e-9, tileHeight / count);
  const c1 = hexToRgbArray(color1);
  const c2 = hexToRgbArray(color2);
  const img = tctx.createImageData(width, height);
  const data = img.data;
  let i = 0;

  // Equal-count mode: same checker count on X and Y, allowing rectangular cells on non-square tiles.
  for (let y = 0; y < height; y += 1) {
    const gridY = Math.floor((y - originY) / cellHeight);
    for (let x = 0; x < width; x += 1) {
      const gridX = Math.floor((x - originX) / cellWidth);
      const rgb = ((gridX + gridY) & 1) === 1 ? c2 : c1;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
      i += 4;
    }
  }

  tctx.putImageData(img, 0, 0);
}

function drawWrappedVerticalLinePattern(tctx, width, height, panelWidthPx, lineWidthPx, lineColor, backgroundColor, panelStartX = 0) {
  const panelWidth = Math.max(1, Math.round(panelWidthPx));
  const stripeWidth = clampValue(Math.round(lineWidthPx), 1, panelWidth);
  const lineRgb = hexToRgbArray(lineColor);
  const bgRgb = hexToRgbArray(backgroundColor);
  const img = tctx.createImageData(width, height);
  const data = img.data;
  let i = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const localX = ((x - panelStartX) % panelWidth + panelWidth) % panelWidth;
      const isLine = localX < stripeWidth;
      const rgb = isLine ? lineRgb : bgRgb;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
      i += 4;
    }
  }

  tctx.putImageData(img, 0, 0);
}

function drawCurtainPattern(tctx, width, height, dividerX, leftColor, rightColor) {
  const divider = clampValue(Math.round(dividerX), 0, Math.max(1, width));
  const leftRgb = hexToRgbArray(leftColor);
  const rightRgb = hexToRgbArray(rightColor);
  const img = tctx.createImageData(width, height);
  const data = img.data;
  let i = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const rgb = x < divider ? leftRgb : rightRgb;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
      i += 4;
    }
  }

  tctx.putImageData(img, 0, 0);
}

function getLineRotationPhaseOffsetPixels(rotationDeg) {
  const rad = (sanitizeNumber(rotationDeg, 0) * Math.PI) / 180;
  // Integer compensation keeps 90deg line anchored to top row for even dimensions.
  return -Math.round(Math.sin(rad));
}

function getLinePeriodPixels(panelWidthPx, panelHeightPx, rotationDeg) {
  const width = Math.max(1, Math.round(panelWidthPx));
  const height = Math.max(1, Math.round(panelHeightPx));
  const rad = (sanitizeNumber(rotationDeg, 0) * Math.PI) / 180;
  const projectedWidth = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad));
  return Math.max(1, Math.ceil(projectedWidth));
}

function getTransformSamplingDimensions(outputWidth, outputHeight) {
  const width = Math.max(1, Math.round(outputWidth));
  const height = Math.max(1, Math.round(outputHeight));
  const sourcePixels = Math.max(1, width * height);
  const factorLimit = Math.max(3, Math.floor(Math.sqrt(MAX_TRANSFORM_SURFACE_PIXELS / sourcePixels)));
  const overscanFactor = Math.max(3, Math.min(BASE_TILE_TRANSFORM_OVERSCAN_FACTOR, factorLimit));

  let largeWidth = Math.max(width * 3, Math.round(width * overscanFactor));
  let largeHeight = Math.max(height * 3, Math.round(height * overscanFactor));

  // Keep crop origin integer-aligned: (large - output) / 2 should be whole pixels.
  if (((largeWidth - width) & 1) !== 0) {
    largeWidth += 1;
  }

  if (((largeHeight - height) & 1) !== 0) {
    largeHeight += 1;
  }

  return {
    width,
    height,
    largeWidth,
    largeHeight,
  };
}

function buildSourceTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground) {
  const isChecker = isCheckerPreset(presetId);
  const isLine = isLinePreset(presetId);
  const isCurtain = isCurtainPreset(presetId);
  const baseWidth = Math.max(1, Math.round(sourceWidth));
  const baseHeight = Math.max(1, Math.round(sourceHeight));
  const checkerSquareSize = Math.max(
    baseWidth,
    baseHeight,
    Math.ceil(Math.hypot(baseWidth, baseHeight) * CHECKER_DIAGONAL_SCALE),
  );
  const canvasWidth = (isChecker || isLine || isCurtain) ? checkerSquareSize : baseWidth;
  const canvasHeight = (isChecker || isLine || isCurtain) ? checkerSquareSize : baseHeight;

  const tileCanvas = document.createElement("canvas");
  tileCanvas.width = canvasWidth;
  tileCanvas.height = canvasHeight;
  const tctx = tileCanvas.getContext("2d");

  if (isChecker) {
    const checkerSizePx = Math.max(1, Math.round(sanitizeNumber(checkerPixelSizeRange.value, 1)));
    const checkerOriginX = Math.round(canvasWidth / 2);
    const checkerOriginY = Math.round(canvasHeight / 2);

    if (presetId === "checker") {
      const shortEdge = Math.max(1, Math.min(baseWidth, baseHeight));
      const checkerCount = Math.max(1, Math.round(shortEdge / checkerSizePx));
      drawCheckerboardByCount(
        tctx,
        canvasWidth,
        canvasHeight,
        checkerCount,
        baseWidth,
        baseHeight,
        patternColor1,
        patternColor2,
        checkerOriginX,
        checkerOriginY,
      );
    } else {
      drawCheckerboardByPixelSize(tctx, canvasWidth, canvasHeight, checkerSizePx, patternColor1, patternColor2, checkerOriginX, checkerOriginY);
    }

    tileCanvas.__checkerOriginX = checkerOriginX;
    tileCanvas.__checkerOriginY = checkerOriginY;
    return Promise.resolve(tileCanvas);
  }

  if (isLine) {
    const lineWidthPx = Math.max(1, Math.round(sanitizeNumber(checkerPixelSizeRange.value, 1)));
    const rotationDeg = sanitizeNumber(rotationRange.value, 0);
    const phaseOffsetPx = getLineRotationPhaseOffsetPixels(rotationDeg);
    const linePeriodPx = getLinePeriodPixels(baseWidth, baseHeight, rotationDeg);
    // Center the line-period phase around panel centers so rotation pivots visually around panel centers.
    const periodCenterOffsetPx = Math.round((linePeriodPx - baseWidth) / 2);
    const panelStartX = Math.round((canvasWidth - baseWidth) / 2) - periodCenterOffsetPx + phaseOffsetPx;
    drawWrappedVerticalLinePattern(tctx, canvasWidth, canvasHeight, linePeriodPx, lineWidthPx, patternColor1, patternColor2, panelStartX);
    tileCanvas.__checkerOriginX = null;
    tileCanvas.__checkerOriginY = null;
    return Promise.resolve(tileCanvas);
  }

  if (isCurtain) {
    const dividerX = Math.round(canvasWidth / 2);
    drawCurtainPattern(tctx, canvasWidth, canvasHeight, dividerX, patternColor1, patternColor2);
    tileCanvas.__checkerOriginX = null;
    tileCanvas.__checkerOriginY = null;
    return Promise.resolve(tileCanvas);
  }

  tileCanvas.__checkerOriginX = null;
  tileCanvas.__checkerOriginY = null;

  const gradient = tctx.createLinearGradient(0, 0, canvasWidth, 0);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.5, "#ffffff");
  gradient.addColorStop(0.5, "#000000");
  gradient.addColorStop(1, "#000000");

  try {
    tctx.fillStyle = gradient;
    tctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const offscreen = document.createElement("div");
    offscreen.style.background = cssBackground;
    if (offscreen.style.background) {
      const computed = offscreen.style.background;
      if (computed.includes("gradient") || computed.includes("#") || computed.includes("rgb")) {
        const img = new Image();
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${canvasWidth}px;height:${canvasHeight}px;background:${computed};"></div></foreignObject></svg>`;
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

        return new Promise((resolve) => {
          img.onload = () => {
            tctx.clearRect(0, 0, canvasWidth, canvasHeight);
            tctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            resolve(tileCanvas);
          };
          img.onerror = () => resolve(tileCanvas);
        });
      }
    }
  } catch {
    // Fallback pattern already prepared.
  }

  return Promise.resolve(tileCanvas);
}

function buildTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground, shiftXPercent, shiftYPercent, rotationDeg, tileAspect, shiftMode) {
  const disableCurtainY = isCurtainPreset(presetId) && shiftMode !== "screen";
  const effectiveShiftYPercent = disableCurtainY ? 0 : shiftYPercent;
  let transformOptions;
  if (isLinePreset(presetId)) {
    transformOptions = { shiftBasisWidth: getLinePeriodPixels(sourceWidth, sourceHeight, rotationDeg) };
  } else if (isCurtainPreset(presetId)) {
    transformOptions = {
      rotationPivotX: Math.round(sourceWidth / 2),
      rotationPivotY: Math.round(sourceHeight / 2),
    };
  }

  return buildSourceTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground)
    .then((sourceTileCanvas) => transformTile(
      sourceTileCanvas,
      shiftXPercent,
      effectiveShiftYPercent,
      rotationDeg,
      shiftMode,
      isRenderSmoothingEnabled(),
      sourceWidth,
      sourceHeight,
      transformOptions,
    ));
}

function transformTile(
  sourceCanvas,
  shiftXPercent,
  shiftYPercent,
  rotationDeg,
  shiftMode,
  smoothRendering,
  outputWidth = sourceCanvas.width,
  outputHeight = sourceCanvas.height,
  options = {},
) {
  const sampling = getTransformSamplingDimensions(outputWidth, outputHeight);
  const width = sampling.width;
  const height = sampling.height;
  const wrapSampling = options.wrapSampling !== false;
  const debugOriginMode = options.debugOriginMode || "none";
  const shiftBasisWidth = Math.max(1, Math.round(options.shiftBasisWidth ?? width));
  const shiftBasisHeight = Math.max(1, Math.round(options.shiftBasisHeight ?? height));
  const rotationPivotX = Number.isFinite(options.rotationPivotX) ? options.rotationPivotX : width / 2;
  const rotationPivotY = Number.isFinite(options.rotationPivotY) ? options.rotationPivotY : height / 2;
  const sourceDrawWidth = Math.max(1, Math.round(options.sourceDrawWidth ?? sourceCanvas.width));
  const sourceDrawHeight = Math.max(1, Math.round(options.sourceDrawHeight ?? sourceCanvas.height));
  const largeWidth = sampling.largeWidth;
  const largeHeight = sampling.largeHeight;

  const large = document.createElement("canvas");
  large.width = largeWidth;
  large.height = largeHeight;
  const lctx = large.getContext("2d");
  lctx.imageSmoothingEnabled = smoothRendering;

  if (wrapSampling) {
    const sw = Math.max(1, sourceCanvas.width);
    const sh = Math.max(1, sourceCanvas.height);
    const centerOffsetX = ((largeWidth - sw) / 2) % sw;
    const centerOffsetY = ((largeHeight - sh) / 2) % sh;

    for (let y = centerOffsetY - sh; y < largeHeight; y += sh) {
      for (let x = centerOffsetX - sw; x < largeWidth; x += sw) {
        lctx.drawImage(sourceCanvas, x, y);
      }
    }
  } else {
    lctx.fillStyle = "#000000";
    lctx.fillRect(0, 0, largeWidth, largeHeight);
    lctx.drawImage(
      sourceCanvas,
      (largeWidth - sourceDrawWidth) / 2,
      (largeHeight - sourceDrawHeight) / 2,
      sourceDrawWidth,
      sourceDrawHeight,
    );
  }

  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const octx = out.getContext("2d");
  octx.imageSmoothingEnabled = smoothRendering;

  const rotationRad = (rotationDeg * Math.PI) / 180;
  const shiftXPx = (shiftXPercent / 100) * shiftBasisWidth;
  const shiftYPx = (shiftYPercent / 100) * shiftBasisHeight;

  // Shift values are already in local pre-rotation space when passed to renderer.
  const localShiftX = shiftXPx;
  const localShiftY = shiftYPx;

  // Apply wrapped phase shift so source sampling remains fully covered at extremes.
  let sampled = large;
  if (Math.abs(localShiftX) > 1e-9 || Math.abs(localShiftY) > 1e-9) {
    const phaseShifted = document.createElement("canvas");
    phaseShifted.width = largeWidth;
    phaseShifted.height = largeHeight;
    const pctx = phaseShifted.getContext("2d");
    pctx.imageSmoothingEnabled = smoothRendering;

    if (wrapSampling) {
      const shiftXWrapped = ((localShiftX % largeWidth) + largeWidth) % largeWidth;
      const shiftYWrapped = ((localShiftY % largeHeight) + largeHeight) % largeHeight;

      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
          const dx = xOffset * largeWidth - shiftXWrapped;
          const dy = yOffset * largeHeight - shiftYWrapped;
          pctx.drawImage(large, dx, dy);
        }
      }
    } else {
      pctx.fillStyle = "#000000";
      pctx.fillRect(0, 0, largeWidth, largeHeight);
      pctx.drawImage(large, -localShiftX, -localShiftY, largeWidth, largeHeight);
    }

    sampled = phaseShifted;
  }

  const centeredX = (width - largeWidth) / 2;
  const centeredY = (height - largeHeight) / 2;

  octx.translate(rotationPivotX, rotationPivotY);
  octx.rotate(rotationRad);
  octx.translate(-rotationPivotX, -rotationPivotY);
  octx.drawImage(sampled, centeredX, centeredY, largeWidth, largeHeight);

  if (debugOriginMode === "checker") {
    const checkerOriginX = Number(sourceCanvas.__checkerOriginX);
    const checkerOriginY = Number(sourceCanvas.__checkerOriginY);

    if (Number.isFinite(checkerOriginX) && Number.isFinite(checkerOriginY)) {
      const sourceScaleX = sourceDrawWidth / Math.max(1, sourceCanvas.width);
      const sourceScaleY = sourceDrawHeight / Math.max(1, sourceCanvas.height);
      const sourceOffsetX = (largeWidth - sourceDrawWidth) / 2;
      const sourceOffsetY = (largeHeight - sourceDrawHeight) / 2;

      const largeOriginX = sourceOffsetX + checkerOriginX * sourceScaleX;
      const largeOriginY = sourceOffsetY + checkerOriginY * sourceScaleY;
      const sampledOriginX = largeOriginX - localShiftX;
      const sampledOriginY = largeOriginY - localShiftY;

      const relX = sampledOriginX - largeWidth / 2;
      const relY = sampledOriginY - largeHeight / 2;
      const cos = Math.cos(rotationRad);
      const sin = Math.sin(rotationRad);

      out.__debugOriginX = rotationPivotX + relX * cos - relY * sin;
      out.__debugOriginY = rotationPivotY + relX * sin + relY * cos;
    }
  }

  return out;
}

function buildInspectOverlayNoWrap(sourceCanvas, shiftXPercent, shiftYPercent, rotationDeg, smoothRendering, panelWidth, panelHeight, bleedRadius = INSPECT_BLEED_RADIUS) {
  const width = Math.max(1, Math.round(panelWidth));
  const height = Math.max(1, Math.round(panelHeight));
  const fieldTiles = bleedRadius * 2 + 1;
  return transformTile(
    sourceCanvas,
    shiftXPercent,
    shiftYPercent,
    rotationDeg,
    "tile",
    smoothRendering,
    width * fieldTiles,
    height * fieldTiles,
    {
      wrapSampling: false,
      debugOriginMode: "checker",
      shiftBasisWidth: width,
      shiftBasisHeight: height,
      sourceDrawWidth: sourceCanvas.width,
      sourceDrawHeight: sourceCanvas.height,
    },
  );
}

function getRotationRadians() {
  return (sanitizeNumber(rotationRange.value, 0) * Math.PI) / 180;
}

function getCurrentTileSourceDimensions() {
  const geom = getGeometry();
  const frame = getRenderFrame(window.innerWidth, window.innerHeight, geom);
  const configuredPxW = sanitizeNumber(pixelsWideInput.value, 0);
  const configuredPxH = sanitizeNumber(pixelsHighInput.value, 0);

  const tilePixelW = configuredPxW > 0
    ? configuredPxW / geom.totalTilesX
    : frame.width / geom.totalTilesX;
  const tilePixelH = configuredPxH > 0
    ? configuredPxH / geom.totalTilesY
    : frame.height / geom.totalTilesY;

  const sourceWidth = Math.max(1, Math.min(MAX_TILE_SOURCE_DIMENSION, Math.round(tilePixelW)));
  const sourceHeight = Math.max(1, Math.min(MAX_TILE_SOURCE_DIMENSION, Math.round(tilePixelH)));

  return { sourceWidth, sourceHeight };
}

function updateCheckerPixelSizeControl() {
  const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();
  const shortEdgePx = Math.max(1, Math.round(Math.min(sourceWidth, sourceHeight)));
  const isCurtain = isCurtainPreset(activePresetId);
  checkerPixelSizeRange.min = "1";
  checkerPixelSizeRange.max = String(shortEdgePx);

  let value = Math.round(sanitizeNumber(checkerPixelSizeRange.value, 1));
  value = clampValue(value, 1, shortEdgePx);
  checkerPixelSizeRange.value = String(value);
  checkerPixelSizeOutput.textContent = isCurtain ? "Disabled" : `${value} px`;

  if (checkerSizeTitle) {
    checkerSizeTitle.textContent = isCurtain
      ? "Band Width (disabled)"
      : isLinePreset(activePresetId)
      ? "Band Width (px)"
      : "Checker Size (px)";
  }

  checkerPixelSizeRange.disabled = isCurtain;
  checkerSizeGroup.classList.toggle("is-disabled", isCurtain);

  checkerSizeGroup.hidden = !(usesSizeSliderPreset(activePresetId) || isCurtain);
  updateCheckerPresetButtons(sourceWidth, sourceHeight, shortEdgePx, value);
}

function findCheckerSizeForExactCount(shortEdgePx, longEdgePx, targetCount) {
  if (targetCount < 1 || targetCount > shortEdgePx) {
    return null;
  }

  const ideal = shortEdgePx / targetCount;
  let bestSize = null;
  let bestError = Number.POSITIVE_INFINITY;

  for (let size = 1; size <= shortEdgePx; size += 1) {
    const count = Math.floor(shortEdgePx / size);
    if (count !== targetCount) {
      continue;
    }

    // A "perfect grid" across neighboring panels requires full checkers at every panel edge.
    // That is true only when checker size divides both tile axes exactly.
    if ((shortEdgePx % size) !== 0 || (longEdgePx % size) !== 0) {
      continue;
    }

    const error = Math.abs(size - ideal);
    if (error < bestError) {
      bestError = error;
      bestSize = size;
    }
  }

  return bestSize;
}

function updateCheckerPresetButtons(sourceWidth, sourceHeight, shortEdgePx, currentSizePx) {
  if (!checkerPresetButtons) {
    return;
  }

  checkerPresetButtons.innerHTML = "";

  if (!isCheckerPreset(activePresetId)) {
    return;
  }

  const longEdgePx = Math.max(1, Math.round(Math.max(sourceWidth, sourceHeight)));

  let rendered = 0;
  for (let count = 2; count <= shortEdgePx && rendered < MAX_CHECKER_PRESET_BUTTONS; count += 2) {
    const size = findCheckerSizeForExactCount(shortEdgePx, longEdgePx, count);
    if (!size) {
      continue;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "checker-preset-button mode-toggle mode-toggle-square";
    button.title = "Number of checkers on short edge";
    button.setAttribute("aria-label", `Number of checkers on short edge: ${count}`);
    button.setAttribute("aria-pressed", "false");

    const icon = document.createElement("span");
    icon.className = "mode-toggle-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = String(count);
    button.appendChild(icon);

    if (size === currentSizePx) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    }

    button.addEventListener("click", () => {
      checkerPixelSizeRange.value = String(size);
      tileCache.clear();
      sourceTileCache.clear();
      updateCheckerPixelSizeControl();
      requestDraw();
    });

    checkerPresetButtons.appendChild(button);
    rendered += 1;
  }
}

function setDefaultCheckerSizeForTwoChecks() {
  const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();
  const shortEdgePx = Math.max(1, Math.round(Math.min(sourceWidth, sourceHeight)));
  checkerPixelSizeRange.min = "1";
  checkerPixelSizeRange.max = String(shortEdgePx);
  // Use floor so odd short-edge sizes still produce about 2 checks, not 1.
  const targetSize = clampValue(Math.floor(shortEdgePx / 2), 1, shortEdgePx);
  checkerPixelSizeRange.value = String(targetSize);
}

function screenToLocalShift(screenX, screenY, rad, sourceWidth, sourceHeight) {
  const screenXPx = (screenX / 100) * sourceWidth;
  const screenYPx = (screenY / 100) * sourceHeight;
  const localXPx = screenXPx * Math.cos(rad) + screenYPx * Math.sin(rad);
  const localYPx = -screenXPx * Math.sin(rad) + screenYPx * Math.cos(rad);

  return {
    x: (localXPx / sourceWidth) * 100,
    y: (localYPx / sourceHeight) * 100,
  };
}

function localToScreenShift(localX, localY, rad, sourceWidth, sourceHeight) {
  const localXPx = (localX / 100) * sourceWidth;
  const localYPx = (localY / 100) * sourceHeight;
  const screenXPx = localXPx * Math.cos(rad) - localYPx * Math.sin(rad);
  const screenYPx = localXPx * Math.sin(rad) + localYPx * Math.cos(rad);

  return {
    x: (screenXPx / sourceWidth) * 100,
    y: (screenYPx / sourceHeight) * 100,
  };
}

function clampToRange(value, input) {
  const min = sanitizeNumber(input.min, -100);
  const max = sanitizeNumber(input.max, 100);
  return Math.min(max, Math.max(min, value));
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function snapToStep(value, input) {
  if (input.step === "any") {
    return value;
  }

  const min = sanitizeNumber(input.min, 0);
  const step = sanitizeNumber(input.step, 1);
  if (step <= 0) {
    return value;
  }

  const snapped = min + Math.round((value - min) / step) * step;
  const precision = (String(step).split(".")[1] || "").length;
  return Number(snapped.toFixed(Math.min(precision + 3, 8)));
}

function setShiftSliderValues(x, y, { snap = true } = {}) {
  suppressScreenShiftInputSync = true;
  const xValue = snap ? snapToStep(x, tileShiftXRange) : x;
  const yValue = snap ? snapToStep(y, tileShiftYRange) : y;
  const xSnapped = clampToRange(xValue, tileShiftXRange);
  const ySnapped = clampToRange(yValue, tileShiftYRange);
  tileShiftXRange.value = String(xSnapped);
  tileShiftYRange.value = String(ySnapped);
  previousShiftXSliderValue = sanitizeNumber(tileShiftXRange.value, 0);
  previousShiftYSliderValue = sanitizeNumber(tileShiftYRange.value, 0);
  suppressScreenShiftInputSync = false;
}

function wrapPixelIndex(value, pixelsPerTileAxis) {
  const axisPixels = Math.max(1, Math.round(pixelsPerTileAxis));
  const cycle = axisPixels;
  const low = Math.floor(axisPixels / 2);
  const wrapped = ((value + low) % cycle + cycle) % cycle - low;
  return wrapped;
}

function stepPercentByWholePixels(currentPercent, stepDelta, pixelsPerTileAxis, { wrap = true, minPercent = -50, maxPercent = 50 } = {}) {
  const axisPixels = Math.max(1, Math.round(pixelsPerTileAxis));
  const currentPixels = Math.round((currentPercent / 100) * axisPixels);

  if (wrap) {
    const steppedPixels = wrapPixelIndex(currentPixels + stepDelta, axisPixels);
    return (steppedPixels / axisPixels) * 100;
  }

  const steppedPixels = currentPixels + stepDelta;
  const steppedPercent = (steppedPixels / axisPixels) * 100;
  return clampValue(steppedPercent, minPercent, maxPercent);
}

function getPixelShiftPercentBounds(axisPixels) {
  const axis = Math.max(1, Math.round(axisPixels));
  const low = Math.floor(axis / 2);
  const high = axis - low - 1;
  return {
    minPercent: (-low / axis) * 100,
    maxPercent: (high / axis) * 100,
  };
}

function handleShiftSliderInput(axis) {
  const isX = axis === "x";
  const input = isX ? tileShiftXRange : tileShiftYRange;
  let current = sanitizeNumber(input.value, 0);

  if (isX) {
    previousShiftXSliderValue = current;
  } else {
    previousShiftYSliderValue = current;
  }

  if (shiftStepMode === "pixel") {
    const axisPixels = getShiftAxisPixelCounts();
    const min = sanitizeNumber(input.min, -50);
    const max = sanitizeNumber(input.max, 50);
    const snapped = isX
      ? stepPercentByWholePixels(current, 0, axisPixels.x, { wrap: false, minPercent: min, maxPercent: max })
      : stepPercentByWholePixels(current, 0, axisPixels.y, { wrap: false, minPercent: min, maxPercent: max });

    if (Math.abs(snapped - current) > 1e-9) {
      input.value = String(snapped);
      current = snapped;
    }

    if (isX) {
      previousShiftXSliderValue = current;
    } else {
      previousShiftYSliderValue = current;
    }
  }

  if (shiftCoordinateMode === "screen" && !suppressScreenShiftInputSync) {
    syncScreenLocalFromSliderValues();
  }

  requestDraw();
}

function syncScreenLocalFromSliderValues() {
  const sx = sanitizeNumber(tileShiftXRange.value, 0);
  const sy = sanitizeNumber(tileShiftYRange.value, 0);
  const axisPixels = getShiftAxisPixelCounts();
  const local = screenToLocalShift(sx, sy, getRotationRadians(), axisPixels.x, axisPixels.y);
  screenModeLocalShiftX = local.x;
  screenModeLocalShiftY = local.y;
}

function syncScreenSliderValuesFromLocal() {
  const axisPixels = getShiftAxisPixelCounts();
  const screen = localToScreenShift(screenModeLocalShiftX, screenModeLocalShiftY, getRotationRadians(), axisPixels.x, axisPixels.y);
  setShiftSliderValues(screen.x, screen.y, { snap: shiftStepMode !== "pixel" });
  updateOutputs();
}

function getTileCacheKey(sourceWidth, sourceHeight, cssBackground, shiftXPercent, shiftYPercent, rotationDeg, shiftMode) {
  const checkerSizePx = Math.max(1, Math.round(sanitizeNumber(checkerPixelSizeRange.value, 1)));
  return `${sourceWidth}x${sourceHeight}|${cssBackground}|${shiftXPercent}|${shiftYPercent}|${rotationDeg}|${shiftMode}|${renderFilterMode}|checker:${checkerSizePx}`;
}

function getSourceTileCacheKey(sourceWidth, sourceHeight, presetId, cssBackground) {
  const checkerSizePx = Math.max(1, Math.round(sanitizeNumber(checkerPixelSizeRange.value, 1)));
  const rotationDeg = sanitizeNumber(rotationRange.value, 0);
  const linePhaseOffsetPx = isLinePreset(presetId)
    ? getLineRotationPhaseOffsetPixels(rotationDeg)
    : 0;
  const linePeriodPx = isLinePreset(presetId)
    ? getLinePeriodPixels(sourceWidth, sourceHeight, rotationDeg)
    : 0;
  return `${sourceWidth}x${sourceHeight}|${presetId}|${cssBackground}|checker:${checkerSizePx}|linePhase:${linePhaseOffsetPx}|linePeriod:${linePeriodPx}|c1:${patternColor1}|c2:${patternColor2}`;
}

function isRenderSmoothingEnabled() {
  return renderFilterMode === "antialias";
}

function getTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground, shiftXPercent, shiftYPercent, rotationDeg, tileAspect, shiftMode) {
  const key = getTileCacheKey(sourceWidth, sourceHeight, `${presetId}|${cssBackground}|${tileAspect.toFixed(4)}`, shiftXPercent, shiftYPercent, rotationDeg, shiftMode);
  const cached = tileCache.get(key);
  if (cached) {
    return cached;
  }

  const promise = buildTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground, shiftXPercent, shiftYPercent, rotationDeg, tileAspect, shiftMode);
  tileCache.set(key, promise);

  // Keep cache bounded during slider scrubbing.
  if (tileCache.size > 120) {
    const oldestKey = tileCache.keys().next().value;
    tileCache.delete(oldestKey);
  }

  return promise;
}

function getSourceTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground) {
  const key = getSourceTileCacheKey(sourceWidth, sourceHeight, presetId, cssBackground);
  const cached = sourceTileCache.get(key);
  if (cached) {
    return cached;
  }

  const promise = buildSourceTileCanvas(sourceWidth, sourceHeight, presetId, cssBackground);
  sourceTileCache.set(key, promise);

  if (sourceTileCache.size > 120) {
    const oldestKey = sourceTileCache.keys().next().value;
    sourceTileCache.delete(oldestKey);
  }

  return promise;
}

function isFullscreenLike() {
  if (document.fullscreenElement) {
    return true;
  }

  const sw = window.screen.width;
  const sh = window.screen.height;
  return sw > 0 && sh > 0 && window.innerWidth >= sw - 2 && window.innerHeight >= sh - 2;
}

function getConfiguredAspectRatio(geom) {
  const physicalWidth = sanitizeNumber(physicalWidthInput.value, 0);
  const physicalHeight = sanitizeNumber(physicalHeightInput.value, 0);

  if (physicalWidth > 0 && physicalHeight > 0) {
    return physicalWidth / physicalHeight;
  }

  return geom.modulesWide / geom.modulesHigh;
}

function getRenderFrame(viewportW, viewportH, geom) {
  if (isFullscreenLike()) {
    return {
      x: 0,
      y: 0,
      width: viewportW,
      height: viewportH,
      hasBars: false,
    };
  }

  const targetAspect = Math.max(0.01, getConfiguredAspectRatio(geom));
  const viewportAspect = viewportW / viewportH;

  if (viewportAspect > targetAspect) {
    const width = viewportH * targetAspect;
    return {
      x: (viewportW - width) / 2,
      y: 0,
      width,
      height: viewportH,
      hasBars: true,
    };
  }

  const height = viewportW / targetAspect;
  return {
    x: 0,
    y: (viewportH - height) / 2,
    width: viewportW,
    height,
    hasBars: true,
  };
}

function getInteractionFrame(geom) {
  if (isFullscreenImagePreset(activePresetId)) {
    return {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      hasBars: false,
    };
  }

  return getRenderFrame(window.innerWidth, window.innerHeight, geom);
}

function toggleInspectAtLastPointer() {
  if (lastCanvasPointerX == null || lastCanvasPointerY == null) {
    return false;
  }

  const geom = getGeometry();
  const frame = getInteractionFrame(geom);
  const tile = getTileAtViewportPoint(lastCanvasPointerX, lastCanvasPointerY, geom, frame);
  if (!tile) {
    return false;
  }

  toggleInspectedPanel(tile.tileX, tile.tileY, geom);
  requestDraw();
  return true;
}

function drawForcedOffPanels(geom, frame) {
  const tileW = frame.width / geom.totalTilesX;
  const tileH = frame.height / geom.totalTilesY;

  for (let y = 0; y < geom.totalTilesY; y += 1) {
    for (let x = 0; x < geom.totalTilesX; x += 1) {
      if (!isPanelForcedOff(x, y, geom)) {
        continue;
      }

      const dx = frame.x + x * tileW;
      const dy = frame.y + y * tileH;
      ctx.fillStyle = OFF_TILE_COLOR;
      ctx.fillRect(dx, dy, tileW, tileH);
    }
  }
}

function forEachForcedOffPanelRect(geom, frame, callback) {
  const tileW = frame.width / geom.totalTilesX;
  const tileH = frame.height / geom.totalTilesY;

  for (let y = 0; y < geom.totalTilesY; y += 1) {
    for (let x = 0; x < geom.totalTilesX; x += 1) {
      if (!isPanelForcedOff(x, y, geom)) {
        continue;
      }

      const dx = frame.x + x * tileW;
      const dy = frame.y + y * tileH;
      callback(dx, dy, tileW, tileH);
    }
  }
}

function getForcedOffSubGridRects(geom, frame, sourceWidth, sourceHeight) {
  const rects = [];
  const { pixels, step } = getSubGridConfig(geom, sourceWidth, sourceHeight);
  const keyPrefix = `${pixels.width}x${pixels.height}@${step}:`;

  subGridPowerOverrides.forEach((key) => {
    if (!key.startsWith(keyPrefix)) {
      return;
    }

    const coordPart = key.slice(keyPrefix.length);
    const [cellXRaw, cellYRaw] = coordPart.split(",");
    const cellX = Number(cellXRaw);
    const cellY = Number(cellYRaw);
    if (!Number.isInteger(cellX) || !Number.isInteger(cellY) || cellX < 0 || cellY < 0) {
      return;
    }

    const startPxX = cellX * step;
    const startPxY = cellY * step;
    if (startPxX >= pixels.width || startPxY >= pixels.height) {
      return;
    }

    const endPxX = Math.min((cellX + 1) * step, pixels.width);
    const endPxY = Math.min((cellY + 1) * step, pixels.height);
    const dx = frame.x + (startPxX / pixels.width) * frame.width;
    const dy = frame.y + (startPxY / pixels.height) * frame.height;
    const dw = ((endPxX - startPxX) / pixels.width) * frame.width;
    const dh = ((endPxY - startPxY) / pixels.height) * frame.height;
    rects.push({ cellX, cellY, dx, dy, dw, dh });
  });

  return rects;
}

function drawForcedOffSubGridCells(geom, frame, sourceWidth, sourceHeight) {
  const rects = getForcedOffSubGridRects(geom, frame, sourceWidth, sourceHeight);

  ctx.save();
  ctx.fillStyle = OFF_TILE_COLOR;

  rects.forEach(({ dx, dy, dw, dh }) => {
    ctx.fillRect(dx, dy, dw, dh);
  });

  ctx.restore();
}

function getIdentifyPulse() {
  const t = performance.now() * 0.0032;
  const s = (Math.sin(t) + 1) * 0.5;
  return Math.pow(s, 1.5);
}

function isIdentifyAnimationActive() {
  return identifyPanelsEnabled || identifySubGridEnabled;
}

function updateIdentifyButtonsUI() {
  identifyPanelsButton?.classList.toggle("is-active", identifyPanelsEnabled);
  identifySubGridButton?.classList.toggle("is-active", identifySubGridEnabled);
}

function addRoundedRectPath(context, x, y, width, height, radius) {
  const w = Math.max(0, width);
  const h = Math.max(0, height);
  const r = Math.max(0, Math.min(radius, w * 0.5, h * 0.5));

  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + w - r, y);
  context.quadraticCurveTo(x + w, y, x + w, y + r);
  context.lineTo(x + w, y + h - r);
  context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  context.lineTo(x + r, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function drawIdentifyPanelsGlow(geom, frame, pulse) {
  if (!identifyPanelsEnabled || pulse <= 0.001) {
    return;
  }

  forEachForcedOffPanelRect(geom, frame, (dx, dy, dw, dh) => {
    const inset = Math.max(0.6, Math.min(dw, dh) * 0.06);
    const x = dx + inset;
    const y = dy + inset;
    const w = Math.max(1, dw - inset * 2);
    const h = Math.max(1, dh - inset * 2);
    const radius = Math.max(3, Math.min(w, h) * 0.24);
    const edgeWidth = Math.max(1.2, Math.min(w, h) * 0.14);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;

    ctx.save();
    addRoundedRectPath(ctx, x, y, w, h, radius);
    ctx.clip();

    // Uniform molten surface with slight vertical sheen.
    const fill = ctx.createLinearGradient(0, y, 0, y + h);
    fill.addColorStop(0, `rgba(255, 250, 238, ${0.60 * pulse})`);
    fill.addColorStop(1, `rgba(240, 228, 208, ${0.52 * pulse})`);
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);

    // White-hot core pool.
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.75);
    core.addColorStop(0, `rgba(255, 255, 248, ${0.78 * pulse})`);
    core.addColorStop(0.52, `rgba(255, 241, 198, ${0.52 * pulse})`);
    core.addColorStop(1, `rgba(255, 198, 122, ${0.18 * pulse})`);
    ctx.fillStyle = core;
    ctx.fillRect(x, y, w, h);

    // Hydrophobic meniscus edge band.
    ctx.save();
    addRoundedRectPath(ctx, x + edgeWidth, y + edgeWidth, Math.max(1, w - edgeWidth * 2), Math.max(1, h - edgeWidth * 2), Math.max(1, radius - edgeWidth));
    ctx.clip("evenodd");
    const edge = ctx.createLinearGradient(x, y, x + w, y + h);
    edge.addColorStop(0, `rgba(255, 196, 116, ${0.62 * pulse})`);
    edge.addColorStop(0.6, `rgba(255, 226, 170, ${0.44 * pulse})`);
    edge.addColorStop(1, `rgba(110, 212, 255, ${0.28 * pulse})`);
    ctx.shadowBlur = Math.max(10, edgeWidth * 2.5);
    ctx.shadowColor = `rgba(255, 210, 130, ${0.58 * pulse})`;
    ctx.fillStyle = edge;
    ctx.fillRect(x, y, w, h);
    ctx.restore();

    ctx.restore();
  });
}

function drawIdentifySubGridGlow(geom, frame, sourceWidth, sourceHeight, pulse) {
  if (!identifySubGridEnabled || pulse <= 0.001) {
    return;
  }

  const rects = getForcedOffSubGridRects(geom, frame, sourceWidth, sourceHeight);
  if (rects.length === 0) {
    return;
  }

  const cellSet = new Set(rects.map(({ cellX, cellY }) => `${cellX},${cellY}`));

  // Shared molten surface across all touching cells.
  ctx.save();
  ctx.fillStyle = `rgba(250, 242, 224, ${0.54 * pulse})`;
  rects.forEach(({ dx, dy, dw, dh }) => {
    ctx.fillRect(dx, dy, dw, dh);
  });
  ctx.restore();

  rects.forEach(({ cellX, cellY, dx, dy, dw, dh }) => {
    const topExposed = !cellSet.has(`${cellX},${cellY - 1}`);
    const rightExposed = !cellSet.has(`${cellX + 1},${cellY}`);
    const bottomExposed = !cellSet.has(`${cellX},${cellY + 1}`);
    const leftExposed = !cellSet.has(`${cellX - 1},${cellY}`);
    const edge = Math.max(1, Math.min(dw, dh) * 0.18);

    ctx.save();
    ctx.beginPath();
    ctx.rect(dx, dy, dw, dh);
    ctx.clip();

    // Meniscus bands only where neighboring cells are hydrophobic/open.
    if (topExposed) {
      const g = ctx.createLinearGradient(dx, dy, dx, dy + edge);
      g.addColorStop(0, `rgba(255, 191, 112, ${0.70 * pulse})`);
      g.addColorStop(1, `rgba(255, 247, 228, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(dx, dy, dw, edge);
    }
    if (bottomExposed) {
      const g = ctx.createLinearGradient(dx, dy + dh - edge, dx, dy + dh);
      g.addColorStop(0, `rgba(255, 247, 228, 0)`);
      g.addColorStop(1, `rgba(255, 191, 112, ${0.68 * pulse})`);
      ctx.fillStyle = g;
      ctx.fillRect(dx, dy + dh - edge, dw, edge);
    }
    if (leftExposed) {
      const g = ctx.createLinearGradient(dx, dy, dx + edge, dy);
      g.addColorStop(0, `rgba(255, 191, 112, ${0.70 * pulse})`);
      g.addColorStop(1, `rgba(255, 247, 228, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(dx, dy, edge, dh);
    }
    if (rightExposed) {
      const g = ctx.createLinearGradient(dx + dw - edge, dy, dx + dw, dy);
      g.addColorStop(0, `rgba(255, 247, 228, 0)`);
      g.addColorStop(1, `rgba(255, 191, 112, ${0.68 * pulse})`);
      ctx.fillStyle = g;
      ctx.fillRect(dx + dw - edge, dy, edge, dh);
    }

    // Surface-tension corner arcs where two exposed edges meet.
    const arcRadius = edge * 1.6;
    const drawCornerArc = (x, y) => {
      const corner = ctx.createRadialGradient(x, y, 0, x, y, arcRadius);
      corner.addColorStop(0, `rgba(255, 247, 224, ${0.78 * pulse})`);
      corner.addColorStop(0.55, `rgba(255, 199, 122, ${0.55 * pulse})`);
      corner.addColorStop(1, `rgba(255, 247, 224, 0)`);
      ctx.fillStyle = corner;
      ctx.fillRect(x - arcRadius, y - arcRadius, arcRadius * 2, arcRadius * 2);
    };

    if (topExposed && leftExposed) {
      drawCornerArc(dx + edge, dy + edge);
    }
    if (topExposed && rightExposed) {
      drawCornerArc(dx + dw - edge, dy + edge);
    }
    if (bottomExposed && leftExposed) {
      drawCornerArc(dx + edge, dy + dh - edge);
    }
    if (bottomExposed && rightExposed) {
      drawCornerArc(dx + dw - edge, dy + dh - edge);
    }

    // Uniform top highlight.
    const topSheen = ctx.createLinearGradient(dx, dy, dx, dy + dh * 0.45);
    topSheen.addColorStop(0, `rgba(255, 255, 250, ${0.42 * pulse})`);
    topSheen.addColorStop(1, "rgba(255, 255, 250, 0)");
    ctx.fillStyle = topSheen;
    ctx.fillRect(dx, dy, dw, dh);

    ctx.restore();
  });
}

function drawTiledArea(tileCanvas, inspectOverlayCanvas, inspectedTile, geom, frame, inspectBleedRadius = INSPECT_BLEED_RADIUS) {
  const tileW = frame.width / geom.totalTilesX;
  const tileH = frame.height / geom.totalTilesY;

  // Always use nearest-neighbor for final upscale to output viewport.
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < geom.totalTilesY; y += 1) {
    for (let x = 0; x < geom.totalTilesX; x += 1) {
      const dx = frame.x + x * tileW;
      const dy = frame.y + y * tileH;

      if (isPanelForcedOff(x, y, geom)) {
        ctx.fillStyle = OFF_TILE_COLOR;
        ctx.fillRect(dx, dy, tileW, tileH);
      } else {
        ctx.drawImage(tileCanvas, dx, dy, tileW, tileH);
      }
    }
  }

  if (!inspectOverlayCanvas || !inspectedTile) {
    return;
  }

  // Draw a single inspect overlay that spills onto neighboring tiles without per-tile recentering.
  const fieldTiles = inspectBleedRadius * 2 + 1;
  const overlayX = frame.x + (inspectedTile.tileX - inspectBleedRadius) * tileW;
  const overlayY = frame.y + (inspectedTile.tileY - inspectBleedRadius) * tileH;
  const overlayW = tileW * fieldTiles;
  const overlayH = tileH * fieldTiles;
  ctx.drawImage(inspectOverlayCanvas, overlayX, overlayY, overlayW, overlayH);

  // Combined debug marker: crosshair + dot at transformed checker-basis origin.
  const checkerOriginX = Number(inspectOverlayCanvas.__debugOriginX);
  const checkerOriginY = Number(inspectOverlayCanvas.__debugOriginY);
  if (Number.isFinite(checkerOriginX) && Number.isFinite(checkerOriginY)) {
    const markerX = overlayX + (checkerOriginX / Math.max(1, inspectOverlayCanvas.width)) * overlayW;
    const markerY = overlayY + (checkerOriginY / Math.max(1, inspectOverlayCanvas.height)) * overlayH;
    const armLength = Math.max(8, Math.min(tileW, tileH) * 0.3);
    const radius = Math.max(2, Math.min(tileW, tileH) * 0.08);
    ctx.save();
    ctx.strokeStyle = "#ff2a2a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(markerX - armLength, markerY);
    ctx.lineTo(markerX + armLength, markerY);
    ctx.moveTo(markerX, markerY - armLength);
    ctx.lineTo(markerX, markerY + armLength);
    ctx.stroke();
    ctx.fillStyle = "#ff2a2a";
    ctx.beginPath();
    ctx.arc(markerX, markerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawTileGrid(geom, frame) {
  if (!showTileLinesInput.checked) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = tileLineColorInput.value || "#ff8040";
  ctx.lineWidth = Math.max(0.1, sanitizeNumber(tileLineWidthInput.value, 1));

  for (let x = 1; x < geom.totalTilesX; x += 1) {
    const px = frame.x + (x / geom.totalTilesX) * frame.width;
    ctx.beginPath();
    ctx.moveTo(px, frame.y);
    ctx.lineTo(px, frame.y + frame.height);
    ctx.stroke();
  }

  for (let y = 1; y < geom.totalTilesY; y += 1) {
    const py = frame.y + (y / geom.totalTilesY) * frame.height;
    ctx.beginPath();
    ctx.moveTo(frame.x, py);
    ctx.lineTo(frame.x + frame.width, py);
    ctx.stroke();
  }

  ctx.restore();
}

function getEffectiveScreenPixelDimensions(geom, sourceWidth, sourceHeight) {
  const configuredPxW = sanitizeNumber(pixelsWideInput.value, 0);
  const configuredPxH = sanitizeNumber(pixelsHighInput.value, 0);
  const fallbackW = Math.max(1, Math.round(sourceWidth * geom.totalTilesX));
  const fallbackH = Math.max(1, Math.round(sourceHeight * geom.totalTilesY));

  return {
    width: configuredPxW > 0 ? Math.max(1, Math.round(configuredPxW)) : fallbackW,
    height: configuredPxH > 0 ? Math.max(1, Math.round(configuredPxH)) : fallbackH,
  };
}

function updateSubGridPresetButtons() {
  if (!subGridPresetButtons) {
    return;
  }

  const geom = getGeometry();
  const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();
  const pixels = getEffectiveScreenPixelDimensions(geom, sourceWidth, sourceHeight);
  const maxStep = Math.max(1, Math.min(pixels.width, pixels.height));
  const current = clampValue(Math.max(1, Math.round(sanitizeNumber(subGridStepSize, 16))), 1, maxStep);
  subGridStepSize = current;

  if (subGridPresetButtons.children.length === 0) {
    SUBGRID_PRESET_VALUES.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "checker-preset-button mode-toggle mode-toggle-square";
      button.dataset.value = String(value);
      button.title = `Set sub-grid to ${value} x ${value} pixels`;
      button.setAttribute("aria-label", `Set sub-grid size to ${value} by ${value} pixels`);

      const icon = document.createElement("span");
      icon.className = "mode-toggle-icon";
      icon.textContent = String(value);
      button.appendChild(icon);

      button.addEventListener("click", () => {
        subGridStepSize = value;
        if (showSubGridLinesInput) {
          showSubGridLinesInput.checked = true;
        }
        updateSubGridPresetButtons();
        requestDraw();
      });

      subGridPresetButtons.appendChild(button);
    });
  }

  Array.from(subGridPresetButtons.children).forEach((node) => {
    const button = node;
    const value = Math.max(1, Math.round(sanitizeNumber(button.dataset.value, 1)));
    const isDisabled = value > maxStep;
    const isActive = !isDisabled && current === value;
    button.disabled = isDisabled;
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    button.classList.toggle("is-active", isActive);
  });
}

function drawSubGrid(geom, frame, sourceWidth, sourceHeight) {
  if (!showSubGridLinesInput?.checked) {
    return;
  }

  const pixels = getEffectiveScreenPixelDimensions(geom, sourceWidth, sourceHeight);
  const step = clampValue(Math.max(1, Math.round(sanitizeNumber(subGridStepSize, 16))), 1, Math.max(1, Math.min(pixels.width, pixels.height)));
  subGridStepSize = step;
  const color = getAccentColorFromBase(tileLineColorInput.value || "#7f007f");

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, Math.min(1, Math.max(0.1, sanitizeNumber(tileLineWidthInput.value, 1) * 0.5)));

  for (let x = step; x < pixels.width; x += step) {
    const px = frame.x + (x / pixels.width) * frame.width;
    ctx.beginPath();
    ctx.moveTo(px, frame.y);
    ctx.lineTo(px, frame.y + frame.height);
    ctx.stroke();
  }

  for (let y = step; y < pixels.height; y += step) {
    const py = frame.y + (y / pixels.height) * frame.height;
    ctx.beginPath();
    ctx.moveTo(frame.x, py);
    ctx.lineTo(frame.x + frame.width, py);
    ctx.stroke();
  }

  ctx.restore();
}

async function draw() {
  const drawToken = ++latestDrawToken;

  const geom = getGeometry();
  const viewportWForTile = window.innerWidth;
  const viewportHForTile = window.innerHeight;
  const frameForTile = getRenderFrame(viewportWForTile, viewportHForTile, geom);
  const tileAspect = (frameForTile.width / geom.totalTilesX) / (frameForTile.height / geom.totalTilesY);
  const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();

  const preset = getActivePreset();
  const css = activePresetId === "custom" ? customCssInput.value.trim() || preset.css : preset.css;
  const shiftMode = shiftCoordinateMode;
  const sliderShiftX = sanitizeNumber(tileShiftXRange.value, 0);
  const sliderShiftY = sanitizeNumber(tileShiftYRange.value, 0);
  const shiftXValue = shiftMode === "screen" ? screenModeLocalShiftX : sliderShiftX;
  const shiftYValue = shiftMode === "screen" ? screenModeLocalShiftY : sliderShiftY;
  const renderShiftX = -shiftXValue;
  const renderShiftY = -shiftYValue;
  const rotationValue = sanitizeNumber(rotationRange.value, 0);

  if (isFullscreenImagePreset(activePresetId)) {
    const fullscreenImage = await getFullscreenImageElement();
    if (drawToken !== latestDrawToken) {
      return;
    }

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const fullFrame = { x: 0, y: 0, width: viewportW, height: viewportH, hasBars: false };

    resizeCanvas();
    ctx.clearRect(0, 0, viewportW, viewportH);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, viewportW, viewportH);
    if (fullscreenImage) {
      let imagePanXPercent = sliderShiftX;
      let imagePanYPercent = sliderShiftY;

      if (shiftMode === "tile") {
        // Tile mode for fullscreen image means movement in image-local axes.
        const screenPan = localToScreenShift(sliderShiftX, sliderShiftY, getRotationRadians(), viewportW, viewportH);
        imagePanXPercent = screenPan.x;
        imagePanYPercent = screenPan.y;
      }

      drawImageCoverTransformed(fullscreenImage, viewportW, viewportH, imagePanXPercent, imagePanYPercent, rotationValue);
    }

    drawForcedOffPanels(geom, fullFrame);
    drawForcedOffSubGridCells(geom, fullFrame, sourceWidth, sourceHeight);

    const identifyPulse = getIdentifyPulse();
    drawIdentifyPanelsGlow(geom, fullFrame, identifyPulse);
    drawIdentifySubGridGlow(geom, fullFrame, sourceWidth, sourceHeight, identifyPulse);

    drawSubGrid(geom, fullFrame, sourceWidth, sourceHeight);
    drawTileGrid(geom, fullFrame);
    drawSelectedSubGridOutlines(geom, fullFrame, sourceWidth, sourceHeight);
    drawSelectedPanelOutlines(geom, fullFrame);

    updateOutputs();
    updateInfo(geom);
    if (isIdentifyAnimationActive()) {
      requestDraw();
    }
    return;
  }

  const [tileCanvas, sourceTileCanvas] = await Promise.all([
    getTileCanvas(sourceWidth, sourceHeight, activePresetId, css, renderShiftX, renderShiftY, rotationValue, tileAspect, shiftMode),
    getSourceTileCanvas(sourceWidth, sourceHeight, activePresetId, css),
  ]);

  const inspectedTile = getInspectedPanelTile(geom);
  const inspectOverlayCanvas = inspectedTile
    ? buildInspectOverlayNoWrap(
      sourceTileCanvas,
      renderShiftX,
      renderShiftY,
      rotationValue,
      isRenderSmoothingEnabled(),
      sourceWidth,
      sourceHeight,
      INSPECT_BLEED_RADIUS,
    )
    : null;

  if (drawToken !== latestDrawToken) {
    return;
  }

  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const frame = getRenderFrame(viewportW, viewportH, geom);

  resizeCanvas();
  ctx.clearRect(0, 0, viewportW, viewportH);
  ctx.fillStyle = "#07f7d2";
  ctx.fillRect(0, 0, viewportW, viewportH);

  if (frame.hasBars) {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
    ctx.restore();
  }

  drawTiledArea(tileCanvas, inspectOverlayCanvas, inspectedTile, geom, frame, INSPECT_BLEED_RADIUS);
  drawForcedOffSubGridCells(geom, frame, sourceWidth, sourceHeight);

  const identifyPulse = getIdentifyPulse();
  drawIdentifyPanelsGlow(geom, frame, identifyPulse);
  drawIdentifySubGridGlow(geom, frame, sourceWidth, sourceHeight, identifyPulse);

  drawSubGrid(geom, frame, sourceWidth, sourceHeight);
  drawTileGrid(geom, frame);
  drawSelectedSubGridOutlines(geom, frame, sourceWidth, sourceHeight);
  drawSelectedPanelOutlines(geom, frame);

  updateOutputs();
  updateInfo(geom);
  if (isIdentifyAnimationActive()) {
    requestDraw();
  }
}

function requestDraw() {
  if (drawScheduled) {
    return;
  }

  drawScheduled = true;
  window.requestAnimationFrame(() => {
    drawScheduled = false;
    draw();
  });
}

function updateShiftModeToggleUI() {
  const isScreenMode = shiftCoordinateMode === "screen";
  shiftModeToggleButton.setAttribute("aria-pressed", isScreenMode ? "true" : "false");
  shiftModeToggleIcon.textContent = isScreenMode ? "S" : "T";
  shiftModeToggleButton.title = isScreenMode
    ? "Shift mode: Screen coordinates. Click to switch to tile coordinates."
    : "Shift mode: Tile coordinates. Click to switch to screen coordinates.";
  shiftModeToggleButton.setAttribute("aria-label", isScreenMode ? "Shift mode screen coordinates" : "Shift mode tile coordinates");
}

function updateShiftStepModeToggleUI() {
  const isPixelMode = shiftStepMode === "pixel";
  shiftStepModeToggleButton.setAttribute("aria-pressed", isPixelMode ? "true" : "false");
  shiftStepModeToggleIcon.textContent = isPixelMode ? "1" : "%";
  shiftStepModeToggleButton.title = isPixelMode
    ? "Shift step: 1px mode. Click to switch to percent mode."
    : "Shift step: percent mode. Click to switch to 1px mode.";
  shiftStepModeToggleButton.setAttribute("aria-label", isPixelMode ? "Shift step one pixel mode" : "Shift step percent mode");
}

function updateRenderFilterToggleUI() {
  const isAntialias = renderFilterMode === "antialias";
  renderFilterToggleButton.setAttribute("aria-pressed", isAntialias ? "true" : "false");
  renderFilterToggleIcon.textContent = isAntialias ? "A" : "N";
  renderFilterToggleButton.title = isAntialias
    ? "Render filter: anti-aliased transform. Click to switch to nearest neighbor."
    : "Render filter: nearest neighbor. Click to switch to anti-aliased transform.";
  renderFilterToggleButton.setAttribute("aria-label", isAntialias ? "Render filter anti-aliased" : "Render filter nearest neighbor");
}

function toggleRenderFilterMode() {
  renderFilterMode = renderFilterMode === "nearest" ? "antialias" : "nearest";
  updateRenderFilterToggleUI();
  requestDraw();
}

function toggleShiftStepMode() {
  shiftStepMode = shiftStepMode === "percent" ? "pixel" : "percent";
  updateShiftSliderPresentation({ snapValues: true });
  if (shiftCoordinateMode === "screen") {
    syncScreenLocalFromSliderValues();
  }
  updateShiftStepModeToggleUI();
  updateWheelModeBadge({ transient: true });
}

function normalizeZero(value) {
  return Math.abs(value) < 1e-9 ? 0 : value;
}

function getShiftAxisPixelCounts() {
  const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();

  if (isLinePreset(activePresetId)) {
    return {
      x: Math.max(1, getLinePeriodPixels(sourceWidth, sourceHeight, sanitizeNumber(rotationRange.value, 0))),
      y: Math.max(1, Math.round(sourceHeight)),
    };
  }

  return {
    x: Math.max(1, Math.round(sourceWidth)),
    y: Math.max(1, Math.round(sourceHeight)),
  };
}

function updateShiftSliderPresentation({ snapValues = false } = {}) {
  const isCurtainTileMode = isCurtainPreset(activePresetId) && shiftCoordinateMode !== "screen";
  if (shiftStepMode === "pixel") {
    const axis = getShiftAxisPixelCounts();
    const xBounds = getPixelShiftPercentBounds(axis.x);
    const yBounds = getPixelShiftPercentBounds(axis.y);
    tileShiftXRange.min = String(xBounds.minPercent);
    tileShiftXRange.max = String(xBounds.maxPercent);
    tileShiftYRange.min = String(yBounds.minPercent);
    tileShiftYRange.max = String(yBounds.maxPercent);

    // Keep browser slider unconstrained; we snap to exact whole-pixel positions in JS.
    tileShiftXRange.step = "any";
    tileShiftYRange.step = "any";

    if (snapValues) {
      const xSnapped = stepPercentByWholePixels(sanitizeNumber(tileShiftXRange.value, 0), 0, axis.x);
      const ySnapped = stepPercentByWholePixels(sanitizeNumber(tileShiftYRange.value, 0), 0, axis.y);
      tileShiftXRange.value = String(normalizeZero(xSnapped));
      tileShiftYRange.value = String(normalizeZero(ySnapped));
    }

    const xPixels = Math.round((sanitizeNumber(tileShiftXRange.value, 0) / 100) * axis.x);
    const yPixels = Math.round((sanitizeNumber(tileShiftYRange.value, 0) / 100) * axis.y);
    tileShiftXOutput.textContent = `${xPixels} px`;
    tileShiftYOutput.textContent = `${yPixels} px`;
  } else {
    tileShiftXRange.min = "-50";
    tileShiftXRange.max = "50";
    tileShiftYRange.min = "-50";
    tileShiftYRange.max = "50";
    tileShiftXRange.step = "0.1";
    tileShiftYRange.step = "0.1";

    if (snapValues) {
      const xSnapped = snapToStep(sanitizeNumber(tileShiftXRange.value, 0), tileShiftXRange);
      const ySnapped = snapToStep(sanitizeNumber(tileShiftYRange.value, 0), tileShiftYRange);
      tileShiftXRange.value = String(normalizeZero(xSnapped));
      tileShiftYRange.value = String(normalizeZero(ySnapped));
    }

    const xPercent = sanitizeNumber(tileShiftXRange.value, 0);
    const yPercent = sanitizeNumber(tileShiftYRange.value, 0);
    tileShiftXOutput.textContent = `${normalizeZero(xPercent).toFixed(1)}%`;
    tileShiftYOutput.textContent = `${normalizeZero(yPercent).toFixed(1)}%`;
  }

  tileShiftYRange.disabled = isCurtainTileMode;
  tileShiftYGroup?.classList.toggle("is-disabled", isCurtainTileMode);
  cycleIncludeShiftY?.closest(".cycle-caption")?.classList.toggle("is-disabled", isCurtainTileMode);
  if (cycleIncludeShiftY) {
    cycleIncludeShiftY.disabled = isCurtainTileMode;
  }
  if (isCurtainTileMode) {
    tileShiftYOutput.textContent = "Disabled";
  }

  previousShiftXSliderValue = sanitizeNumber(tileShiftXRange.value, 0);
  previousShiftYSliderValue = sanitizeNumber(tileShiftYRange.value, 0);
}

function getShiftWheelStepMultiplier(axis) {
  if (shiftStepMode !== "pixel") {
    return 1;
  }

  const geom = getGeometry();
  const configuredPxW = sanitizeNumber(pixelsWideInput.value, 0);
  const configuredPxH = sanitizeNumber(pixelsHighInput.value, 0);

  let tileW = 0;
  let tileH = 0;

  if (configuredPxW > 0 && configuredPxH > 0) {
    tileW = configuredPxW / geom.totalTilesX;
    tileH = configuredPxH / geom.totalTilesY;
  } else {
    const frame = getRenderFrame(window.innerWidth, window.innerHeight, geom);
    tileW = frame.width / geom.totalTilesX;
    tileH = frame.height / geom.totalTilesY;
  }

  if (axis === "x" && tileW > 0) {
    return 100 / tileW;
  }

  if (axis === "y" && tileH > 0) {
    return 100 / tileH;
  }

  return 1;
}

function toggleShiftCoordinateMode() {
  const currentX = sanitizeNumber(tileShiftXRange.value, 0);
  const currentY = sanitizeNumber(tileShiftYRange.value, 0);

  if (shiftCoordinateMode === "tile") {
    // Preserve current visual state when entering screen mode.
    screenModeLocalShiftX = currentX;
    screenModeLocalShiftY = currentY;
  }

  shiftCoordinateMode = shiftCoordinateMode === "tile" ? "screen" : "tile";

  if (shiftCoordinateMode === "screen") {
    syncScreenSliderValuesFromLocal();
  } else {
    // Returning to tile mode: controls represent local shift directly.
    setShiftSliderValues(screenModeLocalShiftX, screenModeLocalShiftY);
    updateOutputs();
  }

  updateShiftModeToggleUI();
  updateWheelModeBadge({ transient: true });
  requestDraw();
}

function resetTransformControls() {
  rotationRange.value = "0";

  if (shiftCoordinateMode === "screen") {
    screenModeLocalShiftX = 0;
    screenModeLocalShiftY = 0;
    setShiftSliderValues(0, 0, { snap: shiftStepMode !== "pixel" });
  } else {
    setShiftSliderValues(0, 0, { snap: shiftStepMode !== "pixel" });
  }

  updateOutputs();
  requestDraw();
}

function updateOutputs() {
  updateCheckerPixelSizeControl();
  updateShiftSliderPresentation();
  updateSubGridPresetButtons();
  rotationOutput.textContent = `${rotationRange.value} deg`;
}

function updateInfo(geom) {
  const physicalWidth = sanitizeNumber(physicalWidthInput.value, 0);
  const physicalHeight = sanitizeNumber(physicalHeightInput.value, 0);
  const pxWidth = sanitizeNumber(pixelsWideInput.value, 0);
  const pxHeight = sanitizeNumber(pixelsHighInput.value, 0);

  const totalTiles = geom.totalTilesX * geom.totalTilesY;
  const moduleCount = geom.modulesWide * geom.modulesHigh;

  let lines = [
    `Modules: ${geom.modulesWide} x ${geom.modulesHigh} (${moduleCount} total)`,
    `Tiles per module: ${geom.tilesPerModuleX} x ${geom.tilesPerModuleY}`,
    `Total tiles: ${geom.totalTilesX} x ${geom.totalTilesY} (${totalTiles} total)`,
  ];

  if (physicalWidth > 0 && physicalHeight > 0) {
    const tilePhysicalW = physicalWidth / geom.totalTilesX;
    const tilePhysicalH = physicalHeight / geom.totalTilesY;
    lines.push(`Tile size: ${(tilePhysicalW * 100).toFixed(1)}cm x ${(tilePhysicalH * 100).toFixed(1)}cm`);
  }

  if (pxWidth > 0 && pxHeight > 0) {
    const pxPerTileW = pxWidth / geom.totalTilesX;
    const pxPerTileH = pxHeight / geom.totalTilesY;
    lines.push(`Pixels per tile: ${Math.round(pxPerTileW)} x ${Math.round(pxPerTileH)}`);

    if (physicalWidth > 0 && physicalHeight > 0) {
      const pitchXmm = (physicalWidth * 1000) / pxWidth;
      const pitchYmm = (physicalHeight * 1000) / pxHeight;
      lines.push(`Pixel pitch est.: ${pitchXmm.toFixed(2)}mm (x), ${pitchYmm.toFixed(2)}mm (y)`);
    }
  }

  infoBox.innerHTML = lines.map((line) => `<div>${line}</div>`).join("");
}

function snapConfiguredPixelInputToPanelGrid(input, panelsPerAxis) {
  const raw = sanitizeNumber(input.value, 0);
  const step = Math.max(1, Math.round(panelsPerAxis));

  // Keep 0 as explicit "unset" fallback to viewport-derived sizing.
  if (raw <= 0) {
    if (input.value !== "0") {
      input.value = "0";
      return true;
    }
    return false;
  }

  const snapped = Math.max(step, Math.round(raw / step) * step);
  const changed = Math.abs(snapped - raw) > 1e-9 || input.value !== String(snapped);
  if (changed) {
    input.value = String(snapped);
  }

  return changed;
}

function enforceConfiguredPixelPanelAlignment() {
  const geom = getGeometry();
  const widthChanged = snapConfiguredPixelInputToPanelGrid(pixelsWideInput, geom.totalTilesX);
  const heightChanged = snapConfiguredPixelInputToPanelGrid(pixelsHighInput, geom.totalTilesY);
  return widthChanged || heightChanged;
}

function updateConfiguredPixelInputSteps() {
  const geom = getGeometry();
  pixelsWideInput.step = String(Math.max(1, geom.totalTilesX));
  pixelsHighInput.step = String(Math.max(1, geom.totalTilesY));
}

function commitConfiguredPixelInputs() {
  enforceConfiguredPixelPanelAlignment();
  requestDraw();
}

function togglePanel(forceVisible) {
  const shouldShow = typeof forceVisible === "boolean" ? forceVisible : panel.classList.contains("hidden");
  panel.classList.toggle("hidden", !shouldShow);
  if (!shouldShow) {
    isPointerOverPanel = false;
  }
}

function cycleWheelMode(step = 1) {
  const allModes = getActiveWheelModes();
  const currentMode = getCurrentWheelMode();
  const currentIndex = allModes.indexOf(currentMode);
  const nextMode = allModes[(currentIndex + step + allModes.length) % allModes.length];
  wheelModeIndex = wheelModes.indexOf(nextMode);
  updateWheelModeBadge({ transient: true });
}

function setActiveWheelMode(mode, { transient = true } = {}) {
  if (!getActiveWheelModes().includes(mode)) {
    return;
  }

  const nextIndex = wheelModes.indexOf(mode);
  if (nextIndex < 0 || nextIndex === wheelModeIndex) {
    return;
  }

  wheelModeIndex = nextIndex;
  updateWheelModeBadge({ transient });
}

function applyWheelLogicalDelta(stepDelta) {
  if (stepDelta === 0) {
    return;
  }

  const activeMode = getCurrentWheelMode();
  const rotationStepDeg = Math.max(0.1, sanitizeNumber(wheelRotationStepInput.value, 2));

  if (activeMode === "size") {
    if (!usesSizeSliderPreset(activePresetId)) {
      return;
    }

    const current = Math.round(sanitizeNumber(checkerPixelSizeRange.value, 1));
    const min = Math.round(sanitizeNumber(checkerPixelSizeRange.min, 1));
    const max = Math.max(1, Math.round(sanitizeNumber(checkerPixelSizeRange.max, 1)));
    const next = clampValue(current + stepDelta, min, max);
    if (next !== current) {
      checkerPixelSizeRange.value = String(next);
      tileCache.clear();
      sourceTileCache.clear();
    }
  } else if (activeMode === "shift-x" || activeMode === "shift-y") {
    if (shiftStepMode === "pixel") {
      const axisPixels = getShiftAxisPixelCounts();
      const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();

      if (shiftCoordinateMode === "screen") {
        const currentScreenX = sanitizeNumber(tileShiftXRange.value, 0);
        const currentScreenY = sanitizeNumber(tileShiftYRange.value, 0);
        const nextScreenX = activeMode === "shift-x"
          ? stepPercentByWholePixels(currentScreenX, stepDelta, axisPixels.x)
          : currentScreenX;
        const nextScreenY = activeMode === "shift-y"
          ? stepPercentByWholePixels(currentScreenY, stepDelta, axisPixels.y)
          : currentScreenY;

        const local = screenToLocalShift(nextScreenX, nextScreenY, getRotationRadians(), axisPixels.x, axisPixels.y);
        screenModeLocalShiftX = local.x;
        screenModeLocalShiftY = local.y;
        setShiftSliderValues(nextScreenX, nextScreenY, { snap: false });
      } else if (activeMode === "shift-x") {
        const current = sanitizeNumber(tileShiftXRange.value, 0);
        const next = stepPercentByWholePixels(current, stepDelta, axisPixels.x);
        tileShiftXRange.value = String(next);
        previousShiftXSliderValue = next;
      } else {
        const current = sanitizeNumber(tileShiftYRange.value, 0);
        const next = stepPercentByWholePixels(current, stepDelta, axisPixels.y);
        tileShiftYRange.value = String(next);
        previousShiftYSliderValue = next;
      }
    } else if (activeMode === "shift-x") {
      wrapRangeInput(tileShiftXRange, stepDelta, getShiftWheelStepMultiplier("x"));
      previousShiftXSliderValue = sanitizeNumber(tileShiftXRange.value, 0);
      if (shiftCoordinateMode === "screen") {
        syncScreenLocalFromSliderValues();
      }
    } else {
      wrapRangeInput(tileShiftYRange, stepDelta, getShiftWheelStepMultiplier("y"));
      previousShiftYSliderValue = sanitizeNumber(tileShiftYRange.value, 0);
      if (shiftCoordinateMode === "screen") {
        syncScreenLocalFromSliderValues();
      }
    }
  } else {
    wrapRangeInput(rotationRange, stepDelta, rotationStepDeg);
    if (shiftCoordinateMode === "screen") {
      syncScreenSliderValuesFromLocal();
    }
  }

  requestDraw();
}

function showWheelModeBadgeTransient() {
  wheelModeBadge.classList.remove("fade-out");
  wheelModeBadge.classList.add("visible");

  if (wheelModeBadgeTimer) {
    window.clearTimeout(wheelModeBadgeTimer);
  }

  wheelModeBadgeTimer = window.setTimeout(() => {
    wheelModeBadge.classList.add("fade-out");
    wheelModeBadge.classList.remove("visible");
  }, 5000);
}

function updateWheelModeBadge({ transient = false } = {}) {
  const mode = getCurrentWheelMode();
  const shiftModeText = shiftCoordinateMode === "screen" ? "Screen" : "Tile";
  const shiftStepText = shiftStepMode === "pixel" ? " (1px)" : "";

  [tileShiftXRange, tileShiftYRange, rotationRange, checkerPixelSizeRange].forEach((input) => {
    input.classList.remove("wheel-active");
    input.closest(".control-group")?.classList.remove("wheel-active");
  });

  if (mode === "shift-x") {
    wheelModeBadge.textContent = `Wheel Mode: ${shiftModeText} Shift X${shiftStepText}`;
    tileShiftXRange.classList.add("wheel-active");
    tileShiftXRange.closest(".control-group")?.classList.add("wheel-active");
  } else if (mode === "shift-y") {
    wheelModeBadge.textContent = `Wheel Mode: ${shiftModeText} Shift Y${shiftStepText}`;
    tileShiftYRange.classList.add("wheel-active");
    tileShiftYRange.closest(".control-group")?.classList.add("wheel-active");
  } else {
    wheelModeBadge.textContent = mode === "size"
      ? `Wheel Mode: ${isLinePreset(activePresetId) ? "Band Width" : "Checker Size"}`
      : "Wheel Mode: Rotation";

    if (mode === "size") {
      checkerPixelSizeRange.classList.add("wheel-active");
      checkerPixelSizeRange.closest(".control-group")?.classList.add("wheel-active");
    } else {
      rotationRange.classList.add("wheel-active");
      rotationRange.closest(".control-group")?.classList.add("wheel-active");
    }
  }

  if (transient) {
    showWheelModeBadgeTransient();
  }
}

function isTypingTarget(target) {
  if (!target) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName ? target.tagName.toLowerCase() : "";
  return tagName === "input" || tagName === "textarea" || tagName === "select";
}

function clampRangeInput(input, delta, multiplier = 1) {
  const min = sanitizeNumber(input.min, 0);
  const max = sanitizeNumber(input.max, 100);
  const step = sanitizeNumber(input.step, 1);
  const current = sanitizeNumber(input.value, 0);
  const nextRaw = current + delta * step * multiplier;
  const next = Math.min(max, Math.max(min, nextRaw));
  input.value = String(next);
}

function wrapRangeInput(input, delta, multiplier = 1) {
  const min = sanitizeNumber(input.min, 0);
  const max = sanitizeNumber(input.max, 100);
  const step = sanitizeNumber(input.step, 1);
  const current = sanitizeNumber(input.value, min);
  const cycle = max - min;

  if (cycle <= 0) {
    input.value = String(min);
    return;
  }

  const increment = delta * step * multiplier;

  // Treat max as equivalent to min so wrap uses a true cycle (e.g. 360deg == 0deg).
  let normalized = current - min;
  if (Math.abs(normalized - cycle) < 1e-9) {
    normalized = 0;
  }

  const wrappedNormalized = ((normalized + increment) % cycle + cycle) % cycle;
  const precision = (String(step).split(".")[1] || "").length;
  const wrapped = Number((wrappedNormalized + min).toFixed(Math.min(precision + 3, 8)));
  input.value = String(wrapped);
}

function wrapRangeInputInclusive(input, delta, multiplier = 1) {
  const min = sanitizeNumber(input.min, -100);
  const max = sanitizeNumber(input.max, 100);
  const step = sanitizeNumber(input.step, 1);
  const current = sanitizeNumber(input.value, min);
  const cycle = max - min + step;

  if (cycle <= 0) {
    input.value = String(min);
    return;
  }

  const increment = delta * step * multiplier;
  const wrapped = ((current - min + increment) % cycle + cycle) % cycle + min;
  const precision = (String(step).split(".")[1] || "").length;
  input.value = String(Number(wrapped.toFixed(Math.min(precision + 3, 8))));
}

function setupWheelControls() {
  window.addEventListener("wheel", (event) => {
    if (isPointerOverPanel) {
      return;
    }

    applyInputDelta({
      rawDeltaY: event.deltaY,
      deltaMode: event.deltaMode,
      sourceData: {
        deltaX: event.deltaX,
        deltaZ: event.deltaZ,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
      },
    });

    event.preventDefault();
  }, { passive: false });

  // Browser support for side buttons varies; this captures common mappings.
  window.addEventListener("mouseup", (event) => {
    if (event.button === 3) {
      cycleWheelMode(-1);
      event.preventDefault();
    }

    if (event.button === 4) {
      cycleWheelMode(1);
      event.preventDefault();
    }
  });
}

function setupPanelDragging() {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  panelHeader.addEventListener("mousedown", (event) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;

    const rect = panel.getBoundingClientRect();
    originLeft = rect.left;
    originTop = rect.top;

    event.preventDefault();
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragging) {
      return;
    }

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    const nextLeft = Math.min(window.innerWidth - 120, Math.max(0, originLeft + dx));
    const nextTop = Math.min(window.innerHeight - 40, Math.max(0, originTop + dy));

    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
  });
}

function setupEvents() {
  panel.addEventListener("pointerenter", () => {
    isPointerOverPanel = true;
  });

  panel.addEventListener("pointerleave", () => {
    isPointerOverPanel = false;
  });

  panelToggleButton?.addEventListener("click", () => togglePanel());
  panelCollapseButton.addEventListener("click", () => togglePanel(false));
  shiftModeToggleButton.addEventListener("click", toggleShiftCoordinateMode);
  shiftStepModeToggleButton.addEventListener("click", toggleShiftStepMode);
  renderFilterToggleButton.addEventListener("click", toggleRenderFilterMode);
  resetTransformButton.addEventListener("click", resetTransformControls);

  presetSelect.addEventListener("change", () => {
    activePresetId = presetSelect.value;
    customSection.hidden = activePresetId !== "custom";
    updatePresetColorControlsUI();
    updateImageSourceControlsUI();
    updateCheckerPixelSizeControl();
    updateWheelModeBadge({ transient: false });
    const preset = getActivePreset();
    if (activePresetId === "custom") {
      customCssInput.value = preset.css;
    }
    requestDraw();
  });

  saveCustomPresetButton.addEventListener("click", () => {
    const name = customPresetName.value.trim();
    const css = customCssInput.value.trim();

    if (!name || !css) {
      return;
    }

    const id = `user-${Date.now()}`;
    customPresets.push({ id, name, css });
    saveCustomPresets();
    activePresetId = id;
    renderPresetOptions();
    customPresetName.value = "";
    requestDraw();
  });

  chooseImageSourceButton?.addEventListener("click", () => {
    imageSourceInput?.click();
  });

  useFallbackImageButton?.addEventListener("click", () => {
    persistImageSource("", "");
    updateImageSourceControlsUI();
    requestDraw();
  });

  imageSourceInput?.addEventListener("change", () => {
    const file = imageSourceInput.files && imageSourceInput.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        return;
      }

      persistImageSource(dataUrl, file.name || "Local image");
      updateImageSourceControlsUI();
      requestDraw();
    };
    reader.readAsDataURL(file);

    // Allow selecting the same file again later if needed.
    imageSourceInput.value = "";
  });

  presetColor1Button?.addEventListener("click", () => {
    presetColor1Input.click();
  });

  presetColor2Button?.addEventListener("click", () => {
    presetColor2Input.click();
  });

  presetColor1Input?.addEventListener("input", () => {
    patternColor1 = normalizeHexColor(presetColor1Input.value, patternColor1);
    updatePresetColorControlsUI();
    sourceTileCache.clear();
    tileCache.clear();
    requestDraw();
  });

  presetColor2Input?.addEventListener("input", () => {
    patternColor2 = normalizeHexColor(presetColor2Input.value, patternColor2);
    updatePresetColorControlsUI();
    sourceTileCache.clear();
    tileCache.clear();
    requestDraw();
  });

  presetSwapColorsButton?.addEventListener("click", () => {
    const c1 = patternColor1;
    patternColor1 = patternColor2;
    patternColor2 = c1;
    updatePresetColorControlsUI();
    sourceTileCache.clear();
    tileCache.clear();
    requestDraw();
  });

  tileShiftXRange.addEventListener("input", () => handleShiftSliderInput("x"));
  tileShiftXRange.addEventListener("pointerdown", () => setActiveWheelMode("shift-x", { transient: true }));
  tileShiftXRange.addEventListener("focus", () => setActiveWheelMode("shift-x", { transient: false }));
  tileShiftXRange.closest(".control-group")?.addEventListener("pointerdown", () => setActiveWheelMode("shift-x", { transient: true }));

  tileShiftYRange.addEventListener("input", () => handleShiftSliderInput("y"));
  tileShiftYRange.addEventListener("pointerdown", () => setActiveWheelMode("shift-y", { transient: true }));
  tileShiftYRange.addEventListener("focus", () => setActiveWheelMode("shift-y", { transient: false }));
  tileShiftYRange.closest(".control-group")?.addEventListener("pointerdown", () => setActiveWheelMode("shift-y", { transient: true }));

  checkerPixelSizeRange.addEventListener("input", () => {
    tileCache.clear();
    sourceTileCache.clear();
    requestDraw();
  });
  checkerPixelSizeRange.addEventListener("pointerdown", () => setActiveWheelMode("size", { transient: true }));
  checkerPixelSizeRange.addEventListener("focus", () => setActiveWheelMode("size", { transient: false }));
  checkerPixelSizeRange.closest(".control-group")?.addEventListener("pointerdown", () => setActiveWheelMode("size", { transient: true }));

  allPanelsOnButton?.addEventListener("click", () => {
    setAllPanelsPower(true);
    requestDraw();
  });

  allPanelsOffButton?.addEventListener("click", () => {
    setAllPanelsPower(false);
    requestDraw();
  });

  allSubGridOnButton?.addEventListener("click", () => {
    setAllSubGridPower(true);
    requestDraw();
  });

  allSubGridOffButton?.addEventListener("click", () => {
    setAllSubGridPower(false);
    requestDraw();
  });

  selectionReportButton?.addEventListener("click", () => {
    showSelectionReport();
  });

  copySelectionReportButton?.addEventListener("click", () => {
    copySelectionReportText();
  });

  closeSelectionReportButton?.addEventListener("click", () => {
    closeSelectionReport();
  });

  selectionReportModal?.addEventListener("click", (event) => {
    if (event.target === selectionReportModal) {
      closeSelectionReport();
    }
  });

  identifyPanelsButton?.addEventListener("click", () => {
    identifyPanelsEnabled = !identifyPanelsEnabled;
    updateIdentifyButtonsUI();
    requestDraw();
  });

  identifySubGridButton?.addEventListener("click", () => {
    identifySubGridEnabled = !identifySubGridEnabled;
    updateIdentifyButtonsUI();
    requestDraw();
  });

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const viewportX = event.clientX - rect.left;
    const viewportY = event.clientY - rect.top;

    const geom = getGeometry();
    const frame = getInteractionFrame(geom);

    if (showSubGridLinesInput?.checked) {
      const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();
      if (toggleSubGridPowerAtViewportPoint(viewportX, viewportY, geom, frame, sourceWidth, sourceHeight)) {
        requestDraw();
      }
      return;
    }

    const tile = getTileAtViewportPoint(viewportX, viewportY, geom, frame);
    if (!tile) {
      return;
    }

    togglePanelPower(tile.tileX, tile.tileY, geom);
    requestDraw();
  });

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = canvas.getBoundingClientRect();
    const viewportX = event.clientX - rect.left;
    const viewportY = event.clientY - rect.top;
    const geom = getGeometry();
    const frame = getInteractionFrame(geom);

    if (showSubGridLinesInput?.checked) {
      const { sourceWidth, sourceHeight } = getCurrentTileSourceDimensions();
      if (toggleSubGridSelectionAtViewportPoint(viewportX, viewportY, geom, frame, sourceWidth, sourceHeight)) {
        requestDraw();
      }
      return;
    }

    const tile = getTileAtViewportPoint(viewportX, viewportY, geom, frame);
    if (!tile) {
      return;
    }

    togglePanelSelection(tile.tileX, tile.tileY, geom);
    requestDraw();
  });

  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    lastCanvasPointerX = event.clientX - rect.left;
    lastCanvasPointerY = event.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", () => {
    lastCanvasPointerX = null;
    lastCanvasPointerY = null;
  });

  rotationRange.addEventListener("input", () => {
    if (shiftCoordinateMode === "screen") {
      syncScreenSliderValuesFromLocal();
    }
    requestDraw();
  });
  rotationRange.addEventListener("pointerdown", () => setActiveWheelMode("rotation", { transient: true }));
  rotationRange.addEventListener("focus", () => setActiveWheelMode("rotation", { transient: false }));
  rotationRange.closest(".control-group")?.addEventListener("pointerdown", () => setActiveWheelMode("rotation", { transient: true }));

  [
    customCssInput,
    physicalWidthInput,
    physicalHeightInput,
    showTileLinesInput,
    tileLineWidthInput,
    tileLineColorInput,
    showSubGridLinesInput,
  ].forEach((control) => {
    control?.addEventListener("input", requestDraw);
  });

  [
    modulesWideInput,
    modulesHighInput,
    tilesPerModuleXInput,
    tilesPerModuleYInput,
  ].forEach((control) => {
    control.addEventListener("input", () => {
      updateConfiguredPixelInputSteps();
      if (document.activeElement !== pixelsWideInput && document.activeElement !== pixelsHighInput) {
        enforceConfiguredPixelPanelAlignment();
      }
      updateSubGridPresetButtons();
      requestDraw();
    });
  });

  [pixelsWideInput, pixelsHighInput].forEach((control) => {
    // Allow free typing; only snap to valid values when editing is committed.
    control.addEventListener("input", () => {
      updateSubGridPresetButtons();
      requestDraw();
    });
    control.addEventListener("change", commitConfiguredPixelInputs);
    control.addEventListener("blur", commitConfiguredPixelInputs);
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        commitConfiguredPixelInputs();
        control.blur();
      }
    });
  });

  [cycleIncludeShiftX, cycleIncludeShiftY, cycleIncludeRotation, cycleIncludeSize].forEach((control) => {
    control?.addEventListener("change", () => handleCycleInclusionToggle(control));
  });

  window.addEventListener("resize", requestDraw);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectionReportModal && !selectionReportModal.hidden) {
      closeSelectionReport();
      event.preventDefault();
      return;
    }

    if (event.key === "Tab") {
      if (!isPointerOverPanel) {
        cycleWheelMode(event.shiftKey ? -1 : 1);
        event.preventDefault();
      }
      return;
    }

    if (isTypingTarget(event.target)) {
      return;
    }

    if (event.key.toLowerCase() === "p") {
      togglePanel();
      event.preventDefault();
    }

    if (event.key.toLowerCase() === "c") {
      toggleShiftCoordinateMode();
      event.preventDefault();
    }

    if (event.key.toLowerCase() === "i") {
      if (toggleInspectAtLastPointer()) {
        event.preventDefault();
      }
    }
  });

  setupPanelDragging();
  setupWheelControls();
}

function init() {
  loadPersistedImageSource();
  updateConfiguredPixelInputSteps();
  enforceConfiguredPixelPanelAlignment();
  setDefaultCheckerSizeForTwoChecks();
  renderPresetOptions();
  updatePresetColorControlsUI();
  updateImageSourceControlsUI();
  updateCheckerPixelSizeControl();
  updateWheelModeBadge();
  updateShiftModeToggleUI();
  updateShiftStepModeToggleUI();
  updateRenderFilterToggleUI();
  updateShiftSliderPresentation({ snapValues: true });
  updateSubGridPresetButtons();
  updateIdentifyButtonsUI();
  customSection.hidden = true;
  if (shiftCoordinateMode === "screen") {
    syncScreenSliderValuesFromLocal();
  }
  setupEvents();
  requestDraw();
}

init();

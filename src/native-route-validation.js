// Generated from pinned PlayStunts by scripts/build-native-validation.mjs; GPL-3.0-only.
var StuntsNativeRoute = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // stunts-hd-track-editor-github/scripts/native-validation-entry.ts
  var native_validation_entry_exports = {};
  __export(native_validation_entry_exports, {
    check: () => check
  });

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/terrain-validation.ts
  var edges = [
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 3, 0, 2, 3, 0, 0, 1, 1, 3, 2],
    [0, 0, 0, 0, 0, 0, 1, 2, 0, 3, 1, 0, 0, 3, 2, 2, 3, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 5, 0, 4, 5, 0, 0, 4, 1, 5, 4, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 5, 1, 4, 0, 5, 4, 0, 5, 1, 1, 4]
  ];
  function validateTerrain(terrain) {
    for (let axis = 0; axis < 2; axis++) for (let outer = 0; outer < 30; outer++) {
      let state = 99;
      for (let inner = 0; inner < 30; inner++) {
        const column = axis ? outer : inner, row = axis ? inner : outer, tile = terrain[row * 30 + column];
        if (!Number.isInteger(tile) || tile < 0 || tile > 18) throw Error("Terrain validation requires original terrain IDs0..18");
        if (state !== 99 && edges[axis * 2][tile] !== state) return { error: 11, location: [column, row] };
        state = edges[axis * 2 + 1][tile];
      }
    }
    return { error: 0, location: null };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/start-heading.ts
  function startHeading(tile) {
    switch (tile & 255) {
      case 1:
      case 134:
      case 147:
        return 0;
      case 135:
      case 148:
      case 179:
        return 512;
      case 136:
      case 149:
      case 180:
        return 256;
      case 137:
      case 150:
      case 181:
        return 768;
      default:
        return null;
    }
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/start-scan.ts
  function scanStart(raw, onErrorLocation) {
    const track = raw.slice(0, 900);
    let heading = -1, start = [0, 0, 0], found = false;
    for (let row = 0; row < 30; row++) for (let column = 0; column < 30; column++) {
      const index = (29 - row) * 30 + column;
      let tile = track[index];
      if (tile >= 253) tile = 0;
      if (tile >= 182) {
        tile = 4;
        track[index] = 4;
      }
      const next = startHeading(tile);
      if (next === null) continue;
      heading = next;
      if (found) {
        onErrorLocation?.([column, row]);
        return { error: 3, start, heading, track };
      }
      start = [column, raw[901 + row * 30 + column] === 6 ? 1 : 0, row];
      found = true;
    }
    if (!found) onErrorLocation?.([29, 29]);
    return { error: found ? 0 : 1, start, heading, track };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-entry.ts
  function routeEntry(tile, heading, column, row) {
    const direction = [0, 256, 512, 768].indexOf(heading);
    if (direction < 0) throw Error("Route traversal requires a cardinal heading");
    const codes = tile === 253 ? [12, 0, 0, 9] : tile === 254 ? [11, 6, 0, 7] : tile === 255 ? [10, 0, 5, 8] : [2, 4, 1, 3];
    return { column: column - (tile === 253 || tile === 255 ? 1 : 0) & 255, row: row - (tile === 253 || tile === 254 ? 1 : 0) & 255, entry: codes[direction] };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-exit.ts
  var exits = [[0, -1, 0], [0, 1, 512], [1, 0, 256], [-1, 0, 768], [1, -1, 0], [-1, 1, 768], [1, 1, 256], [2, 0, 256], [2, 1, 256], [1, 1, 512], [0, 2, 512], [1, 2, 512]];
  function routeExit(code, column, row, heading) {
    const exit = exits[(code & 255) - 1];
    return exit ? { column: column + exit[0] & 255, row: row + exit[1] & 255, heading: exit[2] } : { column, row, heading };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-record-selection.ts
  function selectRouteRecord(record, entry, state) {
    if (record[1] === entry) return record[3] === state ? { error: 0, direction: 0 } : { error: 4, direction: null };
    if (record[2] === entry) return record[4] === state ? { error: 0, direction: 1 } : { error: 4, direction: null };
    return { error: 0, direction: -1 };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-gap.ts
  function routeGap(state, skipped, run, heading, column, row, previousColumn, previousRow) {
    const result = { action: "backtrack", error: 0, column, row, skipped, run };
    if (state !== 1 || skipped >= 2) return result;
    if (run < 2) return { ...result, action: "error", error: 9 };
    const distance = skipped + 2;
    return { ...result, action: "advance", skipped: skipped + 1 & 255, run: run + 1 & 255, column: previousColumn + (heading === 256 ? distance : heading === 768 ? -distance : 0) & 255, row: previousRow + (heading === 512 ? distance : heading === 0 ? -distance : 0) & 255 };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/slope-road-map.ts
  var roads = {
    7: { 4: 182, 14: 186, 24: 190, 39: 194, 59: 194, 98: 194 },
    8: { 5: 183, 15: 187, 25: 191, 36: 195, 56: 195, 95: 195 },
    9: { 4: 184, 14: 188, 24: 192, 38: 196, 58: 196, 97: 196 },
    10: { 5: 185, 15: 189, 25: 193, 37: 197, 57: 197, 96: 197 }
  };
  function slopeRoadMap(terrain, tile) {
    return roads[terrain & 255]?.[tile & 255] ?? 0;
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-branch.ts
  function encodeRouteBranch(b) {
    return [b.column, b.row, b.tile, b.record, b.direction, b.run, b.previousColumn, b.previousRow, b.previousTile, b.previousRecord, b.previousDirection, b.state, b.previousNode, b.previousNode >> 8].map((v) => v & 255);
  }
  function pushRouteBranch(stack, branch) {
    if (stack.length === 64) return 8;
    stack.push(encodeRouteBranch(branch));
    return 0;
  }
  function popRouteBranch(stack) {
    const r = stack.pop();
    if (!r) return null;
    const [column, row, tile, record, direction, run, previousColumn, previousRow, previousTile, previousRecord, previousDirection, state] = r;
    const previousNode = (r[12] | r[13] << 8) << 16 >> 16;
    return { column, row, tile, record, direction, run, previousColumn, previousRow, previousTile, previousRecord, previousDirection, state, previousNode };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-history.ts
  function matchRouteHistory(nodes, current, existingLinks) {
    const links = existingLinks.slice();
    let direction = current.direction, closed = false;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.column !== current.column || n.row !== current.row || n.record !== current.record) continue;
      if (n.direction !== direction) return { error: 5, direction, closed, links };
      direction = -1;
      links[links[0] === -1 ? 0 : 1] = i;
      if (i === 0) closed = true;
    }
    return { error: 0, direction, closed, links };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-traversal.ts
  function traverseRoute(raw, descriptors, visit, onLocation, onBranchPush) {
    const scan = scanStart(raw, onLocation), track = scan.track;
    const nodes = [], tiles = [], primary = [], secondary = [];
    const result = (error) => {
      if (!scan.error) onLocation?.(error ? [column === 255 ? 0 : column === 30 ? 29 : column, row === 255 ? 0 : row === 30 ? 29 : row] : [scan.start[0], scan.start[2]]);
      return { error, count: nodes.length, columns: nodes.map((n) => n.column), routeRows: nodes.map((n) => n.row), directions: nodes.map((n) => n.record + (n.direction << 4)), tiles, primary, secondary };
    };
    if (scan.error) return result(scan.error);
    let column = scan.start[0], row = scan.start[2], heading = scan.heading, state = 0, skipped = 0, run = 0, previousNode = -1, previousColumn = 0, previousRow = 0, previousTile = 0, previousRecord = 0, previousDirection = 0, closed = false;
    const visited = /* @__PURE__ */ new Set(), stack = [];
    let restored = null;
    for (let guard = 0; guard < 1e4; guard++) {
      let chosen = null, tile = 0;
      if (restored) {
        ({ column, row, tile, state, run, previousNode, previousColumn, previousRow, previousTile, previousRecord, previousDirection } = restored);
        chosen = { record: restored.record, direction: restored.direction };
        restored = null;
        if (skipped > 1) return result(10);
      } else if (column >= 0 && column < 30 && row >= 0 && row < 30) {
        tile = track[(29 - row) * 30 + column];
        const terrain = raw[901 + row * 30 + column];
        if (tile && terrain >= 7 && terrain < 11) tile = slopeRoadMap(terrain, tile);
        const entry = routeEntry(tile, heading, column, row);
        column = entry.column;
        row = entry.row;
        if (tile >= 253) tile = track[(29 - row) * 30 + column];
        if (!skipped && !entry.entry) return result(2);
        for (const [record2, bytes] of (descriptors[tile]?.records ?? []).entries()) {
          const selected = selectRouteRecord(bytes, entry.entry, state);
          if (selected.error) return result(selected.error);
          let direction = selected.direction;
          if (direction >= 0 && visited.has(row * 30 + column)) {
            const match = matchRouteHistory(nodes, { column, row, record: record2, direction }, [primary[previousNode] ?? -1, secondary[previousNode] ?? -1]);
            if (previousNode >= 0) {
              primary[previousNode] = match.links[0];
              secondary[previousNode] = match.links[1];
            }
            closed ||= match.closed;
            if (match.error) return result(match.error);
            direction = match.direction;
          }
          if (direction < 0) continue;
          if (!chosen) chosen = { record: record2, direction };
          else {
            if (pushRouteBranch(stack, { column, row, tile, record: record2, direction, run, previousColumn, previousRow, previousTile, previousRecord, previousDirection, state, previousNode })) return result(8);
            onBranchPush?.(stack.length - 1, stack[stack.length - 1]);
          }
        }
        if (!chosen) {
          const gap = routeGap(state, skipped, run, heading, column, row, previousColumn, previousRow);
          if (gap.error) return result(gap.error);
          if (gap.action === "advance") {
            ({ column, row, skipped, run } = gap);
            continue;
          }
        }
      }
      if (!chosen) {
        restored = popRouteBranch(stack);
        if (!restored) return result(closed ? 0 : 7);
        continue;
      }
      skipped = 0;
      visited.add(row * 30 + column);
      if (previousNode >= 0) {
        if (primary[previousNode] === -1) primary[previousNode] = nodes.length;
        else secondary[previousNode] = nodes.length;
      }
      previousNode = nodes.length;
      nodes.push({ column, row, ...chosen });
      tiles.push(tile);
      primary.push(-1);
      secondary.push(-1);
      const record = descriptors[tile].records[chosen.record];
      visit?.({ record, direction: chosen.direction, run, previousColumn, previousRow, previousTile, previousRecord, previousDirection });
      run = record[12] === 0 ? run + 1 & 255 : 0;
      if (nodes.length === 901) return result(6);
      state = record[chosen.direction ? 3 : 4];
      previousColumn = column;
      previousRow = row;
      previousTile = tile;
      previousRecord = chosen.record;
      previousDirection = chosen.direction;
      ({ column, row, heading } = routeExit(record[chosen.direction ? 1 : 2], column, row, heading));
    }
    throw Error("Route traversal exceeded diagnostic iteration bound");
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-vector.ts
  function routeVector(vectors, direction, rotation) {
    const [x, y, z] = vectors[direction ? 1 : 0];
    const neg = (n) => -n << 16 >> 16;
    if (rotation === 256) return [z, y, neg(x)];
    if (rotation === 512) return [neg(x), y, neg(z)];
    if (rotation === 768) return [neg(z), y, x];
    return [x, y, z];
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-placement.ts
  function routePlacement(vector, column, row, terrain, multiTile) {
    const x = multiTile & 2 ? column === 29 ? 1 : (column + 1) * 1024 : column * 1024 + 512;
    const i16 = (n) => n << 16 >> 16;
    return { position: [i16(vector[0] + x), i16(vector[1] + (terrain === 6 ? 450 : 0)), i16(vector[2] + (29 - row) * 1024 + (multiTile & 1 ? 0 : 512))], cell: (29 - row) * 30 + column };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-metadata.ts
  function traverseRouteWithMetadata(raw, records, vectors, objects, onLocation, onBranchPush) {
    const headings = [], types = [], positions = [], cells = Array(900).fill(255);
    const route = traverseRoute(raw, records, (s) => {
      const tag = s.record[12];
      if (!tag || tag === 255 || s.run <= 3 || headings.length === 48) return;
      const previous = records[s.previousTile].records[s.previousRecord], rotation = previous[6] + 256 * previous[7];
      const vector = routeVector(vectors[s.previousTile].vectors[s.previousRecord], s.previousDirection, rotation);
      const placed = routePlacement(vector, s.previousColumn, s.previousRow, raw[901 + s.previousRow * 30 + s.previousColumn], objects[s.previousTile].multiTile);
      cells[placed.cell] = headings.length;
      positions.push(placed.position);
      headings.push(rotation ^ (s.previousDirection ? 512 : 0));
      types.push((s.direction ? [0, 1, 0, 0, 1, 0] : [0, 0, 1, 0, 1, 0])[tag]);
    }, onLocation, onBranchPush);
    return { route, metadata: { headings, types, positions, cells } };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-samples.ts
  function routeSamples(raw, route, records, vectors, objects) {
    const count = Math.min(Math.trunc(route.count / 3), 64), seen = /* @__PURE__ */ new Set();
    const positions = [], heights = [], flags = [];
    for (let i = 0; i < count; i++) {
      const index = Math.trunc((route.count * i << 16 >> 16) / count);
      if (index < 0) throw Error("Original route sampling overflow requires caller memory context");
      const column = route.columns[index], row = route.routeRows[index], cell = row * 30 + column;
      if (seen.has(cell)) continue;
      seen.add(cell);
      const tile = route.tiles[index], packed = route.directions[index], recordIndex = packed & 15, record = records[tile].records[recordIndex];
      const terrain = raw[901 + cell], rotation = record[6] + 256 * record[7];
      const vector = routeVector(vectors[tile].vectors[recordIndex], packed & 16, rotation);
      positions.push(routePlacement(vector, column, row, terrain, objects[tile].multiTile).position);
      heights.push(terrain === 6 ? 450 : 0);
      flags.push(0);
    }
    return { positions, heights, flags };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/lib/physics/route-analysis.ts
  function analyzeRoute(raw, records, metadataVectors, sampleVectors, objects, onBranchPush, options) {
    const terrain = validateTerrain(raw.slice(901, 1801));
    if (terrain.error) return { location: terrain.location, terrainError: terrain, route: null, metadata: null, samples: null };
    let location = null;
    const result = traverseRouteWithMetadata(raw, records, metadataVectors, objects, (value) => {
      location = value;
    }, onBranchPush);
    return { ...result, location, samples: result.route.error || options?.sample === false ? null : options?.samples ?? routeSamples(raw, result.route, records, sampleVectors, objects) };
  }

  // stunts-hd-track-editor-github/vendor/playstunts/public/game/route-records.json
  var route_records_default = [{ id: 0, sourceOffset: 0, records: [] }, { id: 1, sourceOffset: 6564, records: [[1, 2, 1, 0, 0, 2, 0, 0, 38, 12, 0, 0, 0, 0]] }, { id: 2, sourceOffset: 0, records: [] }, { id: 3, sourceOffset: 0, records: [] }, { id: 4, sourceOffset: 6620, records: [[1, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0]] }, { id: 5, sourceOffset: 6634, records: [[1, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0]] }, { id: 6, sourceOffset: 6704, records: [[1, 3, 2, 0, 0, 5, 0, 3, 88, 13, 0, 0, 1, 3]] }, { id: 7, sourceOffset: 6718, records: [[1, 2, 4, 0, 0, 5, 0, 0, 88, 13, 0, 0, 1, 3]] }, { id: 8, sourceOffset: 6732, records: [[1, 1, 3, 0, 0, 5, 0, 2, 88, 13, 0, 0, 1, 3]] }, { id: 9, sourceOffset: 6746, records: [[1, 4, 1, 0, 0, 5, 0, 1, 88, 13, 0, 0, 1, 3]] }, { id: 10, sourceOffset: 6760, records: [[1, 8, 11, 0, 0, 17, 0, 3, 220, 13, 0, 0, 1, 6]] }, { id: 11, sourceOffset: 6774, records: [[1, 12, 4, 0, 0, 17, 0, 0, 220, 13, 0, 0, 1, 6]] }, { id: 12, sourceOffset: 6788, records: [[1, 1, 9, 0, 0, 17, 0, 2, 220, 13, 0, 0, 1, 6]] }, { id: 13, sourceOffset: 6802, records: [[1, 6, 5, 0, 0, 17, 0, 1, 220, 13, 0, 0, 1, 6]] }, { id: 14, sourceOffset: 6620, records: [[1, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0]] }, { id: 15, sourceOffset: 6634, records: [[1, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0]] }, { id: 16, sourceOffset: 6704, records: [[1, 3, 2, 0, 0, 5, 0, 3, 88, 13, 0, 0, 1, 3]] }, { id: 17, sourceOffset: 6718, records: [[1, 2, 4, 0, 0, 5, 0, 0, 88, 13, 0, 0, 1, 3]] }, { id: 18, sourceOffset: 6732, records: [[1, 1, 3, 0, 0, 5, 0, 2, 88, 13, 0, 0, 1, 3]] }, { id: 19, sourceOffset: 6746, records: [[1, 4, 1, 0, 0, 5, 0, 1, 88, 13, 0, 0, 1, 3]] }, { id: 20, sourceOffset: 6760, records: [[1, 8, 11, 0, 0, 17, 0, 3, 220, 13, 0, 0, 1, 6]] }, { id: 21, sourceOffset: 6774, records: [[1, 12, 4, 0, 0, 17, 0, 0, 220, 13, 0, 0, 1, 6]] }, { id: 22, sourceOffset: 6788, records: [[1, 1, 9, 0, 0, 17, 0, 2, 220, 13, 0, 0, 1, 6]] }, { id: 23, sourceOffset: 6802, records: [[1, 6, 5, 0, 0, 17, 0, 1, 220, 13, 0, 0, 1, 6]] }, { id: 24, sourceOffset: 6620, records: [[1, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0]] }, { id: 25, sourceOffset: 6634, records: [[1, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0]] }, { id: 26, sourceOffset: 6704, records: [[1, 3, 2, 0, 0, 5, 0, 3, 88, 13, 0, 0, 1, 3]] }, { id: 27, sourceOffset: 6718, records: [[1, 2, 4, 0, 0, 5, 0, 0, 88, 13, 0, 0, 1, 3]] }, { id: 28, sourceOffset: 6732, records: [[1, 1, 3, 0, 0, 5, 0, 2, 88, 13, 0, 0, 1, 3]] }, { id: 29, sourceOffset: 6746, records: [[1, 4, 1, 0, 0, 5, 0, 1, 88, 13, 0, 0, 1, 3]] }, { id: 30, sourceOffset: 6760, records: [[1, 8, 11, 0, 0, 17, 0, 3, 220, 13, 0, 0, 1, 6]] }, { id: 31, sourceOffset: 6774, records: [[1, 12, 4, 0, 0, 17, 0, 0, 220, 13, 0, 0, 1, 6]] }, { id: 32, sourceOffset: 6788, records: [[1, 1, 9, 0, 0, 17, 0, 2, 220, 13, 0, 0, 1, 6]] }, { id: 33, sourceOffset: 6802, records: [[1, 6, 5, 0, 0, 17, 0, 1, 220, 13, 0, 0, 1, 6]] }, { id: 34, sourceOffset: 6816, records: [[1, 1, 2, 1, 1, 2, 0, 2, 128, 15, 0, 0, 0, 0]] }, { id: 35, sourceOffset: 6830, records: [[1, 3, 4, 1, 1, 2, 0, 3, 128, 15, 0, 0, 0, 0]] }, { id: 36, sourceOffset: 7054, records: [[1, 4, 3, 0, 1, 2, 0, 1, 74, 18, 0, 0, 0, 10]] }, { id: 37, sourceOffset: 7040, records: [[1, 3, 4, 0, 1, 2, 0, 3, 74, 18, 0, 0, 0, 10]] }, { id: 38, sourceOffset: 7026, records: [[1, 2, 1, 0, 1, 2, 0, 0, 74, 18, 0, 0, 0, 10]] }, { id: 39, sourceOffset: 7012, records: [[1, 1, 2, 0, 1, 2, 0, 2, 74, 18, 0, 0, 0, 10]] }, { id: 40, sourceOffset: 7152, records: [[1, 2, 1, 0, 3, 3, 0, 0, 168, 20, 0, 0, 0, 0]] }, { id: 41, sourceOffset: 7166, records: [[1, 4, 3, 0, 2, 3, 0, 1, 168, 20, 0, 0, 0, 0]] }, { id: 42, sourceOffset: 7124, records: [[1, 1, 2, 0, 2, 3, 0, 2, 168, 20, 0, 0, 0, 0]] }, { id: 43, sourceOffset: 7138, records: [[1, 3, 4, 0, 3, 3, 0, 3, 168, 20, 0, 0, 0, 0]] }, { id: 44, sourceOffset: 7208, records: [[1, 2, 1, 0, 2, 3, 0, 0, 114, 20, 0, 0, 0, 0]] }, { id: 45, sourceOffset: 7222, records: [[1, 4, 3, 0, 3, 3, 0, 1, 114, 20, 0, 0, 0, 0]] }, { id: 46, sourceOffset: 7180, records: [[1, 1, 2, 0, 3, 3, 0, 2, 114, 20, 0, 0, 0, 0]] }, { id: 47, sourceOffset: 7194, records: [[1, 3, 4, 0, 2, 3, 0, 3, 114, 20, 0, 0, 0, 0]] }, { id: 48, sourceOffset: 7264, records: [[1, 1, 2, 3, 3, 2, 0, 2, 72, 20, 0, 0, 0, 0]] }, { id: 49, sourceOffset: 7236, records: [[1, 2, 1, 2, 2, 2, 0, 0, 72, 20, 0, 0, 0, 0]] }, { id: 50, sourceOffset: 7278, records: [[1, 3, 4, 2, 2, 2, 0, 3, 72, 20, 0, 0, 0, 0]] }, { id: 51, sourceOffset: 7250, records: [[1, 4, 3, 3, 3, 2, 0, 1, 72, 20, 0, 0, 0, 0]] }, { id: 52, sourceOffset: 7292, records: [[1, 8, 11, 2, 3, 17, 0, 3, 222, 20, 0, 0, 255, 9]] }, { id: 53, sourceOffset: 7306, records: [[1, 12, 4, 2, 2, 17, 0, 0, 222, 20, 0, 0, 255, 9]] }, { id: 54, sourceOffset: 7320, records: [[1, 1, 9, 3, 3, 17, 0, 2, 222, 20, 0, 0, 255, 9]] }, { id: 55, sourceOffset: 7334, records: [[1, 6, 5, 3, 2, 17, 0, 1, 222, 20, 0, 0, 255, 9]] }, { id: 56, sourceOffset: 7054, records: [[1, 4, 3, 0, 1, 2, 0, 1, 74, 18, 0, 0, 0, 10]] }, { id: 57, sourceOffset: 7040, records: [[1, 3, 4, 0, 1, 2, 0, 3, 74, 18, 0, 0, 0, 10]] }, { id: 58, sourceOffset: 7026, records: [[1, 2, 1, 0, 1, 2, 0, 0, 74, 18, 0, 0, 0, 10]] }, { id: 59, sourceOffset: 7012, records: [[1, 1, 2, 0, 1, 2, 0, 2, 74, 18, 0, 0, 0, 10]] }, { id: 60, sourceOffset: 7488, records: [[1, 11, 5, 0, 0, 17, 0, 0, 120, 17, 0, 0, 255, 13]] }, { id: 61, sourceOffset: 7502, records: [[1, 6, 8, 0, 0, 17, 0, 1, 166, 16, 0, 0, 255, 13]] }, { id: 62, sourceOffset: 7516, records: [[1, 12, 1, 0, 0, 17, 0, 0, 166, 16, 0, 0, 255, 13]] }, { id: 63, sourceOffset: 7530, records: [[1, 4, 9, 0, 0, 17, 0, 1, 120, 17, 0, 0, 255, 13]] }, { id: 64, sourceOffset: 7348, records: [[1, 11, 1, 0, 0, 23, 0, 0, 116, 18, 0, 0, 0, 14]] }, { id: 65, sourceOffset: 7362, records: [[1, 4, 8, 0, 0, 23, 0, 1, 116, 18, 0, 0, 0, 14]] }, { id: 66, sourceOffset: 6648, records: [[1, 2, 1, 0, 0, 2, 0, 0, 80, 12, 0, 0, 255, 0]] }, { id: 67, sourceOffset: 6662, records: [[1, 3, 4, 0, 0, 2, 0, 3, 80, 12, 0, 0, 255, 0]] }, { id: 68, sourceOffset: 7376, records: [[1, 2, 1, 4, 4, 2, 0, 0, 152, 12, 0, 0, 0, 15]] }, { id: 69, sourceOffset: 7390, records: [[1, 3, 4, 4, 4, 2, 0, 3, 152, 12, 0, 0, 0, 15]] }, { id: 70, sourceOffset: 7446, records: [[1, 2, 1, 0, 4, 2, 0, 0, 110, 12, 0, 0, 0, 15]] }, { id: 71, sourceOffset: 7432, records: [[1, 1, 2, 0, 4, 2, 0, 2, 110, 12, 0, 0, 0, 15]] }, { id: 72, sourceOffset: 7460, records: [[1, 3, 4, 0, 4, 2, 0, 3, 110, 12, 0, 0, 0, 15]] }, { id: 73, sourceOffset: 7474, records: [[1, 4, 3, 0, 4, 2, 0, 1, 110, 12, 0, 0, 0, 15]] }, { id: 74, sourceOffset: 6676, records: [[2, 1, 2, 0, 0, 2, 0, 2, 194, 12, 0, 0, 0, 0], [0, 3, 4, 0, 0, 2, 0, 3, 194, 12, 0, 0, 0, 0]] }, { id: 75, sourceOffset: 7544, records: [[2, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0], [0, 2, 4, 0, 0, 5, 0, 0, 88, 13, 0, 0, 1, 3]] }, { id: 76, sourceOffset: 7572, records: [[2, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0], [0, 3, 2, 0, 0, 5, 0, 3, 88, 13, 0, 0, 1, 3]] }, { id: 77, sourceOffset: 7600, records: [[2, 1, 2, 0, 0, 2, 0, 2, 252, 11, 0, 0, 0, 0], [0, 1, 3, 0, 0, 5, 0, 2, 88, 13, 0, 0, 1, 3]] }, { id: 78, sourceOffset: 7628, records: [[2, 4, 3, 0, 0, 2, 0, 1, 252, 11, 0, 0, 0, 0], [0, 4, 1, 0, 0, 5, 0, 1, 88, 13, 0, 0, 1, 3]] }, { id: 79, sourceOffset: 7656, records: [[2, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0], [0, 2, 3, 0, 0, 5, 0, 0, 154, 13, 0, 0, 2, 3]] }, { id: 80, sourceOffset: 7684, records: [[2, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0], [0, 3, 1, 0, 0, 5, 0, 3, 154, 13, 0, 0, 2, 3]] }, { id: 81, sourceOffset: 7712, records: [[2, 1, 2, 0, 0, 2, 0, 2, 252, 11, 0, 0, 0, 0], [0, 1, 4, 0, 0, 5, 0, 2, 154, 13, 0, 0, 2, 3]] }, { id: 82, sourceOffset: 7740, records: [[2, 4, 3, 0, 0, 2, 0, 1, 252, 11, 0, 0, 0, 0], [0, 4, 2, 0, 0, 5, 0, 1, 154, 13, 0, 0, 2, 3]] }, { id: 83, sourceOffset: 7404, records: [[1, 2, 1, 4, 4, 3, 0, 0, 82, 25, 0, 0, 0, 15]] }, { id: 84, sourceOffset: 7418, records: [[1, 3, 4, 4, 4, 3, 0, 3, 82, 25, 0, 0, 0, 15]] }, { id: 85, sourceOffset: 6536, records: [[1, 11, 1, 0, 0, 13, 0, 0, 154, 19, 0, 0, 0, 15]] }, { id: 86, sourceOffset: 6550, records: [[1, 4, 8, 0, 0, 13, 0, 1, 154, 19, 0, 0, 0, 15]] }, { id: 87, sourceOffset: 7768, records: [[2, 12, 5, 0, 0, 3, 0, 0, 236, 12, 0, 0, 0, 0], [0, 12, 4, 0, 0, 17, 0, 0, 220, 13, 0, 0, 1, 6]] }, { id: 88, sourceOffset: 7796, records: [[2, 8, 4, 0, 0, 3, 0, 3, 236, 12, 0, 0, 0, 0], [0, 8, 11, 0, 0, 17, 0, 3, 220, 13, 0, 0, 1, 6]] }, { id: 89, sourceOffset: 7824, records: [[2, 1, 11, 0, 0, 3, 0, 2, 236, 12, 0, 0, 0, 0], [0, 1, 9, 0, 0, 17, 0, 2, 220, 13, 0, 0, 1, 6]] }, { id: 90, sourceOffset: 7852, records: [[2, 6, 9, 0, 0, 3, 0, 1, 236, 12, 0, 0, 0, 0], [0, 6, 5, 0, 0, 17, 0, 1, 220, 13, 0, 0, 1, 6]] }, { id: 91, sourceOffset: 7880, records: [[2, 11, 1, 0, 0, 3, 0, 0, 34, 13, 0, 0, 0, 0], [0, 11, 8, 0, 0, 17, 0, 0, 174, 14, 0, 0, 2, 6]] }, { id: 92, sourceOffset: 7908, records: [[2, 9, 6, 0, 0, 3, 0, 3, 34, 13, 0, 0, 0, 0], [0, 9, 1, 0, 0, 17, 0, 3, 174, 14, 0, 0, 2, 6]] }, { id: 93, sourceOffset: 7936, records: [[2, 5, 12, 0, 0, 3, 0, 2, 34, 13, 0, 0, 0, 0], [0, 5, 6, 0, 0, 17, 0, 2, 174, 14, 0, 0, 2, 6]] }, { id: 94, sourceOffset: 7964, records: [[2, 4, 8, 0, 0, 3, 0, 1, 34, 13, 0, 0, 0, 0], [0, 4, 12, 0, 0, 17, 0, 1, 174, 14, 0, 0, 2, 6]] }, { id: 95, sourceOffset: 7054, records: [[1, 4, 3, 0, 1, 2, 0, 1, 74, 18, 0, 0, 0, 10]] }, { id: 96, sourceOffset: 7040, records: [[1, 3, 4, 0, 1, 2, 0, 3, 74, 18, 0, 0, 0, 10]] }, { id: 97, sourceOffset: 7026, records: [[1, 2, 1, 0, 1, 2, 0, 0, 74, 18, 0, 0, 0, 10]] }, { id: 98, sourceOffset: 7012, records: [[1, 1, 2, 0, 1, 2, 0, 2, 74, 18, 0, 0, 0, 10]] }, { id: 99, sourceOffset: 6816, records: [[1, 1, 2, 1, 1, 2, 0, 2, 128, 15, 0, 0, 0, 0]] }, { id: 100, sourceOffset: 6830, records: [[1, 3, 4, 1, 1, 2, 0, 3, 128, 15, 0, 0, 0, 0]] }, { id: 101, sourceOffset: 6844, records: [[2, 1, 2, 1, 1, 2, 0, 2, 170, 15, 0, 0, 0, 0], [0, 3, 4, 0, 0, 2, 0, 3, 194, 12, 0, 0, 0, 0]] }, { id: 102, sourceOffset: 6872, records: [[2, 3, 4, 1, 1, 2, 0, 3, 170, 15, 0, 0, 0, 0], [0, 1, 2, 0, 0, 2, 0, 2, 194, 12, 0, 0, 0, 0]] }, { id: 103, sourceOffset: 6816, records: [[1, 1, 2, 1, 1, 2, 0, 2, 128, 15, 0, 0, 0, 0]] }, { id: 104, sourceOffset: 6830, records: [[1, 3, 4, 1, 1, 2, 0, 3, 128, 15, 0, 0, 0, 0]] }, { id: 105, sourceOffset: 6900, records: [[1, 8, 11, 1, 1, 17, 0, 3, 212, 15, 0, 0, 255, 6]] }, { id: 106, sourceOffset: 6914, records: [[1, 12, 4, 1, 1, 17, 0, 0, 212, 15, 0, 0, 255, 6]] }, { id: 107, sourceOffset: 6928, records: [[1, 1, 9, 1, 1, 17, 0, 2, 212, 15, 0, 0, 255, 6]] }, { id: 108, sourceOffset: 6942, records: [[1, 6, 5, 1, 1, 17, 0, 1, 212, 15, 0, 0, 255, 6]] }, { id: 109, sourceOffset: 7992, records: [[1, 2, 1, 5, 5, 2, 0, 0, 200, 24, 242, 24, 0, 0]] }, { id: 110, sourceOffset: 8006, records: [[1, 3, 4, 5, 5, 2, 0, 3, 200, 24, 242, 24, 0, 0]] }, { id: 111, sourceOffset: 8034, records: [[1, 2, 1, 0, 5, 3, 0, 0, 116, 24, 158, 24, 0, 13]] }, { id: 112, sourceOffset: 8062, records: [[1, 4, 3, 0, 5, 3, 0, 1, 116, 24, 158, 24, 0, 13]] }, { id: 113, sourceOffset: 8020, records: [[1, 1, 2, 0, 5, 3, 0, 2, 116, 24, 158, 24, 0, 13]] }, { id: 114, sourceOffset: 8048, records: [[1, 3, 4, 0, 5, 3, 0, 3, 116, 24, 158, 24, 0, 13]] }, { id: 115, sourceOffset: 8076, records: [[1, 2, 1, 0, 0, 3, 0, 0, 28, 25, 0, 0, 0, 11]] }, { id: 116, sourceOffset: 8090, records: [[1, 3, 4, 0, 0, 3, 0, 3, 28, 25, 0, 0, 0, 11]] }, { id: 117, sourceOffset: 8104, records: [[1, 11, 1, 0, 1, 29, 0, 0, 176, 21, 0, 0, 0, 12]] }, { id: 118, sourceOffset: 8118, records: [[1, 9, 6, 0, 1, 29, 0, 3, 176, 21, 0, 0, 0, 12]] }, { id: 119, sourceOffset: 8132, records: [[1, 5, 12, 0, 1, 29, 0, 2, 176, 21, 0, 0, 0, 12]] }, { id: 120, sourceOffset: 8146, records: [[1, 4, 8, 0, 1, 29, 0, 1, 176, 21, 0, 0, 0, 12]] }, { id: 121, sourceOffset: 8160, records: [[1, 12, 5, 0, 1, 29, 0, 0, 18, 23, 0, 0, 0, 12]] }, { id: 122, sourceOffset: 8174, records: [[1, 8, 4, 0, 1, 29, 0, 3, 18, 23, 0, 0, 0, 12]] }, { id: 123, sourceOffset: 8188, records: [[1, 1, 11, 0, 1, 29, 0, 2, 18, 23, 0, 0, 0, 12]] }, { id: 124, sourceOffset: 8202, records: [[1, 6, 9, 0, 1, 29, 0, 1, 18, 23, 0, 0, 0, 12]] }, { id: 125, sourceOffset: 6676, records: [[2, 1, 2, 0, 0, 2, 0, 2, 194, 12, 0, 0, 0, 0], [0, 3, 4, 0, 0, 2, 0, 3, 194, 12, 0, 0, 0, 0]] }, { id: 126, sourceOffset: 7544, records: [[2, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0], [0, 2, 4, 0, 0, 5, 0, 0, 88, 13, 0, 0, 1, 3]] }, { id: 127, sourceOffset: 7572, records: [[2, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0], [0, 3, 2, 0, 0, 5, 0, 3, 88, 13, 0, 0, 1, 3]] }, { id: 128, sourceOffset: 7600, records: [[2, 1, 2, 0, 0, 2, 0, 2, 252, 11, 0, 0, 0, 0], [0, 1, 3, 0, 0, 5, 0, 2, 88, 13, 0, 0, 1, 3]] }, { id: 129, sourceOffset: 7628, records: [[2, 4, 3, 0, 0, 2, 0, 1, 252, 11, 0, 0, 0, 0], [0, 4, 1, 0, 0, 5, 0, 1, 88, 13, 0, 0, 1, 3]] }, { id: 130, sourceOffset: 7656, records: [[2, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0], [0, 2, 3, 0, 0, 5, 0, 0, 154, 13, 0, 0, 2, 3]] }, { id: 131, sourceOffset: 7684, records: [[2, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0], [0, 3, 1, 0, 0, 5, 0, 3, 154, 13, 0, 0, 2, 3]] }, { id: 132, sourceOffset: 7712, records: [[2, 1, 2, 0, 0, 2, 0, 2, 252, 11, 0, 0, 0, 0], [0, 1, 4, 0, 0, 5, 0, 2, 154, 13, 0, 0, 2, 3]] }, { id: 133, sourceOffset: 7740, records: [[2, 4, 3, 0, 0, 2, 0, 1, 252, 11, 0, 0, 0, 0], [0, 4, 2, 0, 0, 5, 0, 1, 154, 13, 0, 0, 2, 3]] }, { id: 134, sourceOffset: 6564, records: [[1, 2, 1, 0, 0, 2, 0, 0, 38, 12, 0, 0, 0, 0]] }, { id: 135, sourceOffset: 6592, records: [[1, 1, 2, 0, 0, 2, 0, 2, 38, 12, 0, 0, 0, 0]] }, { id: 136, sourceOffset: 6578, records: [[1, 4, 3, 0, 0, 2, 0, 1, 38, 12, 0, 0, 0, 0]] }, { id: 137, sourceOffset: 6606, records: [[1, 3, 4, 0, 0, 2, 0, 3, 38, 12, 0, 0, 0, 0]] }, { id: 138, sourceOffset: 6676, records: [[2, 1, 2, 0, 0, 2, 0, 2, 194, 12, 0, 0, 0, 0], [0, 3, 4, 0, 0, 2, 0, 3, 194, 12, 0, 0, 0, 0]] }, { id: 139, sourceOffset: 7544, records: [[2, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0], [0, 2, 4, 0, 0, 5, 0, 0, 88, 13, 0, 0, 1, 3]] }, { id: 140, sourceOffset: 7572, records: [[2, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0], [0, 3, 2, 0, 0, 5, 0, 3, 88, 13, 0, 0, 1, 3]] }, { id: 141, sourceOffset: 7600, records: [[2, 1, 2, 0, 0, 2, 0, 2, 252, 11, 0, 0, 0, 0], [0, 1, 3, 0, 0, 5, 0, 2, 88, 13, 0, 0, 1, 3]] }, { id: 142, sourceOffset: 7628, records: [[2, 4, 3, 0, 0, 2, 0, 1, 252, 11, 0, 0, 0, 0], [0, 4, 1, 0, 0, 5, 0, 1, 88, 13, 0, 0, 1, 3]] }, { id: 143, sourceOffset: 7656, records: [[2, 2, 1, 0, 0, 2, 0, 0, 252, 11, 0, 0, 0, 0], [0, 2, 3, 0, 0, 5, 0, 0, 154, 13, 0, 0, 2, 3]] }, { id: 144, sourceOffset: 7684, records: [[2, 3, 4, 0, 0, 2, 0, 3, 252, 11, 0, 0, 0, 0], [0, 3, 1, 0, 0, 5, 0, 3, 154, 13, 0, 0, 2, 3]] }, { id: 145, sourceOffset: 7712, records: [[2, 1, 2, 0, 0, 2, 0, 2, 252, 11, 0, 0, 0, 0], [0, 1, 4, 0, 0, 5, 0, 2, 154, 13, 0, 0, 2, 3]] }, { id: 146, sourceOffset: 7740, records: [[2, 4, 3, 0, 0, 2, 0, 1, 252, 11, 0, 0, 0, 0], [0, 4, 2, 0, 0, 5, 0, 1, 154, 13, 0, 0, 2, 3]] }, { id: 147, sourceOffset: 6564, records: [[1, 2, 1, 0, 0, 2, 0, 0, 38, 12, 0, 0, 0, 0]] }, { id: 148, sourceOffset: 6592, records: [[1, 1, 2, 0, 0, 2, 0, 2, 38, 12, 0, 0, 0, 0]] }, { id: 149, sourceOffset: 6578, records: [[1, 4, 3, 0, 0, 2, 0, 1, 38, 12, 0, 0, 0, 0]] }, { id: 150, sourceOffset: 6606, records: [[1, 3, 4, 0, 0, 2, 0, 3, 38, 12, 0, 0, 0, 0]] }, { id: 151, sourceOffset: 0, records: [] }, { id: 152, sourceOffset: 0, records: [] }, { id: 153, sourceOffset: 0, records: [] }, { id: 154, sourceOffset: 0, records: [] }, { id: 155, sourceOffset: 0, records: [] }, { id: 156, sourceOffset: 0, records: [] }, { id: 157, sourceOffset: 0, records: [] }, { id: 158, sourceOffset: 0, records: [] }, { id: 159, sourceOffset: 0, records: [] }, { id: 160, sourceOffset: 0, records: [] }, { id: 161, sourceOffset: 0, records: [] }, { id: 162, sourceOffset: 0, records: [] }, { id: 163, sourceOffset: 0, records: [] }, { id: 164, sourceOffset: 0, records: [] }, { id: 165, sourceOffset: 0, records: [] }, { id: 166, sourceOffset: 0, records: [] }, { id: 167, sourceOffset: 0, records: [] }, { id: 168, sourceOffset: 0, records: [] }, { id: 169, sourceOffset: 0, records: [] }, { id: 170, sourceOffset: 0, records: [] }, { id: 171, sourceOffset: 0, records: [] }, { id: 172, sourceOffset: 0, records: [] }, { id: 173, sourceOffset: 0, records: [] }, { id: 174, sourceOffset: 0, records: [] }, { id: 175, sourceOffset: 0, records: [] }, { id: 176, sourceOffset: 0, records: [] }, { id: 177, sourceOffset: 0, records: [] }, { id: 178, sourceOffset: 0, records: [] }, { id: 179, sourceOffset: 6592, records: [[1, 1, 2, 0, 0, 2, 0, 2, 38, 12, 0, 0, 0, 0]] }, { id: 180, sourceOffset: 6578, records: [[1, 4, 3, 0, 0, 2, 0, 1, 38, 12, 0, 0, 0, 0]] }, { id: 181, sourceOffset: 6606, records: [[1, 3, 4, 0, 0, 2, 0, 3, 38, 12, 0, 0, 0, 0]] }, { id: 182, sourceOffset: 6984, records: [[1, 2, 1, 0, 0, 2, 0, 0, 74, 18, 0, 0, 0, 0]] }, { id: 183, sourceOffset: 6970, records: [[1, 3, 4, 0, 0, 2, 0, 3, 74, 18, 0, 0, 0, 0]] }, { id: 184, sourceOffset: 6956, records: [[1, 1, 2, 0, 0, 2, 0, 2, 74, 18, 0, 0, 0, 0]] }, { id: 185, sourceOffset: 6998, records: [[1, 4, 3, 0, 0, 2, 0, 1, 74, 18, 0, 0, 0, 0]] }, { id: 186, sourceOffset: 6984, records: [[1, 2, 1, 0, 0, 2, 0, 0, 74, 18, 0, 0, 0, 0]] }, { id: 187, sourceOffset: 6970, records: [[1, 3, 4, 0, 0, 2, 0, 3, 74, 18, 0, 0, 0, 0]] }, { id: 188, sourceOffset: 6956, records: [[1, 1, 2, 0, 0, 2, 0, 2, 74, 18, 0, 0, 0, 0]] }, { id: 189, sourceOffset: 6998, records: [[1, 4, 3, 0, 0, 2, 0, 1, 74, 18, 0, 0, 0, 0]] }, { id: 190, sourceOffset: 6984, records: [[1, 2, 1, 0, 0, 2, 0, 0, 74, 18, 0, 0, 0, 0]] }, { id: 191, sourceOffset: 6970, records: [[1, 3, 4, 0, 0, 2, 0, 3, 74, 18, 0, 0, 0, 0]] }, { id: 192, sourceOffset: 6956, records: [[1, 1, 2, 0, 0, 2, 0, 2, 74, 18, 0, 0, 0, 0]] }, { id: 193, sourceOffset: 6998, records: [[1, 4, 3, 0, 0, 2, 0, 1, 74, 18, 0, 0, 0, 0]] }, { id: 194, sourceOffset: 7068, records: [[1, 1, 2, 0, 1, 2, 0, 2, 128, 15, 0, 0, 0, 10]] }, { id: 195, sourceOffset: 7110, records: [[1, 4, 3, 0, 1, 2, 0, 1, 128, 15, 0, 0, 0, 10]] }, { id: 196, sourceOffset: 7082, records: [[1, 2, 1, 0, 1, 2, 0, 0, 128, 15, 0, 0, 0, 10]] }, { id: 197, sourceOffset: 7096, records: [[1, 3, 4, 0, 1, 2, 0, 3, 128, 15, 0, 0, 0, 10]] }];

  // stunts-hd-track-editor-github/vendor/playstunts/public/game/route-vectors.json
  var route_vectors_default = [{ id: 0, vectors: [] }, { id: 1, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 2, vectors: [] }, { id: 3, vectors: [] }, { id: 4, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 5, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 6, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 7, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 8, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 9, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 10, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 11, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 12, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 13, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 14, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 15, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 16, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 17, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 18, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 19, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 20, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 21, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 22, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 23, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 24, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 25, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 26, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 27, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 28, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 29, vectors: [[[-99, -1, -351], [133, -1, -412]]] }, { id: 30, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 31, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 32, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 33, vectors: [[[-626, -1, -882], [-387, -1, -902]]] }, { id: 34, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 35, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 36, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 37, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 38, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 39, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 40, vectors: [[[140, 0, -334], [-120, 123, 334]]] }, { id: 41, vectors: [[[140, 0, -334], [-120, 123, 334]]] }, { id: 42, vectors: [[[140, 0, -334], [-120, 123, 334]]] }, { id: 43, vectors: [[[140, 0, -334], [-120, 123, 334]]] }, { id: 44, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 45, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 46, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 47, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 48, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 49, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 50, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 51, vectors: [[[120, 130, -334], [-140, 0, 334]]] }, { id: 52, vectors: [[[-632, 0, -846], [-392, 0, -846]]] }, { id: 53, vectors: [[[-632, 0, -846], [-392, 0, -846]]] }, { id: 54, vectors: [[[-632, 0, -846], [-392, 0, -846]]] }, { id: 55, vectors: [[[-632, 0, -846], [-392, 0, -846]]] }, { id: 56, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 57, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 58, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 59, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 60, vectors: [[[-120, -1, -334], [120, -1, -334]]] }, { id: 61, vectors: [[[-600, -1, -898], [-367, -1, -915]]] }, { id: 62, vectors: [[[-600, -1, -898], [-367, -1, -915]]] }, { id: 63, vectors: [[[-120, -1, -334], [120, -1, -334]]] }, { id: 64, vectors: [[[200, 0, -668], [-200, 0, 668]]] }, { id: 65, vectors: [[[200, 0, -668], [-200, 0, 668]]] }, { id: 66, vectors: [[[-84, -1, -334], [84, -1, -334]]] }, { id: 67, vectors: [[[-84, -1, -334], [84, -1, -334]]] }, { id: 68, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 69, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 70, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 71, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 72, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 73, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 74, vectors: [[[200, 0, -334], [-200, 0, 334]], [[200, 0, -334], [-200, 0, 334]]] }, { id: 75, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 76, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 77, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 78, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 79, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 80, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 81, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 82, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 83, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 84, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 85, vectors: [[[200, 0, -668], [-200, 0, 668]]] }, { id: 86, vectors: [[[200, 0, -668], [-200, 0, 668]]] }, { id: 87, vectors: [[[712, 0, -668], [-312, 0, 668]], [[-626, -1, -882], [-387, -1, -902]]] }, { id: 88, vectors: [[[712, 0, -668], [-312, 0, 668]], [[-626, -1, -882], [-387, -1, -902]]] }, { id: 89, vectors: [[[712, 0, -668], [-312, 0, 668]], [[-626, -1, -882], [-387, -1, -902]]] }, { id: 90, vectors: [[[712, 0, -668], [-312, 0, 668]], [[-626, -1, -882], [-387, -1, -902]]] }, { id: 91, vectors: [[[-312, 0, -668], [-712, 0, 668]], [[-120, -1, -334], [120, -1, -334]]] }, { id: 92, vectors: [[[-312, 0, -668], [-712, 0, 668]], [[-120, -1, -334], [120, -1, -334]]] }, { id: 93, vectors: [[[-312, 0, -668], [-712, 0, 668]], [[-120, -1, -334], [120, -1, -334]]] }, { id: 94, vectors: [[[-312, 0, -668], [-712, 0, 668]], [[-120, -1, -334], [120, -1, -334]]] }, { id: 95, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 96, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 97, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 98, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 99, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 100, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 101, vectors: [[[140, 450, -334], [-140, 450, 334]], [[200, 0, -334], [-200, 0, 334]]] }, { id: 102, vectors: [[[140, 450, -334], [-140, 450, 334]], [[200, 0, -334], [-200, 0, 334]]] }, { id: 103, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 104, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 105, vectors: [[[367, -1, -915], [600, -1, -898]]] }, { id: 106, vectors: [[[367, -1, -915], [600, -1, -898]]] }, { id: 107, vectors: [[[367, -1, -915], [600, -1, -898]]] }, { id: 108, vectors: [[[367, -1, -915], [600, -1, -898]]] }, { id: 109, vectors: [[[400, 0, -334], [-400, 0, -334]]] }, { id: 110, vectors: [[[400, 0, -334], [-400, 0, -334]]] }, { id: 111, vectors: [[[72, -1, -334], [360, -1, -334]]] }, { id: 112, vectors: [[[72, -1, -334], [360, -1, -334]]] }, { id: 113, vectors: [[[72, -1, -334], [360, -1, -334]]] }, { id: 114, vectors: [[[72, -1, -334], [360, -1, -334]]] }, { id: 115, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 116, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 117, vectors: [[[392, 0, -846], [632, 0, -846]]] }, { id: 118, vectors: [[[392, 0, -846], [632, 0, -846]]] }, { id: 119, vectors: [[[392, 0, -846], [632, 0, -846]]] }, { id: 120, vectors: [[[392, 0, -846], [632, 0, -846]]] }, { id: 121, vectors: [[[-72, -1, -334], [168, -1, -334]]] }, { id: 122, vectors: [[[-72, -1, -334], [168, -1, -334]]] }, { id: 123, vectors: [[[-72, -1, -334], [168, -1, -334]]] }, { id: 124, vectors: [[[-72, -1, -334], [168, -1, -334]]] }, { id: 125, vectors: [[[200, 0, -334], [-200, 0, 334]], [[200, 0, -334], [-200, 0, 334]]] }, { id: 126, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 127, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 128, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 129, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 130, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 131, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 132, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 133, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 134, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 135, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 136, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 137, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 138, vectors: [[[200, 0, -334], [-200, 0, 334]], [[200, 0, -334], [-200, 0, 334]]] }, { id: 139, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 140, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 141, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 142, vectors: [[[200, 0, -334], [-200, 0, 334]], [[-99, -1, -351], [133, -1, -412]]] }, { id: 143, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 144, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 145, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 146, vectors: [[[200, 0, -334], [-200, 0, 334]], [[387, -1, -902], [626, -1, -882]]] }, { id: 147, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 148, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 149, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 150, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 151, vectors: [] }, { id: 152, vectors: [] }, { id: 153, vectors: [] }, { id: 154, vectors: [] }, { id: 155, vectors: [] }, { id: 156, vectors: [] }, { id: 157, vectors: [] }, { id: 158, vectors: [] }, { id: 159, vectors: [] }, { id: 160, vectors: [] }, { id: 161, vectors: [] }, { id: 162, vectors: [] }, { id: 163, vectors: [] }, { id: 164, vectors: [] }, { id: 165, vectors: [] }, { id: 166, vectors: [] }, { id: 167, vectors: [] }, { id: 168, vectors: [] }, { id: 169, vectors: [] }, { id: 170, vectors: [] }, { id: 171, vectors: [] }, { id: 172, vectors: [] }, { id: 173, vectors: [] }, { id: 174, vectors: [] }, { id: 175, vectors: [] }, { id: 176, vectors: [] }, { id: 177, vectors: [] }, { id: 178, vectors: [] }, { id: 179, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 180, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 181, vectors: [[[200, 0, -334], [-200, 0, 334]]] }, { id: 182, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 183, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 184, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 185, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 186, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 187, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 188, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 189, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 190, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 191, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 192, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 193, vectors: [[[140, 81, -334], [-140, 375, 334]]] }, { id: 194, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 195, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 196, vectors: [[[140, 450, -334], [-140, 450, 334]]] }, { id: 197, vectors: [[[140, 450, -334], [-140, 450, 334]]] }];

  // stunts-hd-track-editor-github/vendor/playstunts/public/game/track-objects.json
  var track_objects_default = [{ id: 0, rotation: 0, surface: 1, multiTile: 0, physics: 64 }, { id: 1, rotation: 0, surface: 1, multiTile: 0, physics: 0 }, { id: 2, rotation: 0, surface: 1, multiTile: 0, physics: 64 }, { id: 3, rotation: 0, surface: 1, multiTile: 0, physics: 64 }, { id: 4, rotation: 0, surface: 1, multiTile: 0, physics: 1 }, { id: 5, rotation: 256, surface: 1, multiTile: 0, physics: 1 }, { id: 6, rotation: 768, surface: 1, multiTile: 0, physics: 2 }, { id: 7, rotation: 0, surface: 1, multiTile: 0, physics: 2 }, { id: 8, rotation: 512, surface: 1, multiTile: 0, physics: 2 }, { id: 9, rotation: 256, surface: 1, multiTile: 0, physics: 2 }, { id: 10, rotation: 768, surface: 1, multiTile: 3, physics: 3 }, { id: 11, rotation: 0, surface: 1, multiTile: 3, physics: 3 }, { id: 12, rotation: 512, surface: 1, multiTile: 3, physics: 3 }, { id: 13, rotation: 256, surface: 1, multiTile: 3, physics: 3 }, { id: 14, rotation: 0, surface: 2, multiTile: 0, physics: 1 }, { id: 15, rotation: 256, surface: 2, multiTile: 0, physics: 1 }, { id: 16, rotation: 768, surface: 2, multiTile: 0, physics: 2 }, { id: 17, rotation: 0, surface: 2, multiTile: 0, physics: 2 }, { id: 18, rotation: 512, surface: 2, multiTile: 0, physics: 2 }, { id: 19, rotation: 256, surface: 2, multiTile: 0, physics: 2 }, { id: 20, rotation: 768, surface: 2, multiTile: 3, physics: 3 }, { id: 21, rotation: 0, surface: 2, multiTile: 3, physics: 3 }, { id: 22, rotation: 512, surface: 2, multiTile: 3, physics: 3 }, { id: 23, rotation: 256, surface: 2, multiTile: 3, physics: 3 }, { id: 24, rotation: 0, surface: 3, multiTile: 0, physics: 1 }, { id: 25, rotation: 256, surface: 3, multiTile: 0, physics: 1 }, { id: 26, rotation: 768, surface: 3, multiTile: 0, physics: 2 }, { id: 27, rotation: 0, surface: 3, multiTile: 0, physics: 2 }, { id: 28, rotation: 512, surface: 3, multiTile: 0, physics: 2 }, { id: 29, rotation: 256, surface: 3, multiTile: 0, physics: 2 }, { id: 30, rotation: 768, surface: 3, multiTile: 3, physics: 3 }, { id: 31, rotation: 0, surface: 3, multiTile: 3, physics: 3 }, { id: 32, rotation: 512, surface: 3, multiTile: 3, physics: 3 }, { id: 33, rotation: 256, surface: 3, multiTile: 3, physics: 3 }, { id: 34, rotation: 0, surface: 1, multiTile: 0, physics: 18 }, { id: 35, rotation: 768, surface: 1, multiTile: 0, physics: 18 }, { id: 36, rotation: 256, surface: 1, multiTile: 0, physics: 16 }, { id: 37, rotation: 768, surface: 1, multiTile: 0, physics: 16 }, { id: 38, rotation: 0, surface: 1, multiTile: 0, physics: 16 }, { id: 39, rotation: 512, surface: 1, multiTile: 0, physics: 16 }, { id: 40, rotation: 0, surface: 1, multiTile: 0, physics: 24 }, { id: 41, rotation: 256, surface: 1, multiTile: 0, physics: 24 }, { id: 42, rotation: 512, surface: 1, multiTile: 0, physics: 24 }, { id: 43, rotation: 768, surface: 1, multiTile: 0, physics: 24 }, { id: 44, rotation: 0, surface: 1, multiTile: 0, physics: 23 }, { id: 45, rotation: 256, surface: 1, multiTile: 0, physics: 23 }, { id: 46, rotation: 512, surface: 1, multiTile: 0, physics: 23 }, { id: 47, rotation: 768, surface: 1, multiTile: 0, physics: 23 }, { id: 48, rotation: 512, surface: 1, multiTile: 0, physics: 25 }, { id: 49, rotation: 0, surface: 1, multiTile: 0, physics: 25 }, { id: 50, rotation: 768, surface: 1, multiTile: 0, physics: 25 }, { id: 51, rotation: 256, surface: 1, multiTile: 0, physics: 25 }, { id: 52, rotation: 768, surface: 1, multiTile: 3, physics: 26 }, { id: 53, rotation: 0, surface: 1, multiTile: 3, physics: 26 }, { id: 54, rotation: 512, surface: 1, multiTile: 3, physics: 26 }, { id: 55, rotation: 256, surface: 1, multiTile: 3, physics: 26 }, { id: 56, rotation: 256, surface: 1, multiTile: 0, physics: 16 }, { id: 57, rotation: 768, surface: 1, multiTile: 0, physics: 16 }, { id: 58, rotation: 0, surface: 1, multiTile: 0, physics: 16 }, { id: 59, rotation: 512, surface: 1, multiTile: 0, physics: 16 }, { id: 60, rotation: 0, surface: 1, multiTile: 3, physics: 5 }, { id: 61, rotation: 256, surface: 1, multiTile: 3, physics: 4 }, { id: 62, rotation: 0, surface: 1, multiTile: 3, physics: 4 }, { id: 63, rotation: 256, surface: 1, multiTile: 3, physics: 5 }, { id: 64, rotation: 0, surface: 1, multiTile: 1, physics: 27 }, { id: 65, rotation: 256, surface: 1, multiTile: 2, physics: 27 }, { id: 66, rotation: 0, surface: 1, multiTile: 0, physics: 28 }, { id: 67, rotation: 768, surface: 1, multiTile: 0, physics: 28 }, { id: 68, rotation: 0, surface: 1, multiTile: 0, physics: 30 }, { id: 69, rotation: 256, surface: 1, multiTile: 0, physics: 30 }, { id: 70, rotation: 0, surface: 1, multiTile: 0, physics: 29 }, { id: 71, rotation: 512, surface: 1, multiTile: 0, physics: 29 }, { id: 72, rotation: 768, surface: 1, multiTile: 0, physics: 29 }, { id: 73, rotation: 256, surface: 1, multiTile: 0, physics: 29 }, { id: 74, rotation: 0, surface: 1, multiTile: 0, physics: 12 }, { id: 75, rotation: 0, surface: 1, multiTile: 0, physics: 6 }, { id: 76, rotation: 768, surface: 1, multiTile: 0, physics: 6 }, { id: 77, rotation: 512, surface: 1, multiTile: 0, physics: 6 }, { id: 78, rotation: 256, surface: 1, multiTile: 0, physics: 6 }, { id: 79, rotation: 0, surface: 1, multiTile: 0, physics: 7 }, { id: 80, rotation: 768, surface: 1, multiTile: 0, physics: 7 }, { id: 81, rotation: 512, surface: 1, multiTile: 0, physics: 7 }, { id: 82, rotation: 256, surface: 1, multiTile: 0, physics: 7 }, { id: 83, rotation: 0, surface: 1, multiTile: 0, physics: 31 }, { id: 84, rotation: 256, surface: 1, multiTile: 0, physics: 31 }, { id: 85, rotation: 0, surface: 1, multiTile: 1, physics: 35 }, { id: 86, rotation: 256, surface: 1, multiTile: 2, physics: 35 }, { id: 87, rotation: 0, surface: 1, multiTile: 3, physics: 8 }, { id: 88, rotation: 768, surface: 1, multiTile: 3, physics: 8 }, { id: 89, rotation: 512, surface: 1, multiTile: 3, physics: 8 }, { id: 90, rotation: 256, surface: 1, multiTile: 3, physics: 8 }, { id: 91, rotation: 0, surface: 1, multiTile: 3, physics: 9 }, { id: 92, rotation: 768, surface: 1, multiTile: 3, physics: 9 }, { id: 93, rotation: 512, surface: 1, multiTile: 3, physics: 9 }, { id: 94, rotation: 256, surface: 1, multiTile: 3, physics: 9 }, { id: 95, rotation: 256, surface: 1, multiTile: 0, physics: 17 }, { id: 96, rotation: 768, surface: 1, multiTile: 0, physics: 17 }, { id: 97, rotation: 0, surface: 1, multiTile: 0, physics: 17 }, { id: 98, rotation: 512, surface: 1, multiTile: 0, physics: 17 }, { id: 99, rotation: 0, surface: 1, multiTile: 0, physics: 20 }, { id: 100, rotation: 768, surface: 1, multiTile: 0, physics: 20 }, { id: 101, rotation: 0, surface: 1, multiTile: 0, physics: 22 }, { id: 102, rotation: 768, surface: 1, multiTile: 0, physics: 22 }, { id: 103, rotation: 0, surface: 1, multiTile: 0, physics: 19 }, { id: 104, rotation: 768, surface: 1, multiTile: 0, physics: 19 }, { id: 105, rotation: 768, surface: 1, multiTile: 3, physics: 21 }, { id: 106, rotation: 0, surface: 1, multiTile: 3, physics: 21 }, { id: 107, rotation: 512, surface: 1, multiTile: 3, physics: 21 }, { id: 108, rotation: 256, surface: 1, multiTile: 3, physics: 21 }, { id: 109, rotation: 0, surface: 1, multiTile: 0, physics: 11 }, { id: 110, rotation: 768, surface: 1, multiTile: 0, physics: 11 }, { id: 111, rotation: 0, surface: 256, multiTile: 0, physics: 10 }, { id: 112, rotation: 256, surface: 256, multiTile: 0, physics: 10 }, { id: 113, rotation: 512, surface: 256, multiTile: 0, physics: 10 }, { id: 114, rotation: 768, surface: 256, multiTile: 0, physics: 10 }, { id: 115, rotation: 0, surface: 1, multiTile: 0, physics: 34 }, { id: 116, rotation: 768, surface: 1, multiTile: 0, physics: 34 }, { id: 117, rotation: 0, surface: 1, multiTile: 3, physics: 32 }, { id: 118, rotation: 768, surface: 1, multiTile: 3, physics: 32 }, { id: 119, rotation: 512, surface: 1, multiTile: 3, physics: 32 }, { id: 120, rotation: 256, surface: 1, multiTile: 3, physics: 32 }, { id: 121, rotation: 0, surface: 1, multiTile: 3, physics: 33 }, { id: 122, rotation: 768, surface: 1, multiTile: 3, physics: 33 }, { id: 123, rotation: 512, surface: 1, multiTile: 3, physics: 33 }, { id: 124, rotation: 256, surface: 1, multiTile: 3, physics: 33 }, { id: 125, rotation: 0, surface: 2, multiTile: 0, physics: 12 }, { id: 126, rotation: 0, surface: 2, multiTile: 0, physics: 6 }, { id: 127, rotation: 768, surface: 2, multiTile: 0, physics: 6 }, { id: 128, rotation: 512, surface: 2, multiTile: 0, physics: 6 }, { id: 129, rotation: 256, surface: 2, multiTile: 0, physics: 6 }, { id: 130, rotation: 0, surface: 2, multiTile: 0, physics: 7 }, { id: 131, rotation: 768, surface: 2, multiTile: 0, physics: 7 }, { id: 132, rotation: 512, surface: 2, multiTile: 0, physics: 7 }, { id: 133, rotation: 256, surface: 2, multiTile: 0, physics: 7 }, { id: 134, rotation: 0, surface: 2, multiTile: 0, physics: 0 }, { id: 135, rotation: 512, surface: 2, multiTile: 0, physics: 0 }, { id: 136, rotation: 256, surface: 2, multiTile: 0, physics: 0 }, { id: 137, rotation: 768, surface: 2, multiTile: 0, physics: 0 }, { id: 138, rotation: 0, surface: 3, multiTile: 0, physics: 12 }, { id: 139, rotation: 0, surface: 3, multiTile: 0, physics: 6 }, { id: 140, rotation: 768, surface: 3, multiTile: 0, physics: 6 }, { id: 141, rotation: 512, surface: 3, multiTile: 0, physics: 6 }, { id: 142, rotation: 256, surface: 3, multiTile: 0, physics: 6 }, { id: 143, rotation: 0, surface: 3, multiTile: 0, physics: 7 }, { id: 144, rotation: 768, surface: 3, multiTile: 0, physics: 7 }, { id: 145, rotation: 512, surface: 3, multiTile: 0, physics: 7 }, { id: 146, rotation: 256, surface: 3, multiTile: 0, physics: 7 }, { id: 147, rotation: 0, surface: 3, multiTile: 0, physics: 0 }, { id: 148, rotation: 512, surface: 3, multiTile: 0, physics: 0 }, { id: 149, rotation: 256, surface: 3, multiTile: 0, physics: 0 }, { id: 150, rotation: 768, surface: 3, multiTile: 0, physics: 0 }, { id: 151, rotation: 0, surface: 1, multiTile: 0, physics: 74 }, { id: 152, rotation: 0, surface: 1, multiTile: 0, physics: 72 }, { id: 153, rotation: 0, surface: 1, multiTile: 0, physics: 71 }, { id: 154, rotation: 0, surface: 1, multiTile: 0, physics: 73 }, { id: 155, rotation: 0, surface: 1, multiTile: 0, physics: 66 }, { id: 156, rotation: 512, surface: 1, multiTile: 0, physics: 66 }, { id: 157, rotation: 768, surface: 1, multiTile: 0, physics: 66 }, { id: 158, rotation: 256, surface: 1, multiTile: 0, physics: 66 }, { id: 159, rotation: 0, surface: 1, multiTile: 0, physics: 65 }, { id: 160, rotation: 512, surface: 1, multiTile: 0, physics: 65 }, { id: 161, rotation: 768, surface: 1, multiTile: 0, physics: 65 }, { id: 162, rotation: 256, surface: 1, multiTile: 0, physics: 65 }, { id: 163, rotation: 0, surface: 1, multiTile: 0, physics: 68 }, { id: 164, rotation: 512, surface: 1, multiTile: 0, physics: 68 }, { id: 165, rotation: 768, surface: 1, multiTile: 0, physics: 68 }, { id: 166, rotation: 256, surface: 1, multiTile: 0, physics: 68 }, { id: 167, rotation: 0, surface: 256, multiTile: 0, physics: 69 }, { id: 168, rotation: 512, surface: 256, multiTile: 0, physics: 69 }, { id: 169, rotation: 768, surface: 256, multiTile: 0, physics: 69 }, { id: 170, rotation: 256, surface: 256, multiTile: 0, physics: 69 }, { id: 171, rotation: 0, surface: 1, multiTile: 0, physics: 70 }, { id: 172, rotation: 512, surface: 1, multiTile: 0, physics: 70 }, { id: 173, rotation: 768, surface: 1, multiTile: 0, physics: 70 }, { id: 174, rotation: 256, surface: 1, multiTile: 0, physics: 70 }, { id: 175, rotation: 0, surface: 256, multiTile: 0, physics: 67 }, { id: 176, rotation: 512, surface: 256, multiTile: 0, physics: 67 }, { id: 177, rotation: 768, surface: 256, multiTile: 0, physics: 67 }, { id: 178, rotation: 256, surface: 256, multiTile: 0, physics: 67 }, { id: 179, rotation: 512, surface: 1, multiTile: 0, physics: 0 }, { id: 180, rotation: 256, surface: 1, multiTile: 0, physics: 0 }, { id: 181, rotation: 768, surface: 1, multiTile: 0, physics: 0 }, { id: 182, rotation: 0, surface: 1, multiTile: 0, physics: 1 }, { id: 183, rotation: 768, surface: 1, multiTile: 0, physics: 1 }, { id: 184, rotation: 512, surface: 1, multiTile: 0, physics: 1 }, { id: 185, rotation: 256, surface: 1, multiTile: 0, physics: 1 }, { id: 186, rotation: 0, surface: 2, multiTile: 0, physics: 1 }, { id: 187, rotation: 768, surface: 2, multiTile: 0, physics: 1 }, { id: 188, rotation: 512, surface: 2, multiTile: 0, physics: 1 }, { id: 189, rotation: 256, surface: 2, multiTile: 0, physics: 1 }, { id: 190, rotation: 0, surface: 3, multiTile: 0, physics: 1 }, { id: 191, rotation: 768, surface: 3, multiTile: 0, physics: 1 }, { id: 192, rotation: 512, surface: 3, multiTile: 0, physics: 1 }, { id: 193, rotation: 256, surface: 3, multiTile: 0, physics: 1 }, { id: 194, rotation: 0, surface: 1, multiTile: 0, physics: 19 }, { id: 195, rotation: 768, surface: 1, multiTile: 0, physics: 19 }, { id: 196, rotation: 512, surface: 1, multiTile: 0, physics: 19 }, { id: 197, rotation: 256, surface: 1, multiTile: 0, physics: 19 }, { id: 198, rotation: 0, surface: 1, multiTile: 3, physics: 32 }, { id: 199, rotation: 768, surface: 1, multiTile: 3, physics: 32 }, { id: 200, rotation: 512, surface: 1, multiTile: 3, physics: 32 }, { id: 201, rotation: 256, surface: 1, multiTile: 3, physics: 32 }, { id: 202, rotation: 0, surface: 1, multiTile: 3, physics: 33 }, { id: 203, rotation: 768, surface: 1, multiTile: 3, physics: 33 }, { id: 204, rotation: 512, surface: 1, multiTile: 3, physics: 33 }, { id: 205, rotation: 256, surface: 1, multiTile: 3, physics: 33 }, { id: 206, rotation: 0, surface: 1, multiTile: 1, physics: 27 }, { id: 207, rotation: 256, surface: 1, multiTile: 2, physics: 27 }, { id: 208, rotation: 0, surface: 1, multiTile: 0, physics: 28 }, { id: 209, rotation: 256, surface: 1, multiTile: 0, physics: 28 }, { id: 210, rotation: 0, surface: 1, multiTile: 0, physics: 30 }, { id: 211, rotation: 256, surface: 1, multiTile: 0, physics: 30 }, { id: 212, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 213, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 214, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 215, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 216, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 217, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 218, rotation: 768, surface: 1, multiTile: 0, physics: 255 }, { id: 219, rotation: 512, surface: 1, multiTile: 0, physics: 255 }, { id: 220, rotation: 256, surface: 1, multiTile: 0, physics: 255 }, { id: 221, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 222, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 223, rotation: 768, surface: 1, multiTile: 0, physics: 255 }, { id: 224, rotation: 512, surface: 1, multiTile: 0, physics: 255 }, { id: 225, rotation: 256, surface: 1, multiTile: 0, physics: 255 }, { id: 226, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 227, rotation: 768, surface: 1, multiTile: 0, physics: 255 }, { id: 228, rotation: 512, surface: 1, multiTile: 0, physics: 255 }, { id: 229, rotation: 256, surface: 1, multiTile: 0, physics: 255 }, { id: 230, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 231, rotation: 768, surface: 1, multiTile: 0, physics: 255 }, { id: 232, rotation: 512, surface: 1, multiTile: 0, physics: 255 }, { id: 233, rotation: 256, surface: 1, multiTile: 0, physics: 255 }, { id: 234, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 235, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 236, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 237, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 238, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 239, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 240, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 241, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 242, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 243, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 244, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 245, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 246, rotation: 0, surface: 1, multiTile: 0, physics: 255 }, { id: 247, rotation: 25965, surface: 102, multiTile: 0, physics: 99 }, { id: 248, rotation: 25344, surface: 98, multiTile: 50, physics: 0 }, { id: 249, rotation: 48, surface: 102, multiTile: 112, physics: 50 }, { id: 250, rotation: 13168, surface: 1, multiTile: 97, physics: 114 }, { id: 251, rotation: 29281, surface: 51, multiTile: 101, physics: 120 }, { id: 252, rotation: 30821, surface: 113, multiTile: 0, physics: 101 }, { id: 253, rotation: 0, surface: 1, multiTile: 0, physics: 0 }, { id: 254, rotation: 0, surface: 2, multiTile: 1, physics: 133 }, { id: 255, rotation: 0, surface: 255, multiTile: 254, physics: 242 }];

  // stunts-hd-track-editor-github/scripts/native-validation-entry.ts
  function check(raw, details = false) {
    const result = analyzeRoute(raw, route_records_default, route_vectors_default, [], track_objects_default, void 0, { sample: false });
    const error = result.route?.error ?? result.terrainError?.error ?? 0;
    const route = result.route, last = (route?.count ?? 0) - 1;
    const previous = last < 0 ? null : { x: route.columns[last], y: route.routeRows[last], tile: route.tiles[last], state: route_records_default[route.tiles[last]].records[route.directions[last] & 15][route.directions[last] & 16 ? 3 : 4] };
    return { error, location: error ? result.location : null, kind: result.terrainError ? "terrain" : "route", pieces: route?.count ?? 0, previous, ...details && route ? { nodes: route.columns.map((x, i) => {
      const tile = route.tiles[i], record = route_records_default[tile].records[route.directions[i] & 15];
      return { x, y: route.routeRows[i], tile, heading: (record[6] + 256 * record[7] + (route.directions[i] & 16 ? 512 : 0)) % 1024 };
    }) } : {} };
  }
  return __toCommonJS(native_validation_entry_exports);
})();

export const nativeRouteCheck=StuntsNativeRoute.check;

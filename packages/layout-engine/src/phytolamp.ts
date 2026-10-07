import type { Phytolamp, Placement, Position } from '@chainers/shared-types';
import { Grid } from './grid.js';

export interface PlotPosition extends Position {
  instanceId: string;
}

export interface PhytolampCoverage {
  lampPosition: Position;
  lampId: string;
  coveredPlots: Position[];
  coveredPlotIds: string[];
  overlapPenalty: number;
}

interface Candidate {
  position: Position;
  plotIds: string[];
  plotPositions: Position[];
}

function distanceSquared(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function optimizePhytolampPlacement(
  lamps: Phytolamp[],
  plots: PlotPosition[],
  grid: Grid,
): PhytolampCoverage[] {
  const covered = new Set<string>();
  const chosen = new Set<string>();
  const result: PhytolampCoverage[] = [];

  for (const [lampIndex, lamp] of lamps.entries()) {
    const radiusSquared = lamp.coverageRadius * lamp.coverageRadius;
    const candidates: Candidate[] = grid.freePositions().map((position) => {
      const inRange = plots.filter((plot) => distanceSquared(position, plot) <= radiusSquared);
      return {
        position,
        plotIds: inRange.map((plot) => plot.instanceId),
        plotPositions: inRange.map(({ x, y }) => ({ x, y })),
      };
    });

    candidates.sort((a, b) => {
      const aNew = a.plotIds.filter((id) => !covered.has(id)).length;
      const bNew = b.plotIds.filter((id) => !covered.has(id)).length;
      const aOverlap = a.plotIds.length - aNew;
      const bOverlap = b.plotIds.length - bNew;
      return bNew - aNew || aOverlap - bOverlap || a.position.y - b.position.y || a.position.x - b.position.x;
    });

    const candidate = candidates.find((entry) => !chosen.has(`${entry.position.x},${entry.position.y}`));
    if (!candidate) break;

    const instanceId = `${lamp.id}#${lampIndex + 1}`;
    const placement: Placement = {
      instanceId,
      itemId: lamp.id,
      itemType: 'phytolamp',
      x: candidate.position.x,
      y: candidate.position.y,
      width: 1,
      height: 1,
      rotation: 0,
    };
    grid.place(placement);
    chosen.add(`${candidate.position.x},${candidate.position.y}`);

    const assignedIds: string[] = [];
    const assignedPositions: Position[] = [];
    for (let index = 0; index < candidate.plotIds.length; index += 1) {
      const plotId = candidate.plotIds[index];
      const position = candidate.plotPositions[index];
      if (plotId && position && !covered.has(plotId)) {
        covered.add(plotId);
        assignedIds.push(plotId);
        assignedPositions.push(position);
      }
    }
    result.push({
      lampPosition: candidate.position,
      lampId: instanceId,
      coveredPlots: assignedPositions,
      coveredPlotIds: assignedIds,
      overlapPenalty: candidate.plotIds.length - assignedIds.length,
    });
  }

  return result;
}

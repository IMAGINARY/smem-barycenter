import * as d3 from 'd3-selection';
import { Point } from './barycenter';

interface Mode {
  ctx: CanvasRenderingContext2D;
  path: Point[];
  activate(): void; // Prepares the user interaction (sets the event handlers, etc.
  deactivate(): void; // Cleans all the user interaction and rendered features.
}

interface ModeConfig {
  modeName: string;
  icon: string;
  mode: Mode;
}

// Create toolbar buttons
function createModeButton(modeconfig: ModeConfig): HTMLSpanElement {
  const container = document.createElement('span');
  const button = d3
    .select(container)
    .append('button')
    .classed('toolbar-button', true)
    .attr('id', `btn-${modeconfig.modeName}`);

  button.append('img').attr('src', modeconfig.icon);

  //   button
  //     .append('div')
  //     .classed('translate', true)
  //     .attr('data-i18n', modeconfig.textKey);

  //   button.on('click', () => {
  //     switchPrimaryMode(modeconfig);
  //   });

  return container;
}

export { Mode, ModeConfig, createModeButton };

import { createReducer, on } from '@ngrx/store';
import {
    addLayer,
    removeLayer,
    addLayerConf,
    addLayerList
} from './ui.action';
import { UIState } from './ui.state';

/** initial values to Explore State */
const initialState: UIState = {
  layer: null,
  layerToDisabled: null,
  layer_conf: null,
  list_ids: []
};

export interface AppState {
  ui: UIState;
}

export const reducer = createReducer(initialState,
    on(addLayer, (state, payload) => {
      return { ...state, layer: payload };
    }),
    on(removeLayer, (state, payload) => {
      return { ...state, layerToDisabled: payload };
    }),
    on(addLayerConf, (state, payload) => {
      return { ...state, layer_conf: payload };
    }),
    on(addLayerList, (state, payload) => {
      return { ...state, list_ids: payload };
    }),
)
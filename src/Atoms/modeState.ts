import { atom } from 'jotai';
import type { Mode } from '../type/Shape';
import { SHAPE } from '../utils/constants/constants';

export const modeAtom = atom<Mode>(SHAPE.Select);

import { CUSTOM_FIELD_MAX_SIZE, CUSTOM_FIELD_MIN_SIZE } from '../constants/game'

export const clampFieldSize = (value: number): number =>
  Math.min(CUSTOM_FIELD_MAX_SIZE, Math.max(CUSTOM_FIELD_MIN_SIZE, value))

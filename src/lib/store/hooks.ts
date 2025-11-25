/**
 * Typed Redux Hooks
 * Provides type-safe hooks for Redux store access
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed useDispatch hook
 * Use this instead of plain useDispatch
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useSelector hook
 * Use this instead of plain useSelector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


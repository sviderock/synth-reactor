import React from 'react';

export function genId(prefix) {
  return prefix + "-" + Math.random().toString(36).substr(2, 9);
}

export const NOTES_AMOUNT = 16;
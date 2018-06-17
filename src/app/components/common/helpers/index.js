import React from 'react';

export function genId(prefix) {
  return prefix + "-" + Math.random().toString(36).substr(2, 9);
}

export const NOTES_AMOUNT = 16;

export const colors = [
  {bg: '#247BA0', text: '#fff'},
  {bg: '#9FD356', text: '#fff'},
  {bg: '#DD614A', text: '#fff'},
  {bg: '#FADF63', text: '#000'},
  {bg: '#E7EB90', text: '#fff'},
  {bg: '#EA8C3', text: '#fff'},
  {bg: '#F2D492', text: '#000'}
];

export const palette = {
  blue: '#3C91E6',
  green: '#9BCC48',
  black: '#342E37',
  white: '#FAFFFD',
  peach: '#FA824C',
  peachDark: '#fa5216'
};
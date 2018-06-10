import http from './http';

export function getFiles() {
  const url = 'http://localhost:8080/getFiles';
  return http.get({ url });
}
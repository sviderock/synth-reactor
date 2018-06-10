let exec = function(config = {}){
  if (!config.headers) config.headers = {};
  let callbacks = {
    success: () => {},
    error: () => {},
    start: () => {},
    progress: () => {}
  };

  let xhr = new XMLHttpRequest();

  xhr.upload.onprogress = res => callbacks.progress(res.loaded/res.total * 100);
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) { return }
    let json;

    console.log(xhr.response)
    try { json = JSON.parse(xhr.response) } catch(e) { json = { errors: [e.message] } }
    if (xhr.status === 200) {
      callbacks.success(json);
    } else {
      callbacks.error(json, xhr.status);
    }
  };
  xhr.open(config.method, config.url, true);
  if (!config.skipHeaders) {
    if(localStorage.session_token) xhr.setRequestHeader('Session-Token', localStorage.session_token);
  }
  for (let key in config.headers) { xhr.setRequestHeader(key, config.headers[key]) }
  xhr.send(config.body);
  let obj = {
    success: callback => {
      callbacks.success = callback;
      return obj;
    },
    error: callback => {
      callbacks.error = callback;
      return obj;
    },
    progress: callback => {
      callbacks.progress = callback;
      return obj;
    },
    start: callback => {
      callbacks.start = callback;
      return obj;
    }
  };

  return obj;
};

export default {
  exec:   exec,
  get:    config => exec({ ...config, method: 'GET' }),
  post:   config => exec({ ...config, method: 'POST' }),
  put:    config => exec({ ...config, method: 'PUT' }),
  delete: config => exec({ ...config, method: 'DELETE'})
};
import { recognizerLogger as logger } from '../../../configuration/LoggerConfig';
import * as RecognizerContext from '../../../model/RecognizerContext';


/**
 * Close the websocket
 * @param {WebSocket} websocket Current WebSocket
 * @param {Number} code Exit code
 * @param {String} reason Exit reason
 */
export function close(websocket, code, reason) {
  if (websocket && websocket.readyState < 2) {
    websocket.close(code, reason);
  }
}

function infinitPing(websocket) {
  const websocketref = websocket;
  websocketref.pingCount++;
  if (websocketref.pingCount > websocketref.maxPingLost) {
    websocket.close(1000, 'PING_LOST');
  } else if (websocketref.readyState <= 1) {
    setTimeout(() => {
      websocketref.send('{"type":"ping"}');
      infinitPing(websocketref);
    }, websocketref.pingIntervalMillis);
  }
}

/**
 * Attach all socket attributs helping managing server connexion and reconnexio.n
 * @param socketParam
 * @param options
 *
 */
function addWebsocketAttributes(socketParam, recognizerContext) {
  const socket = socketParam;
  socket.start = new Date();
  socket.pingCount = 0;
  socket.pingIntervalMillis = recognizerContext.options.recognitionParams.server.websocket.pingIntervalMillis;
  socket.maxPingLost = recognizerContext.options.recognitionParams.server.websocket.maxPingLostCount;
  socket.autoReconnect = recognizerContext.options.recognitionParams.server.websocket.autoReconnect;
  socket.maxRetryCount = recognizerContext.options.recognitionParams.server.maxRetryCount;
  socket.recognizerContext = recognizerContext;
}

/**
 * @param {String} url URL
 * @param {function} callback Callback function to be notified of WebSocket changes
 * @return {WebSocket} Opened WebSocket
 */
export function openWebSocket(recognizerContext) {
  // eslint-disable-next-line no-undef
  const socket = new WebSocket(recognizerContext.url);
  addWebsocketAttributes(socket, recognizerContext);
  infinitPing(socket);

  socket.onopen = (e) => {
    logger.debug('onOpen');
    recognizerContext.callback(e);
  };

  socket.onclose = (e) => {
    logger.debug('onClose', new Date() - socket.start);
    recognizerContext.callback(e);
  };

  socket.onerror = (e) => {
    logger.debug('onError');
    recognizerContext.callback(e);
  };

  socket.onmessage = (e) => {
    logger.debug('onMessage');
    socket.pingCount = 0;
    socket.maxRetryCount = 0;
    const callBackParam = {
      type: e.type,
      data: JSON.parse(e.data)
    };
    recognizerContext.callback(callBackParam);
  };

  return socket;
}

/**
 * Send data message
 * @param {WebSocket} websocket Current WebSocket
 * @param {Object} message Data message
 */
export function send(recognizerContext, message) {
  const websocket = recognizerContext.websocket;
  const state = websocket.readyState;
  if (state <= 1) {
    websocket.send(JSON.stringify(message));
  } else {
    throw RecognizerContext.LOST_CONNEXION_MESSAGE;
  }
}

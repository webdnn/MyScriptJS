import assign from 'assign-deep';
import MyScriptJSConstants from './MyScriptJSConstants';

/**
 * @typedef {Object} ServerParameters
 * @property {String} scheme
 * @property {String} host
 * @property {String} applicationKey
 * @property {String} hmacKey
 */

/**
 * Parameters to be used for rendering
 * @typedef {Object} RenderingParameters
 * @property {String} renderer Renderer type to used
 * @property {String} stroker Stroker name to used
 */

/**
 * Parameters to be used for recognition
 * @typedef {Object} RecognitionParameters
 * @property {String} triggerRecognitionOn
 * @property {Number} triggerRecognitionQuietPeriod
 * @property {Number} triggerCallbacksAndRenderingQuietPeriod
 * @property {String} type Recognition type (TEXT, MATH, SHAPE, MUSIC, ANALYZER).
 * @property {String} protocol REST or WEBSOCKET to choose the API to use.
 * @property {String} apiVersion Version of the api to use.
 * @property {ServerParameters} server
 * @property {Number} nbRetry
 * @property {Number} xyFloatPrecision Precision of x and y from 0 to 10 (integer). More the value is high more precise will be the point capture but object in memory and send to the server will be heavier.
 * @property {Number} timestampFloatPrecision
 * @property {Object} mathParameter Parameters of the math recognition if in use.
 * @property {Object} textParameter Parameters of the text recognition if in use.
 * @property {Object} shapeParameter Parameters of the shape recognition if in use.
 * @property {Object} musicParameter Parameters of the music recognition if in use.
 * @property {Object} analyzerParameter Parameters of the analyzer recognition if in use.
 */

/**
 * {@link InkPaper} options
 * @typedef {Object} Options
 * @property {Number} undoRedoMaxStackSize Number of strokes keep in undo redo stack.
 * @property {RenderingParameters} renderingParams Rendering parameters.
 * @property {RecognitionParameters} recognitionParams Recognition parameters.
 */

/**
 * Default options
 * @type {Options}
 */
const defaultOptions = {
  // see @typedef documentation on top
  undoRedoMaxStackSize: 20,
  renderingParams: {
    renderer: 'canvas',
    stroker: 'quadratic'
  },
  recognitionParams: {
    // Configure when the recognition is trigger.
    // PEN_UP : Recognition is triggered on every PenUP. This is the recommended mode for CDK V3 WebSocket recognitions.
    // QUIET_PERIOD : Recognition is triggered after a quiet period in milli-seconds on every pen up. I value is set to 2000 for example the recognition will be fired  when user stop writing 2 seconds. This is the recommended mode for all REST recognitions.
    triggerRecognitionOn: MyScriptJSConstants.RecognitionTrigger.PEN_UP,
    triggerRecognitionQuietPeriod: 2000,
    // When recognition is in PEN_UP mode, quiet period duration in millisecond while inkPaper wait for another recognition before triggering the display and the call to configured callbacks.
    triggerCallbacksAndRenderingQuietPeriod: 1000,
    type: MyScriptJSConstants.RecognitionType.TEXT,
    protocol: MyScriptJSConstants.Protocol.WEBSOCKET,
    apiVersion: 'V3',
    server: {
      scheme: 'https',
      host: 'cloud-internal-stable.visionobjects.com',
      applicationKey: '64e1afbf-f3a7-4d04-bce1-24b05ee0b2d6',
      hmacKey: '88d81b71-13cd-41a0-9206-ba367c21900f',
      maxRetryCount: 2,
      websocket: {
        pingPongActivate: false,
        maxPingLostCount: 10,
        pingIntervalMillis: 5000,
        // Will try to reconnect when websocket is close or when a timeout is detected. Do not handle the case when user change network on his device.
        autoReconnect: true
      }
    },
    xyFloatPrecision: 0,
    timestampFloatPrecision: 0,
    mathParameter: {
      resultTypes: ['LATEX', 'MATHML'],
      columnarOperation: false,
      userResources: [],
      scratchOutDetectionSensitivity: 1,
    },
    textParameter: {
      language: 'en_US',
      textInputMode: MyScriptJSConstants.InputMode.CURSIVE,
      resultDetail: MyScriptJSConstants.ResultDetail.TEXT,
      textProperties: {
        textCandidateListSize: 3
      }
    },
    shapeParameter: {
      rejectDetectionSensitivity: 1,
      doBeautification: true
    },
    musicParameter: {
      divisions: 480,
      resultTypes: ['MUSICXML', 'SCORETREE'],
      userResources: [],
      staff: {
        top: 100,
        count: 5,
        gap: 20
      },
      clef: {
        symbol: 'G',
        octave: 0,
        line: 2
      }
    },
    analyzerParameter: {
      textParameter: {
        textProperties: {},
        language: 'en_US',
        textInputMode: MyScriptJSConstants.InputMode.CURSIVE
      }
    }
  }
};

/**
 * Generate parameters
 * @param {Options} options Configuration to be used
 * @return {Options} Overridden configuration
 */
export function overrideDefaultOptions(options) {
  return assign({}, defaultOptions, options === undefined ? {} : options);
}

export default defaultOptions;
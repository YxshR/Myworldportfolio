export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(context && context instanceof WebGLRenderingContext);
  } catch {
    return false;
  }
};

export const isWebGL2Available = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    return !!(context && context instanceof WebGL2RenderingContext);
  } catch {
    return false;
  }
};

export const getWebGLErrorMessage = (): string => {
  return `
    Your browser does not support WebGL or it is disabled.
    Please enable WebGL in your browser settings or try a different browser.
    
    Supported browsers:
    - Chrome 9+
    - Firefox 4+
    - Safari 5.1+
    - Edge 12+
  `;
};
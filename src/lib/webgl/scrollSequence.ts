const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTexture;
uniform vec2 uCoverScale;
uniform vec2 uOffset;
uniform float uFeather;

void main() {
  vec2 uv = (vUv - 0.5) * uCoverScale + 0.5 + uOffset;

  vec2 sampleUv = clamp(uv, 0.0, 1.0);
  vec4 color = texture(uTexture, sampleUv);

  float inX = step(0.0, uv.x) * step(uv.x, 1.0);
  float inY = step(0.0, uv.y) * step(uv.y, 1.0);
  float inside = inX * inY;

  float fx = smoothstep(0.0, 0.26, vUv.x) * smoothstep(1.0, 0.80, vUv.x);
  float fy = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
  float feather = mix(1.0, fx * fy, uFeather);

  // 🔥 YAHAN MAGIC FIX HAI 🔥
  // color.a (image ki apni transparency) ko lazmi multiply karna hai
  float alpha = color.a * inside * feather;

  // Premultiplied output
  outColor = vec4(color.rgb * alpha, alpha);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(log);
  }

  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) throw new Error("Unable to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? "Unknown program error";
    gl.deleteProgram(program);
    throw new Error(log);
  }

  return program;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load frame: ${src}`));
    image.src = src;
  });
}

export type ScrollSequenceFit = "cover" | "contain";

export type ScrollSequenceRendererOptions = {
  imageWidth: number;
  imageHeight: number;
  framePaths: string[];
  fit?: ScrollSequenceFit;
  feather?: boolean;
  /** Extra fill scale on top of the cover/contain fit. 1 = none, >1 zooms in. */
  zoom?: number;
  /** Horizontal anchor of the visible crop: 0 = left, 0.5 = center, 1 = right. */
  focusX?: number;
  /** Vertical anchor of the visible crop: 0 = top, 0.5 = center, 1 = bottom. */
  focusY?: number;
};

export class ScrollSequenceRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private texture: WebGLTexture;
  private vao: WebGLVertexArrayObject;
  private uTexture: WebGLUniformLocation;
  private uCoverScale: WebGLUniformLocation;
  private uOffset: WebGLUniformLocation;
  private uFeather: WebGLUniformLocation;
  private images: HTMLImageElement[] = [];
  private currentFrame = -1;
  private imageWidth: number;
  private imageHeight: number;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private fit: ScrollSequenceFit;
  private feather: boolean;
  private zoom: number;
  private focusX: number;
  private focusY: number;
  ready = false;

  constructor(
    private canvas: HTMLCanvasElement,
    {
      imageWidth,
      imageHeight,
      framePaths,
      fit = "cover",
      feather = true,
      zoom = 1,
      focusX = 0.5,
      focusY = 0.5,
    }: ScrollSequenceRendererOptions,
  ) {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) throw new Error("WebGL2 is not supported");

    this.gl = gl;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.fit = fit;
    this.feather = feather;
    this.zoom = zoom;
    this.focusX = focusX;
    this.focusY = focusY;
    this.program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);

    const uTexture = gl.getUniformLocation(this.program, "uTexture");
    const uCoverScale = gl.getUniformLocation(this.program, "uCoverScale");
    const uOffset = gl.getUniformLocation(this.program, "uOffset");
    const uFeather = gl.getUniformLocation(this.program, "uFeather");

    if (!uTexture || !uCoverScale || !uOffset || !uFeather) {
      throw new Error("Missing shader uniforms");
    }

    this.uTexture = uTexture;
    this.uCoverScale = uCoverScale;
    this.uOffset = uOffset;
    this.uFeather = uFeather;

    this.texture = gl.createTexture()!;
    this.vao = gl.createVertexArray()!;

    gl.bindVertexArray(this.vao);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(this.program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    void this.preload(framePaths);
  }

  private async preload(framePaths: string[]) {
    this.images = new Array(framePaths.length);

    const first = await loadImage(framePaths[0]);
    this.images[0] = first;
    this.ready = true;
    this.setFrame(0);
    this.render();

    // Load the next frames in order so autoplay can advance immediately.
    const warmup = Math.min(24, framePaths.length);
    for (let i = 1; i < warmup; i++) {
      this.images[i] = await loadImage(framePaths[i]);
    }

    await Promise.all(
      framePaths.slice(warmup).map(async (path, offset) => {
        const image = await loadImage(path);
        this.images[offset + warmup] = image;
      }),
    );
  }

  resize(width: number, height: number, dpr = 1) {
    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));

    if (pixelWidth === this.canvasWidth && pixelHeight === this.canvasHeight) return;

    this.canvasWidth = pixelWidth;
    this.canvasHeight = pixelHeight;
    this.canvas.width = pixelWidth;
    this.canvas.height = pixelHeight;

    const { gl } = this;
    gl.viewport(0, 0, pixelWidth, pixelHeight);
    this.render();
  }

  /** Returns true when the requested frame is on the GPU (loaded and applied). */
  setFrame(index: number): boolean {
    if (!this.ready) return false;

    const image = this.images[index];
    if (!image) return false;

    if (index !== this.currentFrame) {
      const { gl } = this;
      this.currentFrame = index;

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    return true;
  }

  render() {
    if (!this.ready || this.currentFrame < 0) return;

    const { gl } = this;
    // premultipliedAlpha:true requires RGB=0 when alpha=0; any non-zero RGB
    // with alpha=0 is invalid and causes browsers to composite it as a dark tint.
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uTexture, 0);

    const [baseX, baseY] = this.getFitScale();
    const zoom = Math.max(this.zoom, 0.0001);
    const scaleX = baseX / zoom;
    const scaleY = baseY / zoom;
    // Anchor the visible crop horizontally/vertically. With scale < 1 the
    // shader samples a sub-region; the offset slides that window so e.g.
    // focusY = 1 pins the bottom of the frame to the bottom of the canvas
    // (cropping the empty headroom at the top of the source footage).
    const offsetX = (this.focusX - 0.5) * (1 - scaleX);
    // Y is inverted because the texture is uploaded flipped (UNPACK_FLIP_Y),
    // so focusY = 1 shows the bottom of the source frame.
    const offsetY = (0.5 - this.focusY) * (1 - scaleY);

    gl.uniform2f(this.uCoverScale, scaleX, scaleY);
    gl.uniform2f(this.uOffset, offsetX, offsetY);
    gl.uniform1f(this.uFeather, this.feather ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  private getFitScale(): [number, number] {
    if (!this.canvasWidth || !this.canvasHeight) return [1, 1];

    const canvasAspect = this.canvasWidth / this.canvasHeight;
    const imageAspect = this.imageWidth / this.imageHeight;

    if (this.fit === "contain") {
      if (canvasAspect > imageAspect) {
        return [imageAspect / canvasAspect, 1];
      }

      return [1, imageAspect / canvasAspect];
    }

    if (canvasAspect > imageAspect) {
      return [1, canvasAspect / imageAspect];
    }

    return [imageAspect / canvasAspect, 1];
  }

  destroy() {
    const { gl } = this;
    gl.deleteTexture(this.texture);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
    this.images = [];
    this.ready = false;
    this.currentFrame = -1;
  }
}

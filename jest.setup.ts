import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const originalWarn = console.warn;
console.warn = (...args) => {
  if (String(args[0]).includes("MUI Grid")) return;
  originalWarn(...args);
};
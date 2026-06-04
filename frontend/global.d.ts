// Allow importing .glsl files as strings if you later split shaders into files.
declare module "*.glsl" {
  const value: string;
  export default value;
}
declare module "*.vert" {
  const value: string;
  export default value;
}
declare module "*.frag" {
  const value: string;
  export default value;
}

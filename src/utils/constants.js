const BuiltinsMatrix = {
  ModelMatrix: {
    name : "ModelMatrix",
    size : 64,
  },
  ModelViewMatrix: {
    name : "ModelViewMatrix",
    size : 64,
  },
  NormalMatrix: {
    name : "NormalMatrix",
    size : 64,
  },
};
const BuiltinsUniform = {
  TransformUniform: {
    binding : 1,
    name    : "TransformUniform",
    items   : [
      BuiltinsMatrix.ModelMatrix,
      BuiltinsMatrix.ModelViewMatrix,
      BuiltinsMatrix.NormalMatrix,
    ],
  },
};
var $$ = {
  Builtins: {
    Matrix  : BuiltinsMatrix,
    Uniform : BuiltinsUniform,
  },
};

export { $$ as default };

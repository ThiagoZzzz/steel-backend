/* 
 Envuelve un handler async del controller para capturar errores automáticamente.
 Elimina la necesidad de try/catch en cada endpoint.
 Si el handler lanza un error, se pasa a next() y lo captura el errorHandler.
*/
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;

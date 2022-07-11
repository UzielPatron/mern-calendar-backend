/* 
    Event route
    /api/events

*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events'); 


const router = Router();

router.use( validarJWT )

// obtener eventos
router.get( '/', getEventos );

//crear un nuevo evento
router.post(
    '/',
    [
        check('title','El título es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos,

    ],
    crearEvento );


//Actualizar evento
router.put( '/:id',[
    check('title','El título es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalización es obligatoria').custom( isDate ),
    validarCampos,

], actualizarEvento );

// borrar evento
router.delete( '/:id', eliminarEvento );


module.exports = router;
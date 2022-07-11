const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async( req, res = response ) => {

    const {  email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne({ email });
        
        if( usuario ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Un usuario ya existe con el correo indicado',
            })
        }


        usuario = new Usuario( req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        await usuario.save();
        
        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

    
        res.status( 201 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token, 
        });
    }
    catch( error ){
        console.log(error)
        res.status( 500 ).json({
            ok: false,
            msg: 'Por Favor hable con el administrador'
        })
    }

};





const loginUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        
        if( !usuario ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            })
        };

        //confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password );
        
        if( !validPassword ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        };

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );


        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    }
    catch( error ){
        console.log(error)
        res.status( 500 ).json({
            ok: false,
            msg: 'Por Favor hable con el administrador'
        })
    };
};





const revalidarToken = async( req, res = response ) => {

    const { uid, name } = req;

    //Generar nuevo JWT y retornarlo  en esta petición 
    const token = await generarJWT( uid, name );


    res.status( 201 ).json({
        ok: true,
        token
    })
}





module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}




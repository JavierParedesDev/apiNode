const express = require('express');
const app = express();
const db = require('./db.js')

app.use(express.json());

app.get('/lista_gastos', (req , res)=>{
    const query = 'SELECT * FROM mirador'

    db.query(query , (err , results)=>{
        if(err){
            console.log("cagaste no hay query", err);
            res.status(500).send("error en el servidor")
            return;
        }
        res.json(results);
    })
})

app.post('/agregar_gastos',(req,res)=>{

    const {id,mes,anio,monto,pagado} = req.body

    if(!id || !mes || !anio || !monto ||!pagado  === undefined){
        console.log("rellene todo los campos");
        return;
    }
    console.log("agregado");

    const query = 'INSERT INTO mirador (id, mes, anio, monto, pagado) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [id, mes, anio, monto, pagado], (err, results) => {
        if (err) {
            console.log("Error al agregar el pago:", err);
            res.status(500).send("Error en el servidor");
            return;
        }
        console.log("Pago agregado");
        res.status(201).send("Pago agregado exitosamente");
    });
})

app.post('/pagar', (req, res) => {
    const { id, mes, anio, monto, pagado } = req.body;

    if (!id || !mes || !anio || !monto || pagado === undefined) {
        console.log("Rellene todos los campos");
        res.status(400).send("Faltan datos necesarios");
        return;
    }

    console.log("Actualizando pago");

    const query = 'UPDATE mirador SET monto = ?, pagado = ? WHERE id = ? AND mes = ? AND anio = ?';

    db.query(query, [monto, pagado, id, mes, anio], (err, results) => {
        if (err) {
            console.log("Error al actualizar el pago:", err);
            res.status(500).send("Error en el servidor");
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send("No se encontró el registro para actualizar");
            return;
        }

        console.log("Pago actualizado");
        res.status(200).send("Pago actualizado exitosamente");
    });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log("CONECTADO AL PUERTO 3000");
})
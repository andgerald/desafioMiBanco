const pool = require("./dbConfig.js");
const errors = require("./errores.js");

// variables globales de index.js
let status = "";
let message = "";

//Capturar los valores de la linea  de comando
const args = process.argv.slice(2);
const funcion = args[0];
const descripcion = args[1];
const fecha = args[2];
const monto = args[3];
const cuenta_origen = args[4];
const cuenta_destino = args[5];

//funcion transferencias
const transferencia = async ({
  descripcion,
  fecha,
  monto,
  cuenta_origen,
  cuenta_destino,
}) => {
  try {
    if (!descripcion || !fecha || !monto || !cuenta_origen || !cuenta_destino) {
      console.log("Todos los parámetros deben ser proporcionados");
      return;
    }
    await pool.query("BEGIN");
    const resta =
      "update cuentas set saldo = saldo - $1 where id= $2 returning *";
    const res1 = await pool.query(resta, [monto, cuenta_origen]);
    console.log("descuento exitoso", res1.rows[0]);

    const suma =
      "update  cuentas set saldo = saldo + $1 where id= $2 returning *";
    const res2 = await pool.query(suma, [monto, cuenta_destino]);
    console.log("adicion de saldo exitoso", res2.rows[0]);

    const transferencia =
      "insert into transferencias (descripcion,fecha,monto,cuanta_origen, cuenta_destino)  values($1,$2,$3,$4,$5)";
    const res3 = await pool.query(transferencia, [
      descripcion,
      fecha,
      monto,
      cuenta_origen,
      cuenta_destino,
    ]);
    console.log("Transferencia exitosa :", res3.rows[0]);

    await pool.query("COMMIT");
  } catch (e) {
    await pool.query("ROLLBACK");
    console.log("Error conexion o instruccion, Transaccion abortada");
    return "*** Error en transaccion, aplicado ROLLBACK: " + e;
  }
};

const movimientos = async ({ id }) => {
  try {
    if (!id) {
      console.log("Favor ingresar un ID");
      return;
    }
    const busqueda =
      "select * from  transferencias where cuanta_origen = $1  order by fecha desc limit 10";
    const res = await pool.query(busqueda, [id]);
    if (res.rowCount === 0) {
      console.log("el ID", id, "no existe en la base de datos");
      return;
    }
    console.log("Informacion de la cuenta:", res.rows);
  } catch (e) {
    const error = errors(e.code, status, message);
    console.log("Codigo: ", error.code);
    console.log("Estado: ", error.status);
    console.log("Mensaje: ", error.message);
  }
};

const consulta = async ({ id }) => {
  try {
    if (id === undefined) {
      console.log("Debes ingresar un ID");
      return;
    }
    const busqueda = "select * from cuentas where id=$1";
    const res = await pool.query(busqueda, [id]);

    if (res.rowCount === 0) {
      console.log("el ID", id, "no existe en la base de datos");
      return;
    }
    console.log("Informacion de la cuenta:", res.rows[0]);
  } catch (e) {
    const error = errors(e.code, status, message);
    console.log("Codigo: ", error.code);
    console.log("Estado: ", error.status);
    console.log("Mensaje: ", error.message);
  }
};

(async () => {
  const id = descripcion;
  switch (funcion) {
    case "transferencia":
      transferencia({
        descripcion,
        fecha,
        monto,
        cuenta_origen,
        cuenta_destino,
      });
      break;
    case "consulta":
      consulta({ id });
      break;
    case "movimientos":
      movimientos({ id });
      break;
    default:
      console.log("Funcion: " + funcion + " no es valida");
      break;
  }
})();

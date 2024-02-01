/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [datos, setDatos] = useState([]);
  const inputNombreRef = useRef(null);
  const inputEdadRef = useRef(null);
  const inputSalarioRef = useRef(null);

  const leerDatos = async () => {
    const response = await fetch("http://localhost:3000/tareas");
    const data = await response.json();
    setDatos(data);
  };

  const addDatos = () => {
    if (
      inputNombreRef.current.value === "" ||
      inputEdadRef.current.value === "" ||
      inputSalarioRef.current.value === ""
    ) {
      toast.error("Todos las Datos son obligatorios");
    } else {
      fetch("http://localhost:3000/tareas", {
        method: "POST",
        body: JSON.stringify({
          id: uuidv4(),
          name: inputNombreRef.current.value,
          edad: inputEdadRef.current.value,
          salario: inputSalarioRef.current.value,
        }),
      })
        .then((res) => res.json())
        .then((json) => console.log(json));

      toast.success(`${inputNombreRef.current.value} agregado con suceso!`);
      inputNombreRef.current.value = "";
      inputEdadRef.current.value = "";
      inputSalarioRef.current.value = "";
      inputNombreRef.current.focus();
    }
  };

  const delteDato = (id) => {
    fetch(`http://localhost:3000/tareas/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((json) => console.log(json));

    toast(`Funcionario Eliminado!`, {
      icon: "💀",
    });
  };

  useEffect(() => {
    leerDatos();
  }, [datos]);

  // sumando las edades
  const listaEdad = datos.map((item) => ({
    edad: Math.floor(item.edad),
  }));

  const sumaEdad = listaEdad.reduce((prev, next) => prev + next.edad, 0);

  // Sumando los salarios
  const listaSalario = datos.map((item) => ({
    salario: Math.floor(item.salario),
  }));

  const sumaSalario = listaSalario.reduce(
    (prev, next) => prev + next.salario,
    0
  );

  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          autoFocus
          ref={inputNombreRef}
          type="text"
          placeholder="Nombre"
        />
        <input ref={inputEdadRef} type="text" placeholder="Edad" />
        <input ref={inputSalarioRef} type="number" placeholder="Salario" />
        <button
          onClick={() => {
            addDatos();
          }}
        >
          Agregar
        </button>
      </form>
      {datos.length < 1 ? (
        <h2 className="sinDatos">Ningun Dato encontrado</h2>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Salario</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            {datos.map((item, index) => (
              <tbody key={item.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.edad}</td>
                  <td>R${item.salario}</td>
                  <td>
                    <button
                      onClick={() => delteDato(item.id)}
                      className="btnEliminar"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="resumen">
            <h2>Resumen</h2>
            <div className="resumenDatos">
              <h3>
                Cantidad: <span>{datos.length}</span>
              </h3>
              <h3>
                Promedio de edad:{" "}
                <span>{Math.round(sumaEdad / datos.length)}</span>
              </h3>
              <h3>
                Promedio de salario:{" "}
                <span>{Math.round(sumaSalario / datos.length)}</span>
              </h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

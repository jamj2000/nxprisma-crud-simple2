'use client'

import { useState, useEffect } from 'react'
import {
    newArticulo,
    updateArticulo,
    deleteArticulo
} from '@/lib/actions'


// Simulamos ENUM. Javascript no dispone de este tipo de dato.
const Orden = {
    NOMBRE_ASC: 'NOMBRE_ASC',
    NOMBRE_DESC: 'NOMBRE_DESC',
    PRECIO_ASC: 'PRECIO_ASC',
    PRECIO_DESC: 'PRECIO_DESC',
}


export default function Articulos({ articulos }) {

    const [listaArticulos, setListaArticulos] = useState(articulos)
    const [buscarNombre, setBuscarNombre] = useState('')
    const [buscarDescripcion, setBuscarDescripcion] = useState('')
    const [orden, setOrden] = useState()
    const [formStyle, setFormStyle] = useState('row')


    useEffect(() => {
        switch (orden) {
            case Orden.NOMBRE_ASC:
                setListaArticulos(a => a.toSorted((a, b) => a.nombre.localeCompare(b.nombre)))
                break
            case Orden.NOMBRE_DESC:
                setListaArticulos(a => a.toReversed((a, b) => a.nombre.localeCompare(b.nombre)))
                break
            case Orden.PRECIO_ASC:
                setListaArticulos(a => a.toSorted((a, b) => a.precio - b.precio))
                break
            case Orden.PRECIO_DESC:
                setListaArticulos(a => a.toSorted((a, b) => b.precio - a.precio))
                break
            default: return;
        }
        console.log(orden)
    }, [orden]);


    // console.log(Orden.NOMBRE.DESC)
    async function insertar(formData) {
        const ordenAnterior = orden
        setOrden(Orden.NOMBRE_ASC)
        console.log(Orden.NOMBRE_ASC)
        const articulo = await newArticulo(formData)      // Guardamos en BD

        setListaArticulos([articulo, ...listaArticulos])
        setOrden(ordenAnterior)
    }

    async function eliminar(formData) {
        const id = await deleteArticulo(formData)          // Eliminamos de BD

        setListaArticulos(listaArticulos.filter(a => a.id != id))
    }

    return (
        <>
            <span>ORDENAR </span>
            <button
                className='sort'
                title="Nombre ascendente"
                onClick={() => { setOrden(Orden.NOMBRE_ASC) }}>
                ▼ nombre
            </button>
            <button
                className='sort'
                title="Nombre descendente"
                onClick={() => { setOrden(Orden.NOMBRE_DESC) }}>
                ▲ nombre
            </button>
            <button
                className='sort'
                title="Precio ascendente"
                onClick={() => { setOrden(Orden.PRECIO_ASC) }}>
                ▼ precio
            </button>
            <button
                className='sort'
                title="Precio descendente"
                onClick={() => { setOrden(Orden.PRECIO_DESC) }}>
                ▲ precio
            </button>

            <hr></hr>

            <div>
                <input
                    id='buscarNombre'
                    type="search"
                    placeholder='Buscar por nombre ... '
                    defaultValue={buscarNombre}
                    onChange={(e) => { setBuscarNombre(e.target.value) }} />

                <input
                    id='buscarDescripcion'
                    type="search"
                    placeholder='Buscar por descripción ... '
                    defaultValue={buscarDescripcion}
                    onChange={(e) => { setBuscarDescripcion(e.target.value) }} />
            </div>

            <hr></hr>

            <input type='checkbox' defaultChecked onChange={() => setFormStyle(formStyle == 'row' ? 'column' : 'row')} /> Estilo {`${formStyle}`.toUpperCase()}

            <hr></hr>
            <form className={`${formStyle}`}>
                <input name='nombre' placeholder='nombre' />

                <input name='descripcion' placeholder='descripción' />

                <input name='precio' placeholder='precio en €' type='number' step='0.01' />

                <div style={{ alignSelf: 'flex-end'}}>
                    <button formAction={insertar} title='Nuevo artículo' className='action'>
                        <img src='new.svg' width='24' />
                    </button>
                    <button type='reset' title='Limpiar campos' className='action'>
                        <img src='clean.svg' width='24' />
                    </button>
                </div>
            </form>


            {
                listaArticulos
                    .filter((articulo) => articulo.nombre.toLowerCase().includes(buscarNombre.toLowerCase()) && articulo.descripcion.toLowerCase().includes(buscarDescripcion.toLowerCase()))
                    .map((articulo) => (
                        <form key={articulo.id} className={`${formStyle}`}>
                            <input name='id' value={articulo.id} type='hidden' />

                            <input name='nombre' defaultValue={articulo.nombre} />

                            <input name='descripcion' defaultValue={articulo.descripcion} />

                            <input name='precio' defaultValue={(articulo.precio / 100).toString()} type='number' step='0.01' />

                            <div style={{ alignSelf: 'flex-end'}}>
                                <button formAction={updateArticulo} title='Actualizar artículo' className='action'>
                                    <img src='edit.svg' width='24' />
                                </button>
                                <button formAction={eliminar} title='Eliminar artículo' className='action'>
                                    <img src='delete.svg' width='24' />
                                </button>
                            </div>
                        </form>
                    ))

            }
        </>
    )
}




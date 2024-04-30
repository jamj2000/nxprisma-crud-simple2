import Link from 'next/link'

export default async function Home() {

  return (
    <section>
      <h1>Página de inicio</h1>
      <hr />
      <div> <Link href={"/articulos"}>Listado de artículos</Link> </div>
    </section>
  )
}

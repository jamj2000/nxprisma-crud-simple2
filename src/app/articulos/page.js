import { getArticulos } from '@/lib/actions'
import Articulos from '@/components/Articulos'


async function page() {

    const articulos = await getArticulos()
    
    return (
        <Articulos articulos={articulos} />
    )
}

export default page
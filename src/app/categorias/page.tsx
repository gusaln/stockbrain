import { Categoria } from "@/lib/queries";

export default function Categorias() {
    const categorias: Categoria[] = [];

    return (
        <div className="w-4/5 mx-auto space-y-6">
            <section className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <td>Nombre</td>
                            <td>Descripcion</td>
                            <td></td>
                        </tr>
                    </thead>

                    <tbody>
                        {categorias.map((categoria) => {
                            return (
                                <tr key={categoria.id}>
                                    <td>{categoria.nombre}</td>
                                    <td>{categoria.descripcion}</td>
                                    <td>
                                        <button>editar</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section>
                <form action="" method="post">
                    <div>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" name="nombre" />
                    </div>

                    <div>
                        <label htmlFor="descripcion">Descripción</label>
                        <input type="text" name="descripcion" />
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-950 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-50"
                    >
                        Crear
                    </button>
                </form>
            </section>
        </div>
    );
}

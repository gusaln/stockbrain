export default function CrearCategoria() {
    return (
        <div className="w-4/5 mx-auto space-y-6">
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

import { Usuario } from "../../lib/queries";

export default function Page() {
    const usuarios: Usuario[] = [
        { id: 1, nombre: "Osbert Juschke", email: "ojuschke0@about.com", rol: 1 },
        { id: 2, nombre: "Alejandrina Custard", email: "acustard1@histats.com", rol: 1 },
        { id: 3, nombre: "Kerstin Tench", email: "ktench2@upenn.edu", rol: 1 },
        { id: 4, nombre: "Winona Hollyard", email: "whollyard3@php.net", rol: 1 },
        { id: 5, nombre: "Kenon Shegog", email: "kshegog4@unc.edu", rol: 1 },
        { id: 6, nombre: "Wright Champley", email: "wchampley5@dedecms.com", rol: 1 },
        { id: 7, nombre: "Orland Stanlike", email: "ostanlike6@sciencedirect.com", rol: 1 },
        { id: 8, nombre: "Bernelle McLagan", email: "bmclagan7@deviantart.com", rol: 1 },
        { id: 9, nombre: "Joyous Balma", email: "jbalma8@chicagotribune.com", rol: 1 },
        { id: 10, nombre: "Connie Yashin", email: "cyashin9@php.net", rol: 1 },
        { id: 11, nombre: "Sophi Varvell", email: "svarvella@chronoengine.com", rol: 1 },
        { id: 12, nombre: "Merrilee Lightbowne", email: "mlightbowneb@tinyurl.com", rol: 1 },
        { id: 13, nombre: "Brandie O'Quin", email: "boquinc@indiatimes.com", rol: 1 },
        { id: 14, nombre: "Tilly Percival", email: "tpercivald@answers.com", rol: 1 },
        { id: 15, nombre: "Marrilee Derwin", email: "mderwine@cdbaby.com", rol: 1 },
        { id: 16, nombre: "Catina McDermot", email: "cmcdermotf@unesco.org", rol: 1 },
        { id: 17, nombre: "Reynold Faltin", email: "rfalting@angelfire.com", rol: 1 },
        { id: 18, nombre: "Sibylla Dorkins", email: "sdorkinsh@bigcartel.com", rol: 1 },
        { id: 19, nombre: "Kelcy Wadmore", email: "kwadmorei@bandcamp.com", rol: 1 },
        { id: 20, nombre: "Dagmar Coughtrey", email: "dcoughtreyj@who.int", rol: 1 },
    ];

    return (
        <div className="w-4/5 mx-auto">
            <h1 className="font-semibold underline decoration-wavy decoration-primary underline-offset-2">Usuarios</h1>

            <section className="flex justify-end space-x-2 mb-4">
                <a role="button" className="btn" href="/usuarios/crear">
                    Registrar
                </a>
            </section>

            <section className="card w-full shadow-md">
                <div className="card-body">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {usuarios.map((usuario) => {
                                return (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.email}</td>
                                        <th>
                                            <button className="btn btn-ghost btn-sm">editar</button>
                                        </th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

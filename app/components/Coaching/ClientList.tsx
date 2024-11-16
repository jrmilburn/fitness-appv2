"use client"

import ClientTab from "./ClientTab"

export default function ClientList({ clients }) {

    return (

        <div className="flex flex-col max-w-3xl mx-auto">
            <h2 className="my-4 text-3xl">Clients</h2>
            {clients.map((client) => (
                <ClientTab 
                    key={client.id}
                    client={client}
                />
            ))}
        </div>

    )

}
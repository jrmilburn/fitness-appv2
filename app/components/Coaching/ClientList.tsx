"use client"

import { useState } from "react";
import ClientTab from "./ClientTab"

export default function ClientList({ clients }) {

    const [initialClients, setInitialClients] = useState(clients);

    const handleDeleteClient = async (id) => {
        try {
          const response = await fetch(`/api/coach/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            setInitialClients((prevClients) => prevClients.filter((client) => client.id !== id));
          } else {
            console.error('Failed to delete client');
          }
        } catch (error) {
          console.error(error);
        }
      };

    return (

        <div className="flex flex-col max-w-3xl mx-auto">
            <h2 className="my-4 text-3xl">Clients</h2>
            {initialClients.map((client) => (
                <ClientTab 
                    key={client.id}
                    client={client}
                    onDeleteClient={handleDeleteClient}
                />
            ))}
        </div>

    )

}
"use client"

import { useState } from "react";
import ClientTab from "./ClientTab"
import CoachPrograms from "./CoachPrograms";

export default function ClientList({ clients, programs }) {

    console.log(programs);

    const [initialClients, setInitialClients] = useState(clients);

    const [programsShown, setProgramsShown] = useState(false);
    const [clientId, setClientId] = useState(null);

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

    const handleAssignProgram = async (id) => {

        setClientId(id);
        setProgramsShown(true);

    }

    const handleModalClose = () => {
        setProgramsShown(false);
    }

    return (

        <div className="flex flex-col max-w-screen-sm mx-auto">
            <h2 className="my-4 text-3xl p-4 text-primary-text">Clients</h2>
            {initialClients.map((client) => (
                <ClientTab 
                    key={client.id}
                    client={client}
                    onDeleteClient={handleDeleteClient}
                    onAssignProgram={handleAssignProgram}
                />
            ))}
            {programsShown && (
                <CoachPrograms 
                    programs={programs}
                    onClose={handleModalClose}
                    clientId={clientId} />
            )}
        </div>

    )

}
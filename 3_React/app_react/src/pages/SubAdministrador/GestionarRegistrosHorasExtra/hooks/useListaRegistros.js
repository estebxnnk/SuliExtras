import React from 'react';

export default function useListaRegistros(registrosFiltrados, page, rowsPerPage) {
  const registrosPaginados = React.useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return registrosFiltrados.slice(start, end);
  }, [registrosFiltrados, page, rowsPerPage]);

  return { registrosPaginados };
}



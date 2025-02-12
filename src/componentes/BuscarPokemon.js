import React, { useState } from 'react';
import axios from 'axios';

function BuscarPokemon({ onNumChange }) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  function fetchPokemon() {
    setError('');
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`)
      .then(response => {
        const pokemonId = response.data.id;
        onNumChange(pokemonId); // Actualiza el número en el componente padre
      })
      .catch(() => setError('Pokémon no encontrado.'));
  }

  return (
<div className="search-container">
  <input
    type="text"
    placeholder="Nombre o ID"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button onClick={fetchPokemon}>Buscar</button>
  {error && <p>{error}</p>}
</div>
  );
}

export default BuscarPokemon;

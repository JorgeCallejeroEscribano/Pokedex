import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]); // Lista de Pokémon
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=500')
      .then(async (response) => {
        const pokemonList = response.data.results; // Lista con nombre y URL

        // Hacer una nueva petición para obtener los detalles de cada Pokémon
        const pokemonData = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const res = await axios.get(pokemon.url); // Obtener datos del Pokémon
            return {
              name: res.data.name,
              image: res.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
              type: res.data.types.map(t => t.type.name).join(', ')
            };
          })
        );

        setPokemons(pokemonData);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener los datos.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Lista de Pokémon</h1>
      <div className='listaPokemons'>
        {pokemons.map((pokemon, index) => (
          <div key={index}>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} />
            <p>Tipo: {pokemon.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonList;

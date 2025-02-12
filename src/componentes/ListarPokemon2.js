import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imgInterrogacion from '../imgInterrogacion.png';

function PokemonList2() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgPokemonSelect, setImgPokemonSelect] = useState(imgInterrogacion);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=100') // Reducimos el límite para pruebas más rápidas
      .then(async (response) => {
        const pokemonList = response.data.results;

        const pokemonData = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const res = await axios.get(pokemon.url);
            return {
              name: res.data.name,
              image: res.data.sprites.versions["generation-v"]["black-white"].animated.front_default || imgInterrogacion,
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

  function cambiarImg(num) {
    const pokemon = pokemons[num]; // Acceder directamente por índice
    if (pokemon && pokemon.image) {
      console.log("Imagen cambiada a:", pokemon.image);
      setImgPokemonSelect(pokemon.image);
    } else {
      console.log("No se encontró imagen, usando imagen por defecto.");
      setImgPokemonSelect(imgInterrogacion);
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Lista de Pokémon</h1>
      <div className='listaPokemons2'>
        <div className='imgPokemon'>
        <img key={imgPokemonSelect} src={imgPokemonSelect} alt="Imagen de Pokémon seleccionado" style={{ width: "150px" }} />
        </div>
        {pokemons.map((pokemon, index) => (
          <div key={index} className='nombrepokemon'>
            <h2>{pokemon.name}</h2>
            <button onClick={() => cambiarImg(index)}>Ver img</button> {/* ✅ CORREGIDO */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonList2;


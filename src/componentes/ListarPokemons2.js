import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imgPokebal from './icons/pokeball.png';

function PokemonList({ onNumChange }) {
  const [num, setNum] = useState(1);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      setNum((prevNum) => {
        let newNum = prevNum;
        if (event.key === "ArrowUp" && prevNum > 1) {
          newNum = prevNum - 1;
        } else if (event.key === "ArrowDown" && prevNum != 493) {
          newNum = prevNum + 1;
        }
        onNumChange(newNum); // Notificamos al padre del cambio
        return newNum;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNumChange]);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit= 493")
      .then(async (response) => {
        const pokemonList = response.data.results;

        const pokemonData = await Promise.all(
          pokemonList.map(async (pokemon, index) => {
            const res = await axios.get(pokemon.url);
            return {
              id: index + 1,
              name: res.data.name,
              image:                
              res.data.sprites.other.back_default,
              type: res.data.types.map((t) => t.type.name).join(", "),
            };
          })
        );

        setPokemons(pokemonData);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al obtener los datos.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const filteredPokemons = pokemons.filter((p) =>
    [num - 1, num, num + 1].includes(p.id)
  );

  return (
    <div>
      {filteredPokemons.map((pokemon) => (
        <div 
          key={pokemon.id} 
          className="pokemon" 
          style={{ backgroundColor: pokemon.id === num ? "#ADE69D" : "transparent" }}
        >          
          <p>ID: {pokemon.id}</p>
          <img src={imgPokebal} alt="Pokeball" />
          <h2>{pokemon.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default PokemonList;

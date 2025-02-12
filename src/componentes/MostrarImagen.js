import { useState, useEffect } from "react";
import axios from "axios";

function PokemonInfo({ pokemonId }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false); // Estado para alternar vista

  useEffect(() => {
    if (!pokemonId) return; // Si no hay ID, no hacemos la petición

    setLoading(true);
    setError("");

    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then((response) => {
        setPokemon({
          name: response.data.name,
          image: response.data.sprites.front_default, // Cambiado aquí
          type: response.data.types.map((t) => t.type.name).join(", "),
          height: response.data.height,
          weight: response.data.weight,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Pokémon no encontrado.");
        setLoading(false);
      });
  }, [pokemonId]);

  // Detectar teclas Enter y Escape
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        setShowDetails((prev) => !prev); // Alternar entre imagen y detalles
      } else if (event.key === "Escape") {
        setShowDetails(false); // Volver siempre a la imagen
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!pokemon) return null; // Si no hay datos, no mostramos nada

  return showDetails ? (
    // Vista con detalles del Pokémon
    <div className="pokemonDetails">
      <h2>{pokemon.name}</h2>
      <div className="pokemonContent">
        <img src={pokemon.image} alt={pokemon.name} />
        <div className="pokemonInfo">
          <p><strong>Tipo:</strong> {pokemon.type}</p>
          <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  ) : (
    // Vista con imagen del Pokémon
    <div className="imagenPokemon">
      <img src={pokemon.image} alt={pokemon.name} />
    </div>
  );
}

export default PokemonInfo;

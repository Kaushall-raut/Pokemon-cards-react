import { useEffect, useState } from "react";
import "../index.css";

export const Cards = () => {
  const [detail, setDetail] = useState([]);
  const [load, setLoader] = useState(true);
  const [error, setError] = useState(null);

  const [bool, setBool] = useState(true);
  console.log(bool);

  const [userSelect, setSelected] = useState("all");
  const [userInput, setInput] = useState("");

  // console.log(userSelect);

  const fetchData = async () => {
    try {
      const data = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=150&offset=0"
      );

      const res = await data.json();
      //   console.log(res);

      const detailData = res.results.map(async (element) => {
        // console.log(element.url);

        const get = await fetch(element.url);
        const got = await get.json();
        // console.log(got);

        return got;
      });

      //   console.log(detailData);

      const PokeData = await Promise.all(detailData);

      //   console.log(PokeData);

      setDetail(PokeData);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
      setError(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("data", detail);

  const searchData = detail.filter((element) => {
    if (bool) {
      return element.name.toLowerCase().includes(userInput.toLowerCase());
    } else {
      console.log(element.types[0].type.name.includes(userSelect));
      if (userSelect === "All") {
        return element.name.toLowerCase().includes(userInput.toLowerCase());
      }
      const matchType = element.types.some((value) => {
        return value.type.name.toLowerCase().includes(userSelect.toLowerCase());
      });
      return matchType;
    }
  });

  if (load) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h1>OOPs! something went wrong please try again later</h1>
      </div>
    );
  }

  return (
    <section>
      <h1>Search pokemon</h1>

      <input
        type="text"
        onChange={(e) => {
          setInput(e.target.value);
          setBool(true);
        }}
        value={userInput}
      />
      <select
        name="type"
        id="type"
        onChange={(e) => {
          setSelected(e.target.value);
          setBool(false);
        }}
        value={userSelect}
      >
        <option value="All">All</option>
        <option value="grass">grass</option>
        <option value="fire">fire</option>
        <option value="poison">poison</option>
        <option value="water">water</option>
        <option value="bug">bug</option>
        <option value="flying">flying</option>
      </select>
      <div className="Cards">
        {searchData.map((element, key) => {
          return (
            <div className="pokemon-card" key={key}>
              <img
                src={element.sprites.other.dream_world.front_default}
                alt={"pic"}
              />
              <h2>Name : {element.name}</h2>
              <h3>
                <span>
                  {element.types
                    .map((pokeType) => pokeType.type.name)
                    .join(" , ")}
                </span>
              </h3>
              <div className="grid-3">
                <h4>
                  Height:<span>{element.height}</span>
                </h4>
                <h4>
                  weight:<span>{element.weight}</span>
                </h4>
                <h4>
                  speed:<span>{element.stats[5].base_stat}</span>
                </h4>
              </div>
              <div className="grid-3">
                <div className="row2">
                  <span>{element.stats[1].base_stat}</span>
                  <h4>attack:</h4>
                </div>
                <div className="row2">
                  <span>{element.base_experience}</span>
                  <h4>Exp:</h4>
                </div>
                <div className="row2">
                  <span>{element.stats[2].base_stat}</span>
                  <h4>defense:</h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

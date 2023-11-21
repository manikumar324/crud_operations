//CRUD (Create , Read , Update , Delete) OPERATIONS WITH NODEJS and Sqlite & sqlite3 Database

const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDatabase = async () => {                       // initial set up to connect with database
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000");  //Running our website on a server http://localhost:3000
    });
  } catch (e) {
    console.log(`db error : ${e.message}`);
    process.exit(1);
  }
};
initializeDatabase();

//---------------------------------------- function to convert backend  to frontend --------------------------//

const convertedDataToFrontEnd = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
//--------------------------------------- to get all players data --------------------------//
app.get("/players/", async (request, response) => {
  const playersQuery = `SELECT * FROM cricket_team;`;
  const result = await db.all(playersQuery);
  const cnvertedData = result.map((each) => {
    return convertedDataToFrontEnd(each);
  });
  response.send(cnvertedData);
});

//------------------------------------ to get specified player ----------------------------//

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getParticularPlayerQuery = `select * from cricket_team where player_id = '${playerId}';`;
  const result2 = await db.get(getParticularPlayerQuery);
  response.send(convertedDataToFrontEnd(result2));
});
//-------------------------------------- to add a new player ----------------------------------//
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const playerquery = `INSERT INTO cricket_team (player_name, jersey_number, role) VALUES ('${playerName}', '${jerseyNumber}', '${role}');`;
  const result3 = await db.run(playerquery);
  const result4 = result3.lastID;
  response.send(`Player added with id: '${result4}'`);
});

//---------------------------------------- to update a specific player -----------------------------//

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatequery = `update cricket_team set player_name = '${playerName}',jersey_number = '${jerseyNumber}',role = '${role}' where player_id = '${playerId}';`;
  const result = await db.run(updatequery);
  response.send("Player Details Updated Successfully");
});

// ------------------------------------------  to delete a player ---------------------------------//

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `delete  from cricket_team where player_id = '${playerId}';`;
  const result = await db.run(deleteQuery);
  response.send("Player Deleted successfully");
});